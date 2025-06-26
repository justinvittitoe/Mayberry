import { Schema, type Document, Types, model } from 'mongoose';

// Main user home selection schema
export interface UserHomeSelection extends Document {
    userId: Types.ObjectId;
    planTypeId: Types.ObjectId;
    planTypeName: string;
    basePrice: number;
    elevation: Types.ObjectId;
    colorScheme: number;
    interior: Types.ObjectId;
    structural: Types.ObjectId[]; // Array of selected option IDs
    additional: Types.ObjectId[];
    kitchenAppliance: Types.ObjectId;
    laundryAppliance: Types.ObjectId;
    lotPremium: Types.ObjectId;
    totalPrice?: number;
    createdAt: Date;
    updatedAt: Date;
}

const userHomeSelectionSchema = new Schema<UserHomeSelection>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planTypeId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    planTypeName: { type: String, required: true },
    basePrice: { type: Number, required: true },
    elevation: { type: Schema.Types.ObjectId, ref: 'Option', required: true },
    colorScheme: { type: Number, required: true },
    interior: { type: Schema.Types.ObjectId, ref: 'InteriorPackage', required: true },
    structural: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
    additional: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
    kitchenAppliance: { type: Schema.Types.ObjectId, ref: 'Option', required: true },
    laundryAppliance: { type: Schema.Types.ObjectId, ref: 'Option', required: true },
    lotPremium: { type: Schema.Types.ObjectId, ref: 'LotPremium', required: true },
}, { timestamps: true });

// Virtual for total price - this will need to be calculated in resolvers
userHomeSelectionSchema.virtual('totalPrice').get(function (this: UserHomeSelection) {
    // This will be calculated in resolvers when we populate the references
    return 0; // Placeholder
});

const UserHome = model<UserHomeSelection>('UserHome', userHomeSelectionSchema);

export { userHomeSelectionSchema };
export default UserHome;