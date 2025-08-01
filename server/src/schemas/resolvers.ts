import { User, Plan, Option, InteriorPackage, LotPremium } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
import type {
    Auth,
    User as UserType,
    Plan as PlanType,
    Option as OptionType,
    InteriorPackage as InteriorPackageType,
    LotPremium as LotPremiumType,
    UserHome as UserHomeType,
    PlanInput,
    OptionInput,
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
    price: lotDoc.price,
});

const resolvers = {
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
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lotPremium');
            return plans.map(toPlanType);
        },

        plan: async (_parent: unknown, args: { id: string }): Promise<PlanType | null> => {
            const plan = await Plan.findById(args.id)
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lotPremium');
            return plan ? toPlanType(plan) : null;
        },

        planByType: async (_parent: unknown, args: { planType: number }): Promise<PlanType | null> => {
            const plan = await Plan.findOne({ planType: args.planType })
                .populate('elevations')
                .populate('interiors')
                .populate('structural')
                .populate('additional')
                .populate('kitchenAppliance')
                .populate('laundryAppliance')
                .populate('lotPremium');
            return plan ? toPlanType(plan) : null;
        },

        // User home queries
        userHomes: async (_parent: unknown, _args: unknown, context: any): Promise<UserHomeType[]> => {
            requireAuth(context);
            const user = await User.findById(context.user._id).populate('savedHomes');
            return user?.savedHomes?.map(toUserHomeType) ?? [];
        },

        userHome: async (_parent: unknown, args: { id: string }, context: any): Promise<UserHomeType | null> => {
            requireAuth(context);
            const user = await User.findById(context.user._id).populate('savedHomes');
            const home = user?.savedHomes?.find((home: any) => home._id.toString() === args.id);
            return home ? toUserHomeType(home) : null;
        },

        // Option queries
        options: async (): Promise<OptionType[]> => {
            return (await Option.find({})).map(toOptionType);
        },

        // Interior package queries
        interiorPackages: async (): Promise<InteriorPackageType[]> => {
            const interior = await InteriorPackage.find({})
                .populate('fixtures')
                .populate('lvp')
                .populate('carpet')
                .populate('backsplash')
                .populate('masterBathTile')
                .populate('countertop')
                .populate('primaryCabinets')
                .populate('secondaryCabinets')
            
            return interior.map(toInteriorPackageType);
        },

        // Lot premium queries
        lotPremiums: async (): Promise<LotPremiumType[]> => {
            return (await LotPremium.find({})).map(toLotPremiumType);
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
            const plan = await Plan.create(args.plan);
            return toPlanType(plan);
        },

        updatePlan: async (_parent: unknown, args: { id: string; plan: PlanInput }, context: any): Promise<PlanType | null> => {
            requireAdmin(context);
            const plan = await Plan.findByIdAndUpdate(args.id, args.plan, { new: true });
            return plan ? toPlanType(plan) : null;
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
            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $addToSet: { savedHomes: { ...args.userHome, userId: context.user._id } } },
                { new: true, runValidators: true }
            ).populate('savedHomes');
            return toUserType(updatedUser);
        },

        updateUserHome: async (_parent: unknown, args: { id: string; userHome: UserHomeInput }, context: any): Promise<UserHomeType> => {
            requireAuth(context);
            const user = await User.findById(context.user._id).populate('savedHomes');
            if (!user) {
                throw new AuthenticationError('User not found');
            }

            const homeIndex = user.savedHomes.findIndex((home: any) => home._id.toString() === args.id);
            if (homeIndex === -1) {
                throw new Error('Home not found');
            }

            // Use findByIdAndUpdate to properly update the nested array element
            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $set: { [`savedHomes.${homeIndex}`]: { ...user.savedHomes[homeIndex].toObject(), ...args.userHome } } },
                { new: true, runValidators: true }
            ).populate('savedHomes');

            if (!updatedUser) {
                throw new Error('Failed to update user home');
            }

            return toUserHomeType(updatedUser.savedHomes[homeIndex]);
        },

        deleteUserHome: async (_parent: unknown, args: { id: string }, context: any): Promise<UserType> => {
            requireAuth(context);
            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedHomes: { _id: args.id } } },
                { new: true }
            ).populate('savedHomes');
            return toUserType(updatedUser);
        },
    }
};

export default resolvers;