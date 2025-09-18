import { User, Plan, Option, InteriorPackage, LotPremium, ColorScheme } from '../models/index.js';
import InteriorOption from '../models/OptionSchemas/InteriorOption.js';
import Appliance from '../models/OptionSchemas/Appliance.js';
import Structural from '../models/OptionSchemas/Structural.js';
import UserPlan from '../models/UserHome.js';
import { signToken, AuthenticationError } from '../services/auth.js';
import type {
    Auth,
    User as UserType,
    Plan as PlanType,
    Option as OptionType,
    ColorScheme as ColorSchemeType,
    InteriorPackage as InteriorPackageType,
    LotPremium as LotPremiumType,
    UserHome as UserHomeType,
    PlanInput,
    OptionInput,
    ColorSchemeInput,
    InteriorPackageInput,
    LotPremiumInput,
    UserHomeInput
} from '../types/graphql.js';

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

const toUserType = (userDoc: any): UserType => ({
    ...userDoc.toObject(),
    _id: userDoc._id.toString(),
    savedHomes: userDoc.savedHomes?.map(toUserHomeType) ?? [],
});

const toUserHomeType = (homeDoc: any): UserHomeType => ({
    ...homeDoc.toObject(),
    _id: homeDoc._id.toString(),
    userId: homeDoc.userId?.toString?.() ?? homeDoc.userId,
    planTypeId: homeDoc.planTypeId?.toString?.() ?? homeDoc.planTypeId,
    elevation: homeDoc.elevation,
    interior: homeDoc.interior,
    kitchenAppliance: homeDoc.kitchenAppliance,
    laundryAppliance: homeDoc.laundryAppliance,
    lotPremium: homeDoc.lotPremium,
    width: homeDoc.width,
    length: homeDoc.length,
    createdAt: homeDoc.createdAt?.toISOString?.() ?? homeDoc.createdAt,
    updatedAt: homeDoc.updatedAt?.toISOString?.() ?? homeDoc.updatedAt,
});

const toPlanType = (planDoc: any): PlanType => ({
    ...planDoc.toObject(),
    _id: planDoc._id.toString(),
});

const toOptionType = (optionDoc: any): OptionType => ({
    ...optionDoc.toObject(),
    _id: optionDoc._id.toString(),
});

const toColorSchemeType = (colorSchemeDoc: any): ColorSchemeType => ({
    ...colorSchemeDoc.toObject(),
    _id: colorSchemeDoc._id.toString(),
    createdAt: colorSchemeDoc.createdAt?.toISOString?.() ?? colorSchemeDoc.createdAt,
    updatedAt: colorSchemeDoc.updatedAt?.toISOString?.() ?? colorSchemeDoc.updatedAt,
});

const toInteriorPackageType = (pkgDoc: any): InteriorPackageType => ({
    ...pkgDoc.toObject(),
    _id: pkgDoc._id.toString(),
});

const toLotPremiumType = (lotDoc: any): LotPremiumType => ({
    ...lotDoc.toObject(),
    _id: lotDoc._id.toString(),
    filing: lotDoc.filing,
    lot: lotDoc.lot,
    width: lotDoc.width,
    length: lotDoc.length,
    lotSqft: lotDoc.lotSqft,
    premium: lotDoc.premium,
    address: lotDoc.address,
    parcelNumber: lotDoc.parcelNumber,
});

const resolvers = {
    // Union type resolver for PlanOption
    PlanOption: {
        __resolveType(obj: any) {
            if (obj.filing !== undefined && obj.lot !== undefined) {
                return 'PlanLotPremium';
            }
            if (obj.type !== undefined) {
                return 'PlanApplianceOption';
            }
            if (obj.totalPrice !== undefined) {
                return 'PlanInteriorOption';
            }
            if (obj.garage !== undefined || obj.bedrooms !== undefined) {
                return 'PlanStructuralOption';
            }
            if (obj.category !== undefined) {
                return 'PlanAdditionalOption';
            }
            return 'PlanElevationOption';
        }
    },

    Query: {
        me: async (_parent: unknown, _args: unknown, context: any): Promise<UserType | null> => {
            requireAuth(context);
            const userDoc = await User.findOne({ _id: context.user._id }).populate('savedHomes');
            return userDoc ? toUserType(userDoc) : null;
        },

        user: async (_parent: unknown, args: { id?: string; username?: string }): Promise<UserType | null> => {
            const userDoc = await User.findOne({
                $or: [{ _id: args.id }, { username: args.username }]
            }).populate('savedHomes');
            return userDoc ? toUserType(userDoc) : null;
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

        // Option queries
        options: async (): Promise<OptionType[]> => {
            return (await Option.find({}).sort({ classification: 1, name: 1 })).map(toOptionType);
        },

        // Interior Option queries
        interiorOptions: async (): Promise<any[]> => {
            return (await InteriorOption.find({}).sort({ material: 1, name: 1 })).map(toOptionType);
        },

        // Appliance queries
        appliances: async (): Promise<any[]> => {
            return (await Appliance.find({}).sort({ type: 1, name: 1 })).map(toOptionType);
        },

        // Structural option queries
        structuralOptions: async (): Promise<any[]> => {
            return (await Structural.find({}).sort({ name: 1 })).map(toOptionType);
        },

        // Color Scheme queries
        colorSchemes: async (): Promise<ColorSchemeType[]> => {
            return (await ColorScheme.find({ isActive: true }).sort({ sortOrder: 1, name: 1 })).map(toColorSchemeType);
        },

        // Interior package queries
        interiorPackages: async (): Promise<InteriorPackageType[]> => {
            const interior = await InteriorPackage.find({}).sort({ totalPrice: 1, name: 1 });
            return interior.map(toInteriorPackageType);
        },

        // Lot premium queries
        lotPremiums: async (): Promise<LotPremiumType[]> => {
            return (await LotPremium.find({}).sort({ filing: 1, lot: 1 })).map(toLotPremiumType);
        },

        // Plan-specific option queries (for browsing across all plans)
        allPlanElevations: async (): Promise<any[]> => {
            const plans = await Plan.find({}, 'elevations name planType');
            const allElevations: any[] = [];
            plans.forEach(plan => {
                plan.elevations.forEach((elevation: any) => {
                    allElevations.push({
                        ...elevation.toObject(),
                        planName: plan.name,
                        planType: plan.planType,
                        planId: plan._id
                    });
                });
            });
            return allElevations.sort((a, b) => a.name.localeCompare(b.name));
        },

        allPlanStructural: async (): Promise<any[]> => {
            const plans = await Plan.find({}, 'structural name planType');
            const allStructural: any[] = [];
            plans.forEach(plan => {
                plan.structural.forEach((structural: any) => {
                    allStructural.push({
                        ...structural.toObject(),
                        planName: plan.name,
                        planType: plan.planType,
                        planId: plan._id
                    });
                });
            });
            return allStructural.sort((a, b) => a.name.localeCompare(b.name));
        },

        allPlanInteriors: async (): Promise<any[]> => {
            const plans = await Plan.find({}, 'interiors name planType');
            const allInteriors: any[] = [];
            plans.forEach(plan => {
                plan.interiors.forEach((interior: any) => {
                    allInteriors.push({
                        ...interior.toObject(),
                        planName: plan.name,
                        planType: plan.planType,
                        planId: plan._id
                    });
                });
            });
            return allInteriors.sort((a, b) => a.name.localeCompare(b.name));
        },

        allPlanAppliances: async (): Promise<any[]> => {
            const plans = await Plan.find({}, 'kitchenAppliance laundryAppliance name planType');
            const allAppliances: any[] = [];
            plans.forEach(plan => {
                [...plan.kitchenAppliance, ...plan.laundryAppliance].forEach((appliance: any) => {
                    allAppliances.push({
                        ...appliance.toObject(),
                        planName: plan.name,
                        planType: plan.planType,
                        planId: plan._id
                    });
                });
            });
            return allAppliances.sort((a, b) => a.name.localeCompare(b.name));
        },

        allPlanAdditional: async (): Promise<any[]> => {
            const plans = await Plan.find({}, 'additional name planType');
            const allAdditional: any[] = [];
            plans.forEach(plan => {
                plan.additional.forEach((additional: any) => {
                    allAdditional.push({
                        ...additional.toObject(),
                        planName: plan.name,
                        planType: plan.planType,
                        planId: plan._id
                    });
                });
            });
            return allAdditional.sort((a, b) => a.name.localeCompare(b.name));
        },

        allPlanLots: async (): Promise<any[]> => {
            const plans = await Plan.find({}, 'lotPremium name planType');
            const allLots: any[] = [];
            plans.forEach(plan => {
                plan.lotPremium.forEach((lot: any) => {
                    allLots.push({
                        ...lot.toObject(),
                        planName: plan.name,
                        planType: plan.planType,
                        planId: plan._id
                    });
                });
            });
            return allLots.sort((a, b) => (a.filing - b.filing) || (a.lot - b.lot));
        },

        searchPlanOptions: async (_parent: unknown, args: { query: string; type: string }): Promise<any[]> => {
            const searchRegex = new RegExp(args.query, 'i');
            const plans = await Plan.find({});
            const results: any[] = [];

            plans.forEach(plan => {
                const optionArrays = {
                    elevation: plan.elevations,
                    structural: plan.structural,
                    interior: plan.interiors,
                    appliance: [...plan.kitchenAppliance, ...plan.laundryAppliance],
                    additional: plan.additional,
                    lot: plan.lotPremium
                };

                const optionsToSearch = args.type === 'all' ? 
                    Object.values(optionArrays).flat() : 
                    optionArrays[args.type as keyof typeof optionArrays] || [];

                optionsToSearch.forEach((option: any) => {
                    if (option.name && searchRegex.test(option.name)) {
                        results.push({
                            ...option.toObject(),
                            planName: plan.name,
                            planType: plan.planType,
                            planId: plan._id,
                            optionType: args.type
                        });
                    }
                });
            });

            return results.sort((a, b) => a.name.localeCompare(b.name));
        },

        planOptions: async (_parent: unknown, args: { planId: string; optionType: string }): Promise<any[]> => {
            const plan = await Plan.findById(args.planId);
            if (!plan) {
                throw new Error('Plan not found');
            }

            const optionArrays = {
                elevation: plan.elevations,
                structural: plan.structural,
                interior: plan.interiors,
                kitchenAppliance: plan.kitchenAppliance,
                laundryAppliance: plan.laundryAppliance,
                additional: plan.additional,
                lot: plan.lotPremium
            };

            const options = optionArrays[args.optionType as keyof typeof optionArrays] || [];
            return options.map((option: any) => option.toObject()).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        },
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

        // Option mutations (admin only)
        createOption: async (_parent: unknown, args: { option: OptionInput }, context: any): Promise<OptionType> => {
            requireAdmin(context);
            const option = await Option.create(args.option);
            return toOptionType(option);
        },

        updateOption: async (_parent: unknown, args: { id: string; option: OptionInput }, context: any): Promise<OptionType | null> => {
            requireAdmin(context);
            const option = await Option.findByIdAndUpdate(args.id, args.option, { new: true });
            return option ? toOptionType(option) : null;
        },

        deleteOption: async (_parent: unknown, args: { id: string }, context: any): Promise<OptionType | null> => {
            requireAdmin(context);
            const option = await Option.findByIdAndDelete(args.id);
            return option ? toOptionType(option) : null;
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

        // Interior Package mutations (admin only)
        createInteriorPackage: async (_parent: unknown, args: { interiorPackage: InteriorPackageInput }, context: any): Promise<InteriorPackageType> => {
            requireAdmin(context);
            const pkg = await InteriorPackage.create(args.interiorPackage);
            return toInteriorPackageType(pkg);
        },

        updateInteriorPackage: async (_parent: unknown, args: { id: string; interiorPackage: InteriorPackageInput }, context: any): Promise<InteriorPackageType | null> => {
            requireAdmin(context);
            const pkg = await InteriorPackage.findByIdAndUpdate(args.id, args.interiorPackage, { new: true });
            return pkg ? toInteriorPackageType(pkg) : null;
        },

        deleteInteriorPackage: async (_parent: unknown, args: { id: string }, context: any): Promise<InteriorPackageType | null> => {
            requireAdmin(context);
            const pkg = await InteriorPackage.findByIdAndDelete(args.id);
            return pkg ? toInteriorPackageType(pkg) : null;
        },

        // Lot Premium mutations (admin only)
        createLotPremium: async (_parent: unknown, args: { lotPremium: LotPremiumInput }, context: any): Promise<LotPremiumType> => {
            requireAdmin(context);
            const lot = await LotPremium.create(args.lotPremium);
            return toLotPremiumType(lot);
        },

        updateLotPremium: async (_parent: unknown, args: { id: string; lotPremium: LotPremiumInput }, context: any): Promise<LotPremiumType | null> => {
            requireAdmin(context);
            const lot = await LotPremium.findByIdAndUpdate(args.id, args.lotPremium, { new: true });
            return lot ? toLotPremiumType(lot) : null;
        },

        deleteLotPremium: async (_parent: unknown, args: { id: string }, context: any): Promise<LotPremiumType | null> => {
            requireAdmin(context);
            const lot = await LotPremium.findByIdAndDelete(args.id);
            return lot ? toLotPremiumType(lot) : null;
        },

        // User Home mutations
        saveUserHome: async (_parent: unknown, args: { userHome: UserHomeInput }, context: any): Promise<UserType> => {
            requireAuth(context);
            await UserPlan.create({
                ...args.userHome,
                userId: context.user._id,
                structuralOptions: args.userHome.structuralOptions || [],
                additionalOptions: args.userHome.additionalOptions || []
            });
            const user = await User.findById(context.user._id).populate('savedHomes');
            return toUserType(user);
        },

        updateUserHome: async (_parent: unknown, args: { id: string; userHome: UserHomeInput }, context: any): Promise<UserHomeType> => {
            requireAuth(context);
            const updatedUserPlan = await UserPlan.findOneAndUpdate(
                { _id: args.id, userId: context.user._id },
                { 
                    ...args.userHome,
                    structuralOptions: args.userHome.structuralOptions || [],
                    additionalOptions: args.userHome.additionalOptions || []
                },
                { new: true, runValidators: true }
            );

            if (!updatedUserPlan) {
                throw new Error('Home not found or access denied');
            }

            return toUserHomeType(updatedUserPlan);
        },

        deleteUserHome: async (_parent: unknown, args: { id: string }, context: any): Promise<UserType> => {
            requireAuth(context);
            await UserPlan.findOneAndUpdate(
                { _id: args.id, userId: context.user._id },
                { isActive: false },
                { new: true }
            );
            const user = await User.findById(context.user._id);
            return toUserType(user);
        },

        // Appliance mutations (admin only)
        createAppliance: async (_parent: unknown, args: { appliance: any }, context: any): Promise<any> => {
            requireAdmin(context);
            const appliance = await Appliance.create(args.appliance);
            return toOptionType(appliance);
        },

        updateAppliance: async (_parent: unknown, args: { id: string; appliance: any }, context: any): Promise<any> => {
            requireAdmin(context);
            const appliance = await Appliance.findByIdAndUpdate(args.id, args.appliance, { new: true });
            return appliance ? toOptionType(appliance) : null;
        },

        deleteAppliance: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {
            requireAdmin(context);
            const appliance = await Appliance.findByIdAndDelete(args.id);
            return appliance ? toOptionType(appliance) : null;
        },

        // Structural mutations (admin only)
        createStructural: async (_parent: unknown, args: { structural: any }, context: any): Promise<any> => {
            requireAdmin(context);
            const structural = await Structural.create(args.structural);
            return toOptionType(structural);
        },

        updateStructural: async (_parent: unknown, args: { id: string; structural: any }, context: any): Promise<any> => {
            requireAdmin(context);
            const structural = await Structural.findByIdAndUpdate(args.id, args.structural, { new: true });
            return structural ? toOptionType(structural) : null;
        },

        deleteStructural: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {
            requireAdmin(context);
            const structural = await Structural.findByIdAndDelete(args.id);
            return structural ? toOptionType(structural) : null;
        },

        // InteriorOption mutations (admin only)
        createInteriorOption: async (_parent: unknown, args: { interiorOption: any }, context: any): Promise<any> => {
            requireAdmin(context);
            const interiorOption = await InteriorOption.create(args.interiorOption);
            return toOptionType(interiorOption);
        },

        updateInteriorOption: async (_parent: unknown, args: { id: string; interiorOption: any }, context: any): Promise<any> => {
            requireAdmin(context);
            const interiorOption = await InteriorOption.findByIdAndUpdate(args.id, args.interiorOption, { new: true });
            return interiorOption ? toOptionType(interiorOption) : null;
        },

        deleteInteriorOption: async (_parent: unknown, args: { id: string }, context: any): Promise<any> => {
            requireAdmin(context);
            const interiorOption = await InteriorOption.findByIdAndDelete(args.id);
            return interiorOption ? toOptionType(interiorOption) : null;
        },

        // Plan-specific option management mutations
        addElevationToPlan: async (_parent: unknown, args: { planId: string; elevation: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('📥 ADD_ELEVATION_TO_PLAN Request from user:', context.user?.username || 'Unknown');
            console.log('📋 Plan ID:', args.planId);
            console.log('📋 Elevation data:', JSON.stringify(args.elevation, null, 2));
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $push: { elevations: args.elevation } },
                    { new: true }
                );
                if (plan) {
                    console.log('✅ Elevation added to plan successfully');
                    return toPlanType(plan);
                } else {
                    console.warn('⚠️ Plan not found:', args.planId);
                    return null;
                }
            } catch (error) {
                console.error('❌ Add elevation to plan failed:', error);
                throw error;
            }
        },

        updatePlanElevation: async (_parent: unknown, args: { planId: string; elevationId: string; elevation: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('📥 UPDATE_PLAN_ELEVATION Request from user:', context.user?.username || 'Unknown');
            
            try {
                const plan = await Plan.findOneAndUpdate(
                    { _id: args.planId, 'elevations._id': args.elevationId },
                    { $set: { 'elevations.$': { ...args.elevation, _id: args.elevationId } } },
                    { new: true }
                );
                if (plan) {
                    console.log('✅ Plan elevation updated successfully');
                    return toPlanType(plan);
                } else {
                    console.warn('⚠️ Plan or elevation not found');
                    return null;
                }
            } catch (error) {
                console.error('❌ Update plan elevation failed:', error);
                throw error;
            }
        },

        removePlanElevation: async (_parent: unknown, args: { planId: string; elevationId: string }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('📥 REMOVE_PLAN_ELEVATION Request from user:', context.user?.username || 'Unknown');
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $pull: { elevations: { _id: args.elevationId } } },
                    { new: true }
                );
                if (plan) {
                    console.log('✅ Elevation removed from plan successfully');
                    return toPlanType(plan);
                } else {
                    console.warn('⚠️ Plan not found:', args.planId);
                    return null;
                }
            } catch (error) {
                console.error('❌ Remove elevation from plan failed:', error);
                throw error;
            }
        },

        addStructuralToPlan: async (_parent: unknown, args: { planId: string; structural: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('📥 ADD_STRUCTURAL_TO_PLAN Request from user:', context.user?.username || 'Unknown');
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $push: { structural: args.structural } },
                    { new: true }
                );
                if (plan) {
                    console.log('✅ Structural option added to plan successfully');
                    return toPlanType(plan);
                } else {
                    console.warn('⚠️ Plan not found:', args.planId);
                    return null;
                }
            } catch (error) {
                console.error('❌ Add structural to plan failed:', error);
                throw error;
            }
        },

        updatePlanStructural: async (_parent: unknown, args: { planId: string; structuralId: string; structural: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findOneAndUpdate(
                    { _id: args.planId, 'structural._id': args.structuralId },
                    { $set: { 'structural.$': { ...args.structural, _id: args.structuralId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Update plan structural failed:', error);
                throw error;
            }
        },

        removePlanStructural: async (_parent: unknown, args: { planId: string; structuralId: string }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $pull: { structural: { _id: args.structuralId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Remove structural from plan failed:', error);
                throw error;
            }
        },

        addInteriorToPlan: async (_parent: unknown, args: { planId: string; interior: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('📥 ADD_INTERIOR_TO_PLAN Request from user:', context.user?.username || 'Unknown');
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $push: { interiors: args.interior } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Add interior to plan failed:', error);
                throw error;
            }
        },

        updatePlanInterior: async (_parent: unknown, args: { planId: string; interiorId: string; interior: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findOneAndUpdate(
                    { _id: args.planId, 'interiors._id': args.interiorId },
                    { $set: { 'interiors.$': { ...args.interior, _id: args.interiorId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Update plan interior failed:', error);
                throw error;
            }
        },

        removePlanInterior: async (_parent: unknown, args: { planId: string; interiorId: string }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $pull: { interiors: { _id: args.interiorId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Remove interior from plan failed:', error);
                throw error;
            }
        },

        addApplianceToPlan: async (_parent: unknown, args: { planId: string; appliance: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            console.log('📥 ADD_APPLIANCE_TO_PLAN Request from user:', context.user?.username || 'Unknown');
            
            try {
                // Determine which appliance array to update based on appliance type
                const updateField = args.appliance.type === 'kitchen' ? 'kitchenAppliance' : 'laundryAppliance';
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $push: { [updateField]: args.appliance } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Add appliance to plan failed:', error);
                throw error;
            }
        },

        updatePlanAppliance: async (_parent: unknown, args: { planId: string; applianceId: string; appliance: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                // Update either kitchen or laundry appliance based on type
                const updateField = args.appliance.type === 'kitchen' ? 'kitchenAppliance' : 'laundryAppliance';
                const plan = await Plan.findOneAndUpdate(
                    { _id: args.planId, [`${updateField}._id`]: args.applianceId },
                    { $set: { [`${updateField}.$`]: { ...args.appliance, _id: args.applianceId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Update plan appliance failed:', error);
                throw error;
            }
        },

        removePlanAppliance: async (_parent: unknown, args: { planId: string; applianceId: string }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                // Try to remove from both kitchen and laundry arrays
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { 
                        $pull: { 
                            kitchenAppliance: { _id: args.applianceId },
                            laundryAppliance: { _id: args.applianceId }
                        } 
                    },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Remove appliance from plan failed:', error);
                throw error;
            }
        },

        addAdditionalToPlan: async (_parent: unknown, args: { planId: string; additional: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $push: { additional: args.additional } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Add additional to plan failed:', error);
                throw error;
            }
        },

        updatePlanAdditional: async (_parent: unknown, args: { planId: string; additionalId: string; additional: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findOneAndUpdate(
                    { _id: args.planId, 'additional._id': args.additionalId },
                    { $set: { 'additional.$': { ...args.additional, _id: args.additionalId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Update plan additional failed:', error);
                throw error;
            }
        },

        removePlanAdditional: async (_parent: unknown, args: { planId: string; additionalId: string }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $pull: { additional: { _id: args.additionalId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Remove additional from plan failed:', error);
                throw error;
            }
        },

        addLotToPlan: async (_parent: unknown, args: { planId: string; lot: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $push: { lotPremium: args.lot } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Add lot to plan failed:', error);
                throw error;
            }
        },

        updatePlanLot: async (_parent: unknown, args: { planId: string; lotId: string; lot: any }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findOneAndUpdate(
                    { _id: args.planId, 'lotPremium._id': args.lotId },
                    { $set: { 'lotPremium.$': { ...args.lot, _id: args.lotId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Update plan lot failed:', error);
                throw error;
            }
        },

        removePlanLot: async (_parent: unknown, args: { planId: string; lotId: string }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            
            try {
                const plan = await Plan.findByIdAndUpdate(
                    args.planId,
                    { $pull: { lotPremium: { _id: args.lotId } } },
                    { new: true }
                );
                return plan ? toPlanType(plan) : null;
            } catch (error) {
                console.error('❌ Remove lot from plan failed:', error);
                throw error;
            }
        },
    }
};

export default resolvers;