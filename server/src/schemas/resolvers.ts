import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { ObjectIdScalar } from '../types/scalar.js';
import {
    calculatePackageTotalCost,
    calculatePackageClientPrice,
    recalculatePackage,
    recalculateAllPackagesForPlan,
} from '../services/packagePricing.js'

//Type Interfaces
import {
    ColorSchemeType,
    ElevationType,
    StructuralType,
    InteriorOptionType,
    InteriorPackageType,
    ApplianceType,
    AdditionalType,
    PlanType,
    UserPlanType,
    UserPlanPopulated,
    UserType,
    AuthType
} from '../types/graphql.js';

//Inputs
import {
    ColorSchemeInput,
    ElevationInput,
    InteriorOptionInput,
    InteriorPackageInput,
    StructuralInput,
    AdditionalInput,
    ApplianceInput,
    LotInput,
    LotPricingInput,
    PlanInput,
    UserPlanInput,
    CustomizationSelectionsInput,
    UserInput
} from '../types/graphql.js'

//Schemas
import { signToken, AuthenticationError } from '../services/auth.js';
import User from '../models/User.js';
import Plan, { PlanTypeDocument } from '../models/Plan.js';
import ElevationOption from '../models/OptionSchemas/ElevationOption.js';
import ColorScheme, { ColorSchemeDocument } from '../models/OptionSchemas/ColorScheme.js';
import InteriorOption from '../models/OptionSchemas/InteriorOption.js';
import InteriorPackage, { InteriorPackageDocument } from '../models/OptionSchemas/InteriorPackageOption.js';
import StructuralOption from '../models/OptionSchemas/StructuralOption.js';
import AdditionalOption from '../models/OptionSchemas/AdditionalOption.js';
import LotPremium, { LotDocument } from '../models/OptionSchemas/Lot.js';
import LotPricing from '../models/OptionSchemas/LotPricing.js';
import Appliance from '../models/OptionSchemas/Appliance.js';
import UserPlan from '../models/UserPlan.js';
import mongoose from 'mongoose';


//Context Type
export interface Context {
    user?: {
        _id: Types.ObjectId;
        username: string;
        email: string;
        role: 'admin' | 'user';
        homeCount?: number;
        savedPlans?: UserPlanPopulated[]
    };
}

// Helper function to check if user is admin
const requireAdmin = (context: Context) => {
    if (!context.user) {
        throw new AuthenticationError('Not authenticated');
    }
    if (context.user.role !== 'admin') {
        throw new AuthenticationError('Admin access required');
    }
};

// Helper function to check if user is authenticated
const requireAuth = (context: Context) => {
    if (!context.user) {
        throw new AuthenticationError('Not authenticated');
    }
};


const resolvers = {
    ObjectId: ObjectIdScalar,

    // Union type resolver for PlanOption
    SearchResult: {
        __resolveType(obj: any) {
            if (obj.filing !== undefined && obj.lot !== undefined) {
                return 'Lot';
            }
            if (obj.lot && obj.plan && obj.lotPremium !== undefined) {
                return 'LotPricing';
            }
            if (obj.classification === 'colorScheme' || obj.primaryName) {
                return 'ColorScheme';
            }
            if (obj.classification === 'interior' || obj.material) {
                return 'InteriorOption';
            }
            if (obj.fixtures || obj.lvp || obj.carpet) {
                return 'InteriorPackage';
            }
            if (obj.classification === 'appliance' || obj.type) {
                return 'Appliance';
            }
            if (obj.classification === 'structural' || obj.garage !== undefined) {
                return 'Structural';
            }
            if (obj.classification === 'additional' || obj.classifiction === 'additional') {
                return 'Additional';
            }
            // Default to Elevation (elevations have totalCost, clientPrice, markup)
            if (obj.totalCost !== undefined && obj.markup !== undefined) {
                return 'Elevation';
            }
            return 'Elevation'; // Fallback   
        }
    },

    Query: {
        me: async (_parent: unknown, _args: unknown, context: any): Promise<UserType | null> => {
            if (!context.user) {
                throw new AuthenticationError("Not Authenticated")
            }
            const userDoc = await User.findOne({ _id: context.user._id }).populate('savedPlans').lean<UserType>();
            if (!userDoc) {
                return null
            }

            return userDoc
        },

        user: async (_parent: unknown, args: { id?: string; username?: string }) => {
            const userDoc = await User.findOne({
                $or: [{ _id: args.id }, { username: args.username }]
            }).populate('savedPlans');
            if (!userDoc) {
                return null
            }
            return userDoc
        },

        // Plan queries
        plans: async (): Promise<PlanType[]> => {
            const plans = await Plan.find({})
                .populate('lotPremium')
                .populate('colorScheme')
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .lean<PlanType[]>();
            return plans;
        },

        plan: async (_parent: unknown, args: { id: string }): Promise<PlanType | null> => {
            const plan = await Plan.findById(args.id)
                .populate('lotPremium')
                .populate('colorScheme')
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .lean<PlanType>();
            return plan;
        },

        planByType: async (_parent: unknown, args: { planType: number }): Promise<PlanType | null> => {
            try {
                const plan = await Plan.findOne({ planType: args.planType })
                    .populate('lotPremium')
                    .populate('colorScheme')
                    .populate('elevations')
                    .populate('interiors')
                    .populate('structural')
                    .populate('additional')
                    .populate('kitchenAppliance')
                    .populate('laundryAppliance')
                    .lean<PlanType>();

                if(!plan) {
                    throw new GraphQLError('User plans not found')
                }
                
                return plan;
                
            } catch (error) {
                throw new GraphQLError('Internal server error', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR'}
                })
            }
            
        },

        // User plan queries
        userPlans: async (_parent: any, _args: { userId?: string }, context: Context): Promise<UserPlanPopulated[]> => {
            requireAuth(context);

            const userPlans = await UserPlan.find({ userId: context.user?._id, isActive: true })
                .populate('planId')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lot')
                .populate('structuralOptions')
                .populate('additionalOptions')
                .lean<UserPlanPopulated[]>()
                .sort({ createdAt: -1 });
            return userPlans;
        },

        userPlan: async (_parent: unknown, args: { id: string }, context: Context): Promise<UserPlanPopulated | null> => {
            requireAuth(context);
            const userPlan = await UserPlan.findOne({ _id: args.id, userId: context.user?._id })
                .populate('planId')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lot')
                .populate('structuralOptions')
                .populate('additionalOptions')
                .lean<UserPlanPopulated>();
            return userPlan;
        },


        // Interior queries
        interiorOption: async (_parent: any, { id }: { id: Types.ObjectId }) => {
            const option = await InteriorOption.findById(id);
            if (!option) {
                throw new GraphQLError('Interior option not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            return option;
        },

        interiorOptions: async (
            _parent: any,
            { planId, material }: { planId?: Types.ObjectId; material?: string }
        ) => {
            const query: any = { isActive: true };
            if (planId) query.planId = planId;
            if (material) query.material = material;

            return await InteriorOption.find(query).sort({ sortOrder: 1, name: 1 });
        },


        interiorPackage: async (_parent: any, { id }: { id: Types.ObjectId }) => {
            const package_ = await InteriorPackage.findById(id).populate([
                'fixtures',
                'lvp',
                'carpet',
                'backsplash',
                'masterBathTile',
                'secondaryBathTile',
                'countertop',
                'primaryCabinets',
                'secondaryCabinets',
                'cabinetHardware',
            ]);

            if (!package_) {
                throw new GraphQLError('Interior package not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }

            return package_;
        },

        interiorPackages: async (
            _parent: any,
            { planId, basePackage }: { planId?: Types.ObjectId; basePackage?: boolean }
        ) => {
            const query: any = { isActive: true };
            if (planId) query.planId = planId;
            if (basePackage !== undefined) query.basePackage = basePackage;

            return await InteriorPackage.find(query)
                .populate([
                    'fixtures',
                    'lvp',
                    'carpet',
                    'backsplash',
                    'masterBathTile',
                    'secondaryBathTile',
                    'countertop',
                    'primaryCabinets',
                    'secondaryCabinets',
                    'cabinetHardware',
                ])
                .sort({ sortOrder: 1, name: 1 });
        },

        baseInteriorPackage: async (_parent: any, { planId }: { planId: Types.ObjectId }) => {
            const package_ = await InteriorPackage.findOne({
                planId,
                basePackage: true,
                isActive: true,
            }).populate([
                'fixtures',
                'lvp',
                'carpet',
                'backsplash',
                'masterBathTile',
                'secondaryBathTile',
                'countertop',
                'primaryCabinets',
                'secondaryCabinets',
                'cabinetHardware',
            ]);

            if (!package_) {
                throw new GraphQLError('Base interior package not found for this plan', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }

            return package_;
        },
    

        // Appliance queries
        

        // Structural option queries
        

        // Color Scheme queries
        

        // Lot premium queries
        

        // Plan-specific option queries (for browsing across all plans)
        
    },

    Mutation: {
        // Auth mutations
        createUser: async (_parent: unknown, args: { username: string; email: string; password: string }): Promise<AuthType> => {
            const user = await User.create(args);
            if (!user) {
                throw new Error('Something went wrong!');
            }
            const token = signToken(user.username, user.email, user._id, 'user');
            return { token, user };
        },

        login: async (_parent: unknown, args: { username?: string; email?: string; password: string }): Promise<AuthType> => {
            const user = await User.findOne({
                $or: [{ username: args.username }, { email: args.email }],
            });
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) {
                throw new AuthenticationError("Incorrect Password");
            }
            const token = signToken(user.username, user.email, user._id, user.role);
            return { token, user };
        },

        // Plan mutations (admin only)
        createPlan: async (_parent: unknown, args: { plan: PlanInput }, context: any): Promise<PlanType> => {
            requireAdmin(context);
            console.log('CREATE_PLAN Request from user:', context.user?.username || 'Unknown');
            console.log('Plan data received:', JSON.stringify(args.plan, null, 2));

            try {
                const plan = await Plan.create(args.plan);
                console.log('Plan created successfully:', {
                    id: plan._id,
                    name: plan.name,
                    planType: plan.planType
                });
                return plan as any;
            } catch (error) {
                console.error(' Plan creation failed:', error);
                throw error;
            }
        },

        updatePlan: async (_parent: unknown, args: { id: string; plan: PlanInput }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('UPDATE_PLAN Request from user:', context.user?.username || 'Unknown');
            console.log('Plan ID:', args.id);
            console.log('Plan data received:', JSON.stringify(args.plan, null, 2));

            try {
                const plan = await Plan.findByIdAndUpdate(args.id, args.plan, { new: true });
                if (plan) {
                    console.log('Plan updated successfully:', {
                        id: plan._id,
                        name: plan.name,
                        planType: plan.planType
                    });
                    return plan as any;
                } else {
                    console.warn('Plan not found for update:', args.id);
                    return null;
                }
            } catch (error) {
                console.error('Plan update failed:', error);
                throw error;
            }
        },

        deletePlan: async (_parent: unknown, args: { id: string }, context: Context): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);
            const plan = await Plan.findByIdAndDelete(args.id);
            return plan;
        },

        // User Plan mutations
        createUserPlan: async (_parent: unknown, args: { userPlan: UserPlanInput }, context: Context): Promise<UserPlanPopulated|null> => {
            requireAuth(context);
            const userPlan = await UserPlan.create({
                ...args.userPlan,
                userId: context.user?._id
            });

            const populatedPlan = await UserPlan.findById(userPlan._id)
                .populate('planId')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lot')
                .populate('structuralOptions')
                .populate('additionalOptions')
                .lean<UserPlanPopulated>();

            return populatedPlan;
        },

        updateUserPlan: async (_parent: unknown, args: { id: string; userPlan: UserPlanInput }, context: Context): Promise<UserPlanPopulated | null> => {
            requireAuth(context);
            const updatedPlan = await UserPlan.findOneAndUpdate(
                { _id: args.id, userId: context.user?._id },
                args.userPlan,
                { new: true }
            )
                .populate('planId')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lot')
                .populate('structuralOptions')
                .populate('additionalOptions')
                .lean<UserPlanPopulated>();

            return updatedPlan;
        },

        deleteUserPlan: async (_parent: unknown, args: { id: string }, context: Context): Promise<Boolean> => {
            requireAuth(context);
            const deletedPlan = await UserPlan.findOneAndDelete({
                _id: args.id,
                userId: context.user?._id
            })
                .populate('planId')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lot')
                .populate('structuralOptions')
                .populate('additionalOptions');

            return !!deletedPlan;
        },

        // Elevation mutations
        createElevation: async (_parent: unknown, args: { appliance: any }, context: any): Promise<any> => {

        },

        updateElevation: async (_parent: unknown, args: { id: string; appliance: any }, context: any): Promise<any> => {

        },

        deleteElevation: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {

        },

        //Interior Option mutations
        createInteriorOption: async (_parent: any, { input }: { input: any }, _context: Context):Promise<InteriorOptionType|null> => {    
            try {
                const newOption = new InteriorOption(input);
                await newOption.save();
                return newOption as InteriorOptionType;
            } catch (error: any) {
                throw new GraphQLError(`Error creating interior option: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        updateInteriorOption: async (_parent: any, { id, input }: { id: Types.ObjectId; input: any }, _context: Context):Promise<InteriorOptionType|null> => {
            try {
                const option = await InteriorOption.findByIdAndUpdate(
                    id,
                    { $set: input },
                    { new: true, runValidators: true }
                );

                if (!option) {
                    throw new GraphQLError('Interior option not found', {
                        extensions: { code: 'NOT_FOUND' },
                    });
                }

                // If this option is used in any packages, recalculate those packages
                const packagesUsingOption = await InteriorPackage.find({
                    $or: [
                        { fixtures: id },
                        { lvp: id },
                        { carpet: id },
                        { backsplash: id },
                        { masterBathTile: id },
                        { secondaryBathTile: id },
                        { countertop: id },
                        { primaryCabinets: id },
                        { secondaryCabinets: id },
                        { cabinetHardware: id },
                    ],
                });

                // Recalculate all affected packages
                for (const pkg of packagesUsingOption) {
                    await recalculatePackage(pkg._id);
                }

                return option as InteriorOptionType;
            } catch (error: any) {
                throw new GraphQLError(`Error updating interior option: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        deleteInteriorOption: async (_parent: any, { id }: { id: Types.ObjectId }, _context:Context):Promise<boolean> => {
            try {
                // Check if option is used in any packages
                const packagesUsingOption = await InteriorPackage.find({
                    $or: [
                        { fixtures: id },
                        { lvp: id },
                        { carpet: id },
                        { backsplash: id },
                        { masterBathTile: id },
                        { secondaryBathTile: id },
                        { countertop: id },
                        { primaryCabinets: id },
                        { secondaryCabinets: id },
                        { cabinetHardware: id },
                    ],
                });

                if (packagesUsingOption.length > 0) {
                    throw new GraphQLError(
                        'Cannot delete option: it is used in one or more packages',
                        {
                            extensions: { code: 'BAD_USER_INPUT' },
                        }
                    );
                }

                const result = await InteriorOption.findByIdAndDelete(id);
                return !!result;
            } catch (error: any) {
                throw new GraphQLError(`Error deleting interior option: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },
        // Interior Package mutations (admin only)
        createInteriorPackage: async (_parent: any, { input }: { input: InteriorPackageInput }, _context:Context):Promise<InteriorPackageType|null> => {
            try {
                // Validate that all referenced interior options exist
                const optionIds = [
                    input.fixtures,
                    input.lvp,
                    input.carpet,
                    input.backsplash,
                    input.masterBathTile,
                    input.secondaryBathTile,
                    input.countertop,
                    input.primaryCabinets,
                    input.secondaryCabinets,
                    input.cabinetHardware,
                ].filter(Boolean);

                if (optionIds.length > 0) {
                    const existingOptions = await InteriorOption.find({
                        _id: { $in: optionIds },
                    });

                    if (existingOptions.length !== optionIds.length) {
                        throw new GraphQLError('One or more interior options not found', {
                            extensions: { code: 'BAD_USER_INPUT' },
                        });
                    }
                }

                // Create the package
                const newPackage = new InteriorPackage(input);

                // Calculate total cost and client price
                const totalCost = await calculatePackageTotalCost(newPackage);
                newPackage.totalCost = totalCost;

                const clientPrice = await calculatePackageClientPrice(newPackage, totalCost);
                newPackage.clientPrice = clientPrice;

                await newPackage.save();

                // Re-fetch with population
                const createdPackage = await InteriorPackage.findById(newPackage._id).populate([
                    'fixtures',
                    'lvp',
                    'carpet',
                    'backsplash',
                    'masterBathTile',
                    'secondaryBathTile',
                    'countertop',
                    'primaryCabinets',
                    'secondaryCabinets',
                    'cabinetHardware',
                ]);

                return createdPackage as InteriorPackageType;
            } catch (error: any) {
                throw new GraphQLError(`Error creating interior package: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        updateInteriorPackage: async (
            _parent: any,
            { id, input }: { id: Types.ObjectId; input: Partial<InteriorPackageInput> }
        ):Promise<InteriorPackageType|null> => {
            try {
                // Validate referenced options if they're being updated
                const optionIds = [
                    input.fixtures,
                    input.lvp,
                    input.carpet,
                    input.backsplash,
                    input.masterBathTile,
                    input.secondaryBathTile,
                    input.countertop,
                    input.primaryCabinets,
                    input.secondaryCabinets,
                    input.cabinetHardware,
                ].filter(Boolean);

                if (optionIds.length > 0) {
                    const existingOptions = await InteriorOption.find({
                        _id: { $in: optionIds },
                    });

                    if (existingOptions.length !== optionIds.length) {
                        throw new GraphQLError('One or more interior options not found', {
                            extensions: { code: 'BAD_USER_INPUT' },
                        });
                    }
                }

                const package_ = await InteriorPackage.findById(id);
                if (!package_) {
                    throw new GraphQLError('Interior package not found', {
                        extensions: { code: 'NOT_FOUND' },
                    });
                }

                // Update package fields
                Object.assign(package_, input);

                // Recalculate pricing
                const totalCost = await calculatePackageTotalCost(package_);
                package_.totalCost = totalCost;

                const clientPrice = await calculatePackageClientPrice(package_, totalCost);
                package_.clientPrice = clientPrice;

                await package_.save();

                // Re-populate and return
                await package_.populate([
                    'fixtures',
                    'lvp',
                    'carpet',
                    'backsplash',
                    'masterBathTile',
                    'secondaryBathTile',
                    'countertop',
                    'primaryCabinets',
                    'secondaryCabinets',
                    'cabinetHardware',
                ]);

                return package_ as InteriorPackageType;
            } catch (error: any) {
                throw new GraphQLError(`Error updating interior package: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        deleteInteriorPackage: async (_parent: any, { id }: { id: Types.ObjectId }):Promise<boolean> => {
            try {
                const package_ = await InteriorPackage.findById(id);

                if (!package_) {
                    throw new GraphQLError('Interior package not found', {
                        extensions: { code: 'NOT_FOUND' },
                    });
                }

                // Delete the package
                await InteriorPackage.findByIdAndDelete(id);

                return true;
            } catch (error: any) {
                throw new GraphQLError(`Error deleting interior package: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        //Utility Interior Package mutations
        recalculatePackagePrice: async (_parent: any, { id }: { id: Types.ObjectId }):Promise<InteriorPackageType|null> => {
            try {
                return await recalculatePackage(id);
            } catch (error: any) {
                throw new GraphQLError(`Error recalculating package price: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        recalculateAllPackagePrices: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId }
        ):Promise<InteriorPackageType[]|[]> => {
            try {
                return await recalculateAllPackagesForPlan(planId);
            } catch (error: any) {
                throw new GraphQLError(`Error recalculating all package prices: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        setBasePackage: async (_parent: any, { id }: { id: Types.ObjectId }, _context:Context): Promise<InteriorPackageType> => {
            try {
                const package_ = await InteriorPackage.findById(id);

                if (!package_) {
                    throw new GraphQLError('Interior package not found', {
                        extensions: { code: 'NOT_FOUND' },
                    });
                }

                // Remove base package flag from all packages in this plan
                await InteriorPackage.updateMany(
                    { planId: package_.planId },
                    { basePackage: false }
                );

                // Set this as the base package
                package_.basePackage = true;
                await package_.save();

                // Recalculate all packages for this plan
                await recalculateAllPackagesForPlan(package_.planId);

                // Re-populate and return
                await package_.populate([
                    'fixtures',
                    'lvp',
                    'carpet',
                    'backsplash',
                    'masterBathTile',
                    'secondaryBathTile',
                    'countertop',
                    'primaryCabinets',
                    'secondaryCabinets',
                    'cabinetHardware',
                ]);

                return package_ as InteriorPackageType;
            } catch (error: any) {
                throw new GraphQLError(`Error setting base package: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        // Structural mutations (admin only)
        createStructural: async (_parent: unknown, args: { structural: any }, context: any): Promise<any> => {

        },

        updateStructural: async (_parent: unknown, args: { id: string; structural: any }, context: any): Promise<any> => {

        },

        deleteStructural: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {

        },

        // Additional Option Mutation
        createAdditionalOption: async (_parent: unknown, args: { appliance: any }, context: any): Promise<any> => {

        },

        updateAdditionalOption: async (_parent: unknown, args: { id: string; appliance: any }, context: any): Promise<any> => {

        },

        deleteAdditionalOption: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {

        },

        // Appliance mutations (admin only)
        createAppliance: async (_parent: unknown, args: { appliance: any }, context: any): Promise<any> => {

        },

        updateAppliance: async (_parent: unknown, args: { id: string; appliance: any }, context: any): Promise<any> => {

        },

        deleteAppliance: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {

        },

        // Color Scheme mutations (admin only)
        createColorScheme: async (_parent: unknown, args: { colorScheme: ColorSchemeInput }, context: any): Promise<ColorSchemeDocument> => {
            requireAdmin(context);
            const colorScheme = await ColorScheme.create(args.colorScheme);
            return colorScheme;
        },

        updateColorScheme: async (_parent: unknown, args: { id: string; colorScheme: ColorSchemeInput }, context: any): Promise<ColorSchemeDocument | null> => {
            requireAdmin(context);
            const colorScheme = await ColorScheme.findByIdAndUpdate(args.id, args.colorScheme, { new: true });
            return colorScheme;
        },

        deleteColorScheme: async (_parent: unknown, args: { id: string }, context: any): Promise<ColorSchemeDocument | null> => {
            requireAdmin(context);
            const colorScheme = await ColorScheme.findByIdAndDelete(args.id);
            return colorScheme;
        },

        // Lot Management
        createLot: async (_parent: unknown, args: { colorScheme: ColorSchemeInput }, context: any): Promise<LotDocument> => {
            
        },

        updateLot: async (_parent: unknown, args: { id: string; colorScheme: ColorSchemeInput }, context: any): Promise<LotDocument | null> => {
            
        },

        deleteLot: async (_parent: unknown, args: { id: string }, context: any): Promise<LotDocument | null> => {
            
        },

        //Lot Premium union with PlanId

    }
};

export default resolvers;