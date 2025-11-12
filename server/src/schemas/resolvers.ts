import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { ObjectIdScalar } from '../types/scalar.js';
import {
    calculatePackageTotalCost,
    calculatePackageClientPrice,
    recalculatePackage,
    recalculateAllPackagesForPlan,
} from '../services/packagePricing.js'

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
    UserInput,
    AuthType
} from '../types/graphql.js'

//Schemas
import { signToken, AuthenticationError } from '../services/auth.js';
import User, { UserDocument } from '../models/User.js';
import Plan, { PlanTypeDocument } from '../models/Plan.js';
import ElevationOption, { ElevationOptionDocument } from '../models/OptionSchemas/ElevationOption.js';
import ColorScheme, { ColorSchemeDocument } from '../models/OptionSchemas/ColorScheme.js';
import InteriorOption, { InteriorOptionDocument } from '../models/OptionSchemas/InteriorOption.js';
import InteriorPackage, { InteriorPackageDocument } from '../models/OptionSchemas/InteriorPackageOption.js';
import StructuralOption, { StructuralDocument } from '../models/OptionSchemas/StructuralOption.js';
import AdditionalOption, { AdditionalOptionDocument } from '../models/OptionSchemas/AdditionalOption.js';
import LotPricing, { LotPricingDocument } from '../models/OptionSchemas/LotPricing.js';
import Appliance, { ApplianceDocument } from '../models/OptionSchemas/Appliance.js';
import UserPlan, { UserPlanSelectionDocument} from '../models/UserPlan.js';
import Lot, { LotDocument } from '../models/OptionSchemas/Lot.js';



//Context Type
export interface Context {
    user?: {
        _id: Types.ObjectId;
        username: string;
        email: string;
        role: 'admin' | 'user';
        homeCount?: number;
        savedPlans?: UserPlanSelectionDocument[]
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

//Helper function for plan-specific options (single-planId)
async function validateOptionBelongsToPlan(
    Model: any,
    optionId: Types.ObjectId,
    planId: Types.ObjectId,
    optionName: string
): Promise<void> {
    const option = await Model.findById(optionId);

    if (!option) {
        throw new GraphQLError(`${optionName} not found`, {
            extensions: { code: 'NOT_FOUND' }
        });
    }

    if (option.planId.toString() !== planId.toString()) {
        throw new GraphQLError(
            `This ${optionName} belongs to a different plan and cannot be added here`,
            { extensions: { code: 'INVALID_OPERATION' } }
        );
    }
}


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
        me: async (_parent: unknown, _args: unknown, context: any): Promise<UserDocument | null> => {
            if (!context.user) {
                throw new AuthenticationError("Not Authenticated")
            }
            const userDoc = await User.findOne({ _id: context.user._id }).populate('savedPlans');
            if (!userDoc) {
                return null
            }

            return userDoc
        },

        user: async (_parent: unknown, args: { id?: string; username?: string }):Promise<UserDocument|null> => {
            const userDoc = await User.findOne({
                $or: [{ _id: args.id }, { username: args.username }]
            }).populate('savedPlans');
            if (!userDoc) {
                return null
            }
            return userDoc
        },

        users: async (_parent: unknown, _args: unknown, context: Context): Promise<UserDocument[]> => {
            requireAdmin(context);
            const users = await User.find({}).populate('savedPlans');
            return users;
        },

        searchOptions: async (
            _parent: any,
            args: { query: string; type: string },
            context: Context
        ): Promise<any[]> => {
            requireAuth(context);

            const searchRegex = new RegExp(args.query, 'i');
            const commonQuery = { name: searchRegex, isActive: true };

            switch (args.type.toLowerCase()) {
                case 'elevation':
                    return await ElevationOption.find(commonQuery);
                case 'structural':
                    return await StructuralOption.find(commonQuery);
                case 'interioroption':
                    return await InteriorOption.find(commonQuery);
                case 'interiorpackage':
                    return await InteriorPackage.find(commonQuery);
                case 'appliance':
                    return await Appliance.find(commonQuery);
                case 'additional':
                    return await AdditionalOption.find(commonQuery);
                case 'colorscheme':
                    return await ColorScheme.find(commonQuery);
                case 'lot':
                    return await Lot.find({
                        $or: [
                            { streetName: searchRegex },
                            { streetNumber: searchRegex }
                        ],
                        isActive: true
                    });
                case 'lotpricing':
                    return await LotPricing.find(commonQuery)
                        .populate('lot')
                        .populate('plan');
                default:
                    throw new Error('Invalid search type');
            }
        },

        // Plan queries
        plans: async (): Promise<PlanTypeDocument[]|[]> => {
            const plans = await Plan.find({})
                .populate('lot')
                .populate('colorScheme')
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance');
            return plans;
        },

        plan: async (_parent: unknown, args: { id: string }): Promise<PlanTypeDocument | null> => {
            const plan = await Plan.findById(args.id)
                .populate('lot')
                .populate('colorScheme')
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance');
            return plan;
        },

        planByType: async (_parent: unknown, args: { planType: number }, context: Context): Promise<PlanTypeDocument | null> => {
            requireAuth(context)
            try {
                const plan = await Plan.findOne({ planType: args.planType })
                    .populate('lot')
                    .populate('colorScheme')
                    .populate('elevations')
                    .populate('interiors')
                    .populate('structural')
                    .populate('additional')
                    .populate('kitchenAppliance')
                    .populate('laundryAppliance');

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

        activePlans: async (): Promise<PlanTypeDocument[]> => {
            const plans = await Plan.find({ isActive: true })
                .populate('lot')
                .populate('colorScheme')
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance');
            return plans;
        },

        searchPlans: async (_parent: unknown, args: {
            minPrice?: number;
            maxPrice?: number;
            minBedrooms?: number;
            maxBedrooms?: number;
            minBathrooms?: number;
            maxBathrooms?: number;
            minSqft?: number;
            maxSqft?: number;
        }): Promise<PlanTypeDocument[]> => {
            const filter: any = { isActive: true };

            if (args.minPrice !== undefined || args.maxPrice !== undefined) {
                filter.basePrice = {};
                if (args.minPrice !== undefined) filter.basePrice.$gte = args.minPrice;
                if (args.maxPrice !== undefined) filter.basePrice.$lte = args.maxPrice;
            }

            if (args.minBedrooms !== undefined) filter.bedrooms = { $gte: args.minBedrooms };
            if (args.maxBedrooms !== undefined) {
                filter.bedrooms = { ...filter.bedrooms, $lte: args.maxBedrooms };
            }

            if (args.minBathrooms !== undefined) filter.bathrooms = { $gte: args.minBathrooms };
            if (args.maxBathrooms !== undefined) {
                filter.bathrooms = { ...filter.bathrooms, $lte: args.maxBathrooms };
            }

            if (args.minSqft !== undefined) filter.totalSqft = { $gte: args.minSqft };
            if (args.maxSqft !== undefined) {
                filter.totalSqft = { ...filter.totalSqft, $lte: args.maxSqft };
            }

            const plans = await Plan.find(filter)
                .populate('lot')
                .populate('colorScheme')
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance');

            return plans;
        },

        // User plan queries
        userPlans: async (_parent: any, _args: { userId?: string }, context: Context): Promise<UserPlanSelectionDocument[]|[]> => {
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
                .sort({ createdAt: -1 });
            return userPlans;
        },

        userPlan: async (_parent: unknown, args: { id: string }, context: Context): Promise<UserPlanSelectionDocument | null> => {
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
                .populate('additionalOptions');
            return userPlan;
        },

        elevationOptions: async (_parent: any, context: Context): Promise<ElevationOptionDocument[] | []> => {
            requireAuth(context)
            return ElevationOption.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
        },

        elevationOption: async (_parent: any, {_id}: {_id: Types.ObjectId}, context: Context): Promise<ElevationOptionDocument | null> => {
            requireAuth(context)
            return ElevationOption.findById({ _id: _id }).sort({ sortOrder: 1, name: 1 });
        },

        // Color Scheme queries
        colorSchemes: async (_parent: any, context: Context): Promise<ColorSchemeDocument[] | []> => {
            const query = { isActive: true }
            requireAuth(context)

            return ColorScheme.find(query).sort({ sortOrder: 1, name: 1 })
        },

        colorSchemeOption: async (_parent: any, { _id }: { _id: Types.ObjectId }, context: Context): Promise<ColorSchemeDocument | null> => {
            requireAuth(context)

            return ColorScheme.findOne({
                _id: _id,
                isActive: true
            })
        },

        // Interior queries
        interiorOption: async (_parent: any, { id }: { id: Types.ObjectId }): Promise<InteriorOptionDocument> => {
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
        ): Promise<InteriorOptionDocument[]|[]> => {
            const query: any = { isActive: true };
            if (planId) query.planId = planId;
            if (material) query.material = material;

            return await InteriorOption.find(query).sort({ sortOrder: 1, name: 1 });
        },


        interiorPackage: async (_parent: any, { id }: { id: Types.ObjectId }): Promise<InteriorPackageDocument> => {
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
        ): Promise<InteriorPackageDocument[]|[]> => {
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

        baseInteriorPackage: async (_parent: any, { planId }: { planId: Types.ObjectId }): Promise<InteriorPackageDocument> => {
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
    

        // Structural option queries
        structuralOptions: async (_parent: any, context:Context): Promise<StructuralDocument[]|[]> => {
            const query = { isActive: true }
            requireAuth(context)
            
            return StructuralOption.find(query).sort({ sortOrder: 1, name: 1 })
        },
        
        structuralOption: async (_parent: any, {_id}: {_id: Types.ObjectId}, context: Context):Promise<StructuralDocument|null> => {
            requireAuth(context)
            
            return StructuralOption.findOne({
                _id: _id,
                isActive: true
            })
        },
        
        //Additional queries
        additionalOptions: async (_parent: any, context: Context): Promise<AdditionalOptionDocument[] | []> => {
            const query = { isActive: true }
            requireAuth(context)

            return AdditionalOption.find(query).sort({ sortOrder: 1, name: 1 })
        },

        additionalOption: async (_parent: any, { _id }: { _id: Types.ObjectId }, context: Context): Promise<AdditionalOptionDocument | null> => {
            requireAuth(context)

            return AdditionalOption.findOne({
                _id: _id,
                isActive: true
            })
        },

        // Appliance queries
        appliances: async (_parent: any, context: Context): Promise<ApplianceDocument[]|[]> => {
            const query = { isActive: true }
            requireAuth(context)

            return Appliance.find(query).sort({ sortOrder: 1, name: 1 })
        },

        appliance: async (_parent: any, {_id }: {_id: Types.ObjectId}, context: Context): Promise<ApplianceDocument|null> => {
            requireAuth(context)

            return Appliance.findOne({
                _id: _id,
                isActive: true
            })
        },

        // Lot premium queries
        lots: async (_parent: any, context: Context): Promise<LotDocument[]|[]> => {
            const query = { isActive: true }
            requireAuth(context)

            return Lot.find(query).sort({ sortOrder: 1, name: 1 })
        },

        lot: async (_parent: any, { _id }: { _id: Types.ObjectId }, _context: Context) => {
            if (!_context.user) return 'Not Authenticated'

            return Lot.findOne({
                _id: _id,
                isActive: true
            })
        },

        lotPricing: async (_parent: any, context: Context): Promise<LotPricingDocument[] | []> => {
            const query = { isActive: true }
            requireAuth(context)

            return LotPricing.find(query)
                .populate('lot')
                .populate('plan')
                .sort({ sortOrder: 1, name: 1 });
        },

        singleLotPricing: async (_parent: any, { _id }: { _id: Types.ObjectId }, context: Context) => {
            requireAuth(context)

            return LotPricing.findOne({
                _id: _id,
                isActive: true
            })
            .populate('lot')
            .populate('plan');
        },

      

        // Plan-specific option queries (for browsing across all plans)
        
        planElevations: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId },
            context: Context
        ): Promise<ElevationOptionDocument[]|[]> => {
            requireAuth(context)
            
            return ElevationOption.find({
                planId: planId,
                isActive: true
            });
        },

        planColorSchemes: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId },
            context: Context
        ): Promise<ColorSchemeDocument[] | []> => {
            requireAuth(context)
            return ColorScheme.find({ planId: planId, isActive: true });
        },

        planInteriorOptions: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId },
            context: Context
        ): Promise<InteriorOptionDocument[] | []> => {
            requireAuth(context)

            return InteriorOption.find({
                planId: planId,
                isActive: true
            });
        },

        planInteriorPackages: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId },
            context: Context
        ): Promise<InteriorPackageDocument[] | []> => {
            requireAuth(context)

            return InteriorPackage.find({
                planId: planId,
                isActive: true
            });
        },

        planStructural: async (
            _parent: any, 
            { planId }: { planId: Types.ObjectId }, 
            context: Context
        ): Promise<StructuralDocument[]|[]> => {
            requireAuth(context)

            return StructuralOption.find({
                planId: planId,
                isActive: true
            });
        },
        
        planAdditional: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId },
            context: Context
        ): Promise<AdditionalOptionDocument[]|[]> => {
            requireAuth(context)

            return AdditionalOption.find({
                planId: planId,
                isActive: true
            });
        },

        planAppliances: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId },
            context: Context
        ): Promise<ApplianceDocument[] | []> => {
            requireAuth(context)
            return Appliance.find({ planId: planId, isActive: true });
        },

        planLotPricing: async (
            _parent: any,
            { planId }: { planId: Types.ObjectId },
            context: Context
        ):Promise<LotPricingDocument[]|[]> => {
            requireAuth(context);

            return LotPricing.find({
                plan: planId,
                isActive: true
            })
            .populate('lot')
            .populate('plan');
        },


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

        // Admin user management mutations
        createAdminUser: async (_parent: unknown, args: { username: string; email: string; password: string }, context: Context): Promise<AuthType> => {
            requireAdmin(context);

            // Create user with admin role
            const user = await User.create({
                username: args.username,
                email: args.email,
                password: args.password,
                role: 'admin'
            });

            if (!user) {
                throw new Error('Failed to create admin user');
            }

            const token = signToken(user.username, user.email, user._id, 'admin');
            return { token, user };
        },

        updateUserRole: async (_parent: unknown, args: { userId: Types.ObjectId; role: string }, context: Context): Promise<UserDocument | null> => {
            requireAdmin(context);

            // Validate role
            if (args.role !== 'admin' && args.role !== 'user') {
                throw new Error('Invalid role. Must be "admin" or "user"');
            }

            // Update user role
            const user = await User.findByIdAndUpdate(
                args.userId,
                { role: args.role },
                { new: true }
            );

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        },

        deleteUser: async (_parent: unknown, args: { userId: Types.ObjectId }, context: Context): Promise<boolean> => {
            requireAdmin(context);

            // Prevent admins from deleting themselves
            if (context.user && context.user._id.toString() === args.userId.toString()) {
                throw new Error('Cannot delete your own account');
            }

            const user = await User.findByIdAndDelete(args.userId);

            if (!user) {
                throw new Error('User not found');
            }

            return true;
        },

        // Plan mutations (admin only)
        createPlan: async (_parent: unknown, args: { plan: PlanInput }, context: any): Promise<PlanTypeDocument> => {
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
                return plan;
            } catch (error) {
                console.error(' Plan creation failed:', error);
                throw error;
            }
        },

        updatePlan: async (_parent: unknown, args: { id: string; plan: PlanInput }, context: any): Promise<PlanTypeDocument | null> => {
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
                    return plan;
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
        createUserPlan: async (_parent: unknown, args: { userPlan: UserPlanInput }, context: Context): Promise<UserPlanSelectionDocument|null> => {
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
                .populate('additionalOptions');

            return populatedPlan;
        },

        updateUserPlan: async (_parent: unknown, args: { id: string; userPlan: UserPlanInput }, context: Context): Promise<UserPlanSelectionDocument | null> => {
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
                .populate('additionalOptions');

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

        duplicateUserPlan: async (_parent: unknown, args: { id: Types.ObjectId; newConfigurationName: string }, context: Context): Promise<UserPlanSelectionDocument | null> => {
            requireAuth(context);

            // Find the original plan
            const originalPlan = await UserPlan.findOne({
                _id: args.id,
                userId: context.user?._id
            });

            if (!originalPlan) {
                throw new Error('User plan not found');
            }

            // Create a copy with new configuration name
            const duplicatedPlan = await UserPlan.create({
                userId: context.user?._id,
                planId: originalPlan.planId,
                configurationName: args.newConfigurationName,
                elevation: originalPlan.elevation,
                colorScheme: originalPlan.colorScheme,
                interiorPackage: originalPlan.interiorPackage,
                kitchenAppliance: originalPlan.kitchenAppliance,
                laundryAppliance: originalPlan.laundryAppliance,
                lot: originalPlan.lot,
                structuralOptions: originalPlan.structuralOptions,
                additionalOptions: originalPlan.additionalOptions,
                status: 'draft',
                isActive: true,
                notes: originalPlan.notes,
                customerNotes: originalPlan.customerNotes
            });

            // Populate the duplicated plan
            const populatedPlan = await UserPlan.findById(duplicatedPlan._id)
                .populate('planId')
                .populate('elevation')
                .populate('colorScheme')
                .populate('interiorPackage')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lot')
                .populate('structuralOptions')
                .populate('additionalOptions');

            return populatedPlan;
        },

        // Elevation mutations (admin only)
        createElevation: async (_parent: unknown, args: { elevation: ElevationInput }, context: Context): Promise<ElevationOptionDocument> => {
            requireAdmin(context);
            const elevation = await ElevationOption.create(args.elevation);
            return elevation;
        },

        updateElevation: async (_parent: unknown, args: { id: Types.ObjectId; elevation: ElevationInput }, context: Context): Promise<ElevationOptionDocument | null> => {
            requireAdmin(context);
            const elevation = await ElevationOption.findByIdAndUpdate(args.id, args.elevation, { new: true });
            if (!elevation) {
                throw new Error('Elevation not found');
            }
            return elevation;
        },

        deleteElevation: async (_parent: unknown, args: { id: Types.ObjectId }, context: Context): Promise<Boolean> => {
            requireAdmin(context);
            const elevation = await ElevationOption.findByIdAndDelete(args.id);
            if (!elevation) {
                throw new Error('Elevation not found');
            }
            return true;
        },

        //Interior Option mutations
        createInteriorOption: async (_parent: any, { input }: { input: any }, _context: Context):Promise<InteriorOptionDocument|null> => {    
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

        updateInteriorOption: async (_parent: any, { id, input }: { id: Types.ObjectId; input: any }, _context: Context):Promise<InteriorOptionDocument|null> => {
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

        deleteInteriorOption: async (_parent: any, { id }: { id: Types.ObjectId }, _context:Context):Promise<Boolean> => {
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
        createInteriorPackage: async (_parent: any, { input }: { input: InteriorPackageInput }, _context:Context):Promise<InteriorPackageDocument|null> => {
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
        ):Promise<InteriorPackageDocument|null> => {
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

                return package_;
            } catch (error: any) {
                throw new GraphQLError(`Error updating interior package: ${error.message}`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
        },

        deleteInteriorPackage: async (_parent: any, { id }: { id: Types.ObjectId }):Promise<Boolean> => {
            try {
                const package_ = await InteriorPackage.findById(id);

                if (!package_) {
                    throw new GraphQLError('Interior package not found', {
                        extensions: { code: 'NOT_FOUND' },
                    });
                }

                // Delete the package
                const result = await InteriorPackage.findByIdAndDelete(id);

                return !!result;
            } catch (error: any) {
                throw new GraphQLError(`Error deleting interior package: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        //Utility Interior Package mutations
        recalculatePackagePrice: async (_parent: any, { id }: { id: Types.ObjectId }):Promise<InteriorPackageDocument|null> => {
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
        ):Promise<InteriorPackageDocument[]|[]> => {
            try {
                return await recalculateAllPackagesForPlan(planId);
            } catch (error: any) {
                throw new GraphQLError(`Error recalculating all package prices: ${error.message}`, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },

        setBasePackage: async (_parent: any, { id }: { id: Types.ObjectId }, _context:Context): Promise<InteriorPackageDocument> => {
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

        // Structural mutations (admin only)
        createStructural: async (_parent: unknown, args: { structural: StructuralInput }, context: Context): Promise<StructuralDocument> => {
            requireAdmin(context);
            const structural = await StructuralOption.create(args.structural);
            return structural;
        },

        updateStructural: async (_parent: unknown, args: { id: Types.ObjectId; structural: StructuralInput }, context: Context): Promise<StructuralDocument | null> => {
            requireAdmin(context);
            const structural = await StructuralOption.findByIdAndUpdate(args.id, args.structural, { new: true });
            if (!structural) {
                throw new Error('Structural option not found');
            }
            return structural;
        },

        deleteStructural: async (_parent: unknown, args: { id: Types.ObjectId }, context: Context): Promise<StructuralDocument | null> => {
            requireAdmin(context);
            const structural = await StructuralOption.findByIdAndDelete(args.id);
            if (!structural) {
                throw new Error('Structural option not found');
            }
            return structural;
        },

        // Additional Option Mutations (admin only)
        createAdditional: async (_parent: unknown, args: { additional: AdditionalInput }, context: Context): Promise<AdditionalOptionDocument> => {
            requireAdmin(context);
            const additional = await AdditionalOption.create(args.additional);
            return additional;
        },

        updateAdditional: async (_parent: unknown, args: { id: Types.ObjectId; additional: AdditionalInput }, context: Context): Promise<AdditionalOptionDocument | null> => {
            requireAdmin(context);
            const additional = await AdditionalOption.findByIdAndUpdate(args.id, args.additional, { new: true });
            if (!additional) {
                throw new Error('Additional option not found');
            }
            return additional;
        },

        deleteAdditional: async (_parent: unknown, args: { id: Types.ObjectId }, context: Context): Promise<AdditionalOptionDocument | null> => {
            requireAdmin(context);
            const additional = await AdditionalOption.findByIdAndDelete(args.id);
            if (!additional) {
                throw new Error('Additional option not found');
            }
            return additional;
        },

        // Appliance mutations (admin only)
        createAppliance: async (_parent: unknown, args: { appliance: ApplianceInput }, context: Context): Promise<ApplianceDocument> => {
            requireAdmin(context);
            const appliance = await Appliance.create(args.appliance);
            return appliance;
        },

        updateAppliance: async (_parent: unknown, args: { id: Types.ObjectId; appliance: ApplianceInput }, context: Context): Promise<ApplianceDocument | null> => {
            requireAdmin(context);
            const appliance = await Appliance.findByIdAndUpdate(args.id, args.appliance, { new: true });
            if (!appliance) {
                throw new Error('Appliance not found');
            }
            return appliance;
        },

        deleteAppliance: async (_parent: unknown, args: { id: Types.ObjectId }, context: Context): Promise<ApplianceDocument | null> => {
            requireAdmin(context);
            const appliance = await Appliance.findByIdAndDelete(args.id);
            if (!appliance) {
                throw new Error('Appliance not found');
            }
            return appliance;
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

        // Lot Management (admin only)
        createLot: async (_parent: unknown, args: { lot: LotInput }, context: Context): Promise<LotDocument> => {
            requireAdmin(context);
            const lot = await Lot.create(args.lot);
            return lot;
        },

        updateLot: async (_parent: unknown, args: { id: Types.ObjectId; lot: LotInput }, context: Context): Promise<LotDocument | null> => {
            requireAdmin(context);
            const lot = await Lot.findByIdAndUpdate(args.id, args.lot, { new: true });
            if (!lot) {
                throw new Error('Lot not found');
            }
            return lot;
        },

        deleteLot: async (_parent: unknown, args: { id: Types.ObjectId }, context: Context): Promise<LotDocument | null> => {
            requireAdmin(context);
            const lot = await Lot.findByIdAndDelete(args.id);
            if (!lot) {
                throw new Error('Lot not found');
            }
            return lot;
        },

        // Lot Pricing mutations (admin only)
        createLotPricing: async (_parent: unknown, args: { lotPricing: LotPricingInput }, context: Context): Promise<LotPricingDocument> => {
            requireAdmin(context);
            const lotPricing = await LotPricing.create(args.lotPricing);
            return lotPricing;
        },

        updateLotPricing: async (_parent: unknown, args: { id: Types.ObjectId; lotPricing: LotPricingInput }, context: Context): Promise<LotPricingDocument | null> => {
            requireAdmin(context);
            const lotPricing = await LotPricing.findByIdAndUpdate(args.id, args.lotPricing, { new: true });
            if (!lotPricing) {
                throw new Error('Lot pricing not found');
            }
            return lotPricing;
        },

        deleteLotPricing: async (_parent: unknown, args: { id: Types.ObjectId }, context: Context): Promise<LotPricingDocument | null> => {
            requireAdmin(context);
            const lotPricing = await LotPricing.findByIdAndDelete(args.id);
            if (!lotPricing) {
                throw new Error('Lot pricing not found');
            }
            return lotPricing;
        },

        // Elevation relationships
        addElevationToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; elevationId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            // Verify elevation belongs to this plan
            await validateOptionBelongsToPlan(
                ElevationOption,
                args.elevationId,
                args.planId,
                'Elevation'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { elevations: args.elevationId } },
                { new: true }
            );

            return plan;
        },

        removeElevationFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; elevationId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            // Verify elevation belongs to this plan
            await validateOptionBelongsToPlan(
                ElevationOption,
                args.elevationId,
                args.planId,
                'Elevation'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { elevations: args.elevationId } },
                { new: true }
            );

            return plan;
        },

        // Structural relationships
        addStructuralToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; structuralId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                StructuralOption,
                args.structuralId,
                args.planId,
                'Structural option'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { structural: args.structuralId } },
                { new: true }
            );

            return plan;
        },

        removeStructuralFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; structuralId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                StructuralOption,
                args.structuralId,
                args.planId,
                'Structural option'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { structural: args.structuralId } },
                { new: true }
            );

            return plan;
        },


        // Interior Option relationships
        addInteriorOptionToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; interiorOptionId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                InteriorOption,
                args.interiorOptionId,
                args.planId,
                'Interior option'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { interiors: args.interiorOptionId } },
                { new: true }
            );

            return plan;
        },

        removeInteriorOptionFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; interiorOptionId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                InteriorOption,
                args.interiorOptionId,
                args.planId,
                'Interior option'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { interiors: args.interiorOptionId } },
                { new: true }
            );

            return plan;
        },

        // Interior Package relationships  
        addInteriorPackageToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; interiorPackageId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                InteriorPackage,
                args.interiorPackageId,
                args.planId,
                'Interior package'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { interiors: args.interiorPackageId } },
                { new: true }
            );

            return plan;
        },

        removeInteriorPackageFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; interiorPackageId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                InteriorPackage,
                args.interiorPackageId,
                args.planId,
                'Interior package'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { interiors: args.interiorPackageId } },
                { new: true }
            );

            return plan;
        },

        // Appliance relationships
        addApplianceToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; applianceId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            // Find the appliance
            const appliance = await Appliance.findById(args.applianceId);
            if (!appliance) {
                throw new GraphQLError('Appliance not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            // Determine which field to update based on appliance type
            const planField = appliance.type === 'kitchen' ? 'kitchenAppliance' : 'laundryAppliance';

            // Update appliance to include this plan in its planId array
            await Appliance.findByIdAndUpdate(
                args.applianceId,
                { $addToSet: { planId: args.planId } },
                { new: true }
            );

            // Update plan to include this appliance
            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { [planField]: args.applianceId } },
                { new: true }
            );

            return plan;
        },

        removeApplianceFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; applianceId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            // Find the appliance
            const appliance = await Appliance.findById(args.applianceId);
            if (!appliance) {
                throw new GraphQLError('Appliance not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            // Determine which field to update based on appliance type
            const planField = appliance.type === 'kitchen' ? 'kitchenAppliance' : 'laundryAppliance';

            // Remove this plan from the appliance's planId array
            await Appliance.findByIdAndUpdate(
                args.applianceId,
                { $pull: { planId: args.planId } },
                { new: true }
            );

            // Remove appliance from plan
            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { [planField]: args.applianceId } },
                { new: true }
            );

            return plan;
        },

        // Additional relationships
        addAdditionalToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; additionalId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                AdditionalOption,
                args.additionalId,
                args.planId,
                'Additional option'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { additional: args.additionalId } },
                { new: true }
            );

            return plan;
        },

        removeAdditionalFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; additionalId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                AdditionalOption,
                args.additionalId,
                args.planId,
                'Additional option'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { additional: args.additionalId } },
                { new: true }
            );

            return plan;
        },

        // Color Scheme relationships
        addColorSchemeToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; colorSchemeId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                ColorScheme,
                args.colorSchemeId,
                args.planId,
                'Color scheme'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { colorScheme: args.colorSchemeId } },
                { new: true }
            );

            return plan;
        },

        removeColorSchemeFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; colorSchemeId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            await validateOptionBelongsToPlan(
                ColorScheme,
                args.colorSchemeId,
                args.planId,
                'Color scheme'
            );

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { colorScheme: args.colorSchemeId } },
                { new: true }
            );

            return plan;
        },

        // Lot Pricing relationships
        addLotPricingToPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; lotPricingId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            // LotPricing uses 'plan' field instead of 'planId'
            const lotPricing = await LotPricing.findById(args.lotPricingId);

            if (!lotPricing) {
                throw new GraphQLError('Lot pricing not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            if (lotPricing.plan.toString() !== args.planId.toString()) {
                throw new GraphQLError(
                    'This lot pricing belongs to a different plan and cannot be added here',
                    { extensions: { code: 'INVALID_OPERATION' } }
                );
            }

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $addToSet: { lot: args.lotPricingId } },
                { new: true }
            );

            return plan;
        },

        removeLotPricingFromPlan: async (
            _parent: unknown,
            args: { planId: Types.ObjectId; lotPricingId: Types.ObjectId },
            context: Context
        ): Promise<PlanTypeDocument | null> => {
            requireAdmin(context);

            // LotPricing uses 'plan' field instead of 'planId'
            const lotPricing = await LotPricing.findById(args.lotPricingId);

            if (!lotPricing) {
                throw new GraphQLError('Lot pricing not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }

            if (lotPricing.plan.toString() !== args.planId.toString()) {
                throw new GraphQLError(
                    'This lot pricing does not belong to this plan',
                    { extensions: { code: 'INVALID_OPERATION' } }
                );
            }

            const plan = await Plan.findByIdAndUpdate(
                args.planId,
                { $pull: { lot: args.lotPricingId } },
                { new: true }
            );

            return plan;
        },

    }
};

export default resolvers;