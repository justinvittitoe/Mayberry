import { Schema, type Document, Types } from 'mongoose';
import { model } from 'mongoose';

import type { Option } from './Option';
import type { InteriorPackage } from './InteriorPackage';
import type { LotPremium } from './LotPremium';
import lotPremiumSchema from './LotPremium';
import interiorPackageSchema from './InteriorPackage';
import optionSchema from './Option';

// Main user home selection schema
export interface UserHomeSelection extends Document {
    userId: Types.ObjectId;
    planTypeId: Types.ObjectId;
    planTypeName: string;
    basePrice: number;
    elevation: Option;
    colorScheme: number;
    interior: InteriorPackage;
    structural: Option[]; // Array of selected
    additional: Option[];
    kitchenAppliance: Option;
    laundryAppliance: Option;
    lotPremium: LotPremium;
    totalPrice?: number;
    createdAt: Date;
    updatedAt: Date;
}

const userHomeSelectionSchema = new Schema<UserHomeSelection>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planTypeId: { type: Schema.Types.ObjectId, ref: 'PlanType', required: true },
    planTypeName: { type: String, required: true },
    basePrice: { type: Number, required: true },
    elevation: { type: optionSchema, required: true },
    colorScheme: { type: Number, required: true },
    interior: { type: interiorPackageSchema, required: true },
    structural: [optionSchema],
    additional: [optionSchema],
    kitchenAppliance: { type: optionSchema, required: true },
    laundryAppliance: { type: optionSchema, required: true },
    lotPremium: { type: lotPremiumSchema, required: true },
}, { timestamps: true });

// Virtual for total price
userHomeSelectionSchema.virtual('totalPrice').get(function (this: UserHomeSelection) {
    const structuralTotal = (this.structural || []).reduce((sum, o) => sum + (o.price || 0), 0);
    const additionalTotal = (this.additional || []).reduce((sum, o) => sum + (o.price || 0), 0);
    return (
        (this.basePrice || 0) +
        (this.elevation?.price || 0) +
        (this.interior?.totalPrice || 0) +
        structuralTotal +
        additionalTotal +
        (this.kitchenAppliance?.price || 0) +
        (this.laundryAppliance?.price || 0) +
        (this.lotPremium?.price || 0)
    );
});


const UserHome = model<UserHomeSelection>('UserHome', userHomeSelectionSchema);
export default { UserHome };