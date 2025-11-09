import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { ObjectIdScalar } from '../types/scalar.js';
import {
    calculatePackageTotalCost,
    calculatePackageClientPrice,
    recalculatePackage,
    recalculateAllPackagesForPlan,
    determineBasePackage,
} from '../services/packagePricing.js'

//Type Interfaces
import {
    ElevationType,
    StructuralType,
    InteriorOptionType 
    InteriorPackageType,
    ApplianceType,
    AdditionalType,
    PlanType,
    UserHomeType, 
    UserType 
} from '../types/graphql.js';

//Inputs
import {
    ElevationInput,
    StructuralInput,
    InteriorOptionInput,
    InteriorPackageInput,
    ApplianceInput,
    AdditionalInput,
    PlanInput,
    UserHomeInput,
    UserInput
} from '../types/graphql.js'

//Schemas
import { signToken, AuthenticationError } from '../services/auth.js';
import User from '../models/User.js';
import Plan from '../models/Plan.js';
import ElevationOption from '../models/OptionSchemas/ElevationOption.js';
import ColorScheme from '../models/OptionSchemas/ColorScheme.js';
import InteriorOption from '../models/OptionSchemas/InteriorOption.js';
import InteriorPackage from '../models/OptionSchemas/InteriorPackageOption.js';
import StructuralOption from '../models/OptionSchemas/StructuralOption.js';
import AdditionalOption from '../models/OptionSchemas/AdditionalOption.js';
import LotPremium from '../models/OptionSchemas/Lot.js';
import LotPricing from '../models/OptionSchemas/LotPricing.js';
import Appliance from '../models/OptionSchemas/Appliance.js';
import UserPlan from '../models/UserPlan.js';
import mongoose from 'mongoose';

// Helper function to check if user is admin
const requireAdmin = (context: any) => {
    if (!context.user) {
        throw new AuthenticationError('Not authenticated');
    }
    if (context.user.role !== 'admin') {
        throw new AuthenticationError('Admin access required');
    }
};

// Helper function to check if user is authenticated
const requireAuth = (context: any) => {
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
            const userDoc = await User.findOne({ _id: context.user._id }).populate('savedHomes');
            if (!userDoc) {
                return null
            }

            return userDoc.toObject 
        },

        user: async (_parent: unknown, args: { id?: string; username?: string }) => {
            const userDoc = await User.findOne({
                $or: [{ _id: args.id }, { username: args.username }]
            }).populate('savedHomes');
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
                .populate('laundryAppliance');
            return plans.map(toPlanType);
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
                .populate('laundryAppliance');
            return plan ? toPlanType(plan) : null;
        },

        planByType: async (_parent: unknown, args: { planType: number }): Promise<PlanType | null> => {
            const plan = await Plan.findOne({ planType: args.planType })
                .populate('lotPremium')
                .populate('colorScheme')
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance');
            return plan ? toPlanType(plan) : null;
        },

        // User home queries
        userHomes: async (_parent: unknown, _args: unknown, context: any): Promise<UserHomeType[]> => {
            requireAuth(context);
            const userPlans = await UserPlan.find({ userId: context.user._id, isActive: true })
                .populate('plan')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lotPremium')
                .populate('structuralOptions')
                .populate('additionalOptions')
                .sort({ createdAt: -1 });
            return userPlans.map(toUserHomeType);
        },

        userHome: async (_parent: unknown, args: { id: string }, context: any): Promise<UserHomeType | null> => {
            requireAuth(context);
            const userPlan = await UserPlan.findOne({ _id: args.id, userId: context.user._id })
                .populate('plan')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lotPremium')
                .populate('structuralOptions')
                .populate('additionalOptions');
            return userPlan ? toUserHomeType(userPlan) : null;
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
        createUser: async (_parent: unknown, args: { username: string; email: string; password: string }): Promise<Auth> => {
            const user = await User.create(args);
            if (!user) {
                throw new Error('Something went wrong!');
            }
            const token = signToken(user.username, user.email, user._id, 'user');
            return { token, user: toUserType(user) };
        },

        login: async (_parent: unknown, args: { username?: string; email?: string; password: string }): Promise<Auth> => {
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
            return { token, user: toUserType(user) };
        },

        // Plan mutations (admin only)
        createPlan: async (_parent: unknown, args: { plan: PlanInput }, context: any): Promise<PlanType> => {
            requireAdmin(context);
            console.log('📥 CREATE_PLAN Request from user:', context.user?.username || 'Unknown');
            console.log('📋 Plan data received:', JSON.stringify(args.plan, null, 2));

            try {
                const plan = await Plan.create(args.plan);
                console.log('✅ Plan created successfully:', {
                    id: plan._id,
                    name: plan.name,
                    planType: plan.planType
                });
                return toPlanType(plan);
            } catch (error) {
                console.error('❌ Plan creation failed:', error);
                throw error;
            }
        },

        updatePlan: async (_parent: unknown, args: { id: string; plan: PlanInput }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('📥 UPDATE_PLAN Request from user:', context.user?.username || 'Unknown');
            console.log('📋 Plan ID:', args.id);
            console.log('📋 Plan data received:', JSON.stringify(args.plan, null, 2));

            try {
                const plan = await Plan.findByIdAndUpdate(args.id, args.plan, { new: true });
                if (plan) {
                    console.log('✅ Plan updated successfully:', {
                        id: plan._id,
                        name: plan.name,
                        planType: plan.planType
                    });
                    return toPlanType(plan);
                } else {
                    console.warn('⚠️ Plan not found for update:', args.id);
                    return null;
                }
            } catch (error) {
                console.error('❌ Plan update failed:', error);
                throw error;
            }
        },

        deletePlan: async (_parent: unknown, args: { id: string }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            const plan = await Plan.findByIdAndDelete(args.id);
            return plan ? toPlanType(plan) : null;
        },

        // Color Scheme mutations (admin only)
        createColorScheme: async (_parent: unknown, args: { colorScheme: ColorSchemeInput }, context: any): Promise<ColorSchemeType> => {
            requireAdmin(context);
            const colorScheme = await ColorScheme.create(args.colorScheme);
            return toColorSchemeType(colorScheme);
        },

        updateColorScheme: async (_parent: unknown, args: { id: string; colorScheme: ColorSchemeInput }, context: any): Promise<ColorSchemeType | null> => {
            requireAdmin(context);
            const colorScheme = await ColorScheme.findByIdAndUpdate(args.id, args.colorScheme, { new: true });
            return colorScheme ? toColorSchemeType(colorScheme) : null;
        },

        deleteColorScheme: async (_parent: unknown, args: { id: string }, context: any): Promise<ColorSchemeType | null> => {
            requireAdmin(context);
            const colorScheme = await ColorScheme.findByIdAndDelete(args.id);
            return colorScheme ? toColorSchemeType(colorScheme) : null;
        },

        //Interior Option mutations
        createInteriorOption: async (_parent: any, { input }: { input: any }) => {
            try {
                const newOption = new InteriorOption(input);
                await newOption.save();
                return newOption;
            } catch (error: any) {
                throw new GraphQLError(`Error creating interior option: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        updateInteriorOption: async (_parent: any, { id, input }: { id: Types.ObjectId; input: any }) => {
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

                return option;
            } catch (error: any) {
                throw new GraphQLError(`Error updating interior option: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        deleteInteriorOption: async (_parent: any, { id }: { id: Types.ObjectId }) => {
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
        createInteriorPackage: async (_parent: any, { input }: { input: InteriorPackageInput }) => {
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

                // Determine if this should be the new base package
                await determineBasePackage(newPackage.planId);

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

                return createdPackage;
            } catch (error: any) {
                throw new GraphQLError(`Error creating interior package: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        updateInteriorPackage: async (
            _parent: any,
            { id, input }: { id: Types.ObjectId; input: Partial<InteriorPackageInput> }
        ) => {
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

                // Check if base package needs to be reassigned
                await determineBasePackage(package_.planId);

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

                return package_;
            } catch (error: any) {
                throw new GraphQLError(`Error updating interior package: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        deleteInteriorPackage: async (_parent: any, { id }: { id: Types.ObjectId }) => {
            try {
                const package_ = await InteriorPackage.findById(id);

                if (!package_) {
                    throw new GraphQLError('Interior package not found', {
                        extensions: { code: 'NOT_FOUND' },
                    });
                }

                const planId = package_.planId;
                const wasBasePackage = package_.basePackage;

                // Delete the package
                await InteriorPackage.findByIdAndDelete(id);

                // If we deleted the base package, reassign a new one
                if (wasBasePackage) {
                    await determineBasePackage(planId);
                }

                return true;
            } catch (error: any) {
                throw new GraphQLError(`Error deleting interior package: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        //Utility Interior Package mutations
        recalculatePackagePrice: async (_parent: any, { id }: { id: Types.ObjectId }) => {
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
        ) => {
            try {
                return await recalculateAllPackagesForPlan(planId);
            } catch (error: any) {
                throw new GraphQLError(`Error recalculating all package prices: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        setBasePackage: async (_parent: any, { id }: { id: Types.ObjectId }) => {
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

                return package_;
            } catch (error: any) {
                throw new GraphQLError(`Error setting base package: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        reassignBasePackage: async (_parent: any, { planId }: { planId: Types.ObjectId }) => {
            try {
                return await determineBasePackage(planId);
            } catch (error: any) {
                throw new GraphQLError(`Error reassigning base package: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },
    },
};

        // Lot Premium mutations (admin only)
        

        // User Home mutations
        saveUserHome: async (_parent: unknown, args: { userHome: UserHomeInput }, context: any): Promise<UserType> => {

        },

        updateUserHome: async (_parent: unknown, args: { id: string; userHome: UserHomeInput }, context: any): Promise<UserHomeType> => {
        
        },

        deleteUserHome: async (_parent: unknown, args: { id: string }, context: any): Promise<UserType> => {
            
        },

        // Appliance mutations (admin only)
        createAppliance: async (_parent: unknown, args: { appliance: any }, context: any): Promise<any> => {
            
        },

        updateAppliance: async (_parent: unknown, args: { id: string; appliance: any }, context: any): Promise<any> => {
            
        },

        deleteAppliance: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {
            
        },

        // Structural mutations (admin only)
        createStructural: async (_parent: unknown, args: { structural: any }, context: any): Promise<any> => {
            
        },

        updateStructural: async (_parent: unknown, args: { id: string; structural: any }, context: any): Promise<any> => {
            
        },

        deleteStructural: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {
            
        },

        // InteriorOption mutations (admin only)
        createInteriorOption: async (_parent: unknown, args: { interiorOption: any }, context: any): Promise<any> => {
            
        },

        updateInteriorOption: async (_parent: unknown, args: { id: string; interiorOption: any }, context: any): Promise<any> => {
            
        },

        deleteInteriorOption: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {
            
        },

        // Plan-specific option management mutations
        addElevationToPlan: async (_parent: unknown, args: { planId: string; elevation: any }, context: any): Promise<PlanType | null> => {
            
        },

        updatePlanElevation: async (_parent: unknown, args: { planId: string; elevationId: string; elevation: any }, context: any): Promise<PlanType | null> => {
            
        },

        removePlanElevation: async (_parent: unknown, args: { planId: string; elevationId: string }, context: any): Promise<PlanType | null> => {
            
        },

        addStructuralToPlan: async (_parent: unknown, args: { planId: string; structural: any }, context: any): Promise<PlanType | null> => {
            
        },

        updatePlanStructural: async (_parent: unknown, args: { planId: string; structuralId: string; structural: any }, context: any): Promise<PlanType | null> => {
            
        },

        removePlanStructural: async (_parent: unknown, args: { planId: string; structuralId: string }, context: any): Promise<PlanType | null> => {
            
        },

        addInteriorToPlan: async (_parent: unknown, args: { planId: string; interior: any }, context: any): Promise<PlanType | null> => {
            
        },

        updatePlanInterior: async (_parent: unknown, args: { planId: string; interiorId: string; interior: any }, context: any): Promise<PlanType | null> => {
            
        },

        removePlanInterior: async (_parent: unknown, args: { planId: string; interiorId: string }, context: any): Promise<PlanType | null> => {
            
        },

        addApplianceToPlan: async (_parent: unknown, args: { planId: string; appliance: any }, context: any): Promise<PlanType | null> => {
            
        },

        updatePlanAppliance: async (_parent: unknown, args: { planId: string; applianceId: string; appliance: any }, context: any): Promise<PlanType | null> => {
            
        },

        removePlanAppliance: async (_parent: unknown, args: { planId: string; applianceId: string }, context: any): Promise<PlanType | null> => {
            
        },

        addAdditionalToPlan: async (_parent: unknown, args: { planId: string; additional: any }, context: any): Promise<PlanType | null> => {
            
        },

        updatePlanAdditional: async (_parent: unknown, args: { planId: string; additionalId: string; additional: any }, context: any): Promise<PlanType | null> => {
            
        },

        removePlanAdditional: async (_parent: unknown, args: { planId: string; additionalId: string }, context: any): Promise<PlanType | null> => {
            
        },

        addLotToPlan: async (_parent: unknown, args: { planId: string; lot: any }, context: any): Promise<PlanType | null> => {
            
        },

        updatePlanLot: async (_parent: unknown, args: { planId: string; lotId: string; lot: any }, context: any): Promise<PlanType | null> => {
            
        },

        removePlanLot: async (_parent: unknown, args: { planId: string; lotId: string }, context: any): Promise<PlanType | null> => {
            
        },
    }
};

export default resolvers;