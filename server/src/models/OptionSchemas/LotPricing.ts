import { Schema, Types, model, type Document } from 'mongoose';


export interface LotPricingDocument extends Document {
    _id: Types.ObjectId;
    lot: Types.ObjectId;
    plan: Types.ObjectId;
    lotPremium: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LotPricingSchema = new Schema<LotPricingDocument>({
    lot: { type: Schema.Types.ObjectId, required: true, ref: 'Lot'},
    plan: { type: Schema.Types.ObjectId, required: true, ref: 'Plan'},
    lotPremium: { type: Number, required: true, min: 0, default: 1000},
    isActive: { type: Boolean, default: true}
}, {timestamps: true, _id: true})

LotPricingSchema.index({ Lot: 1, plan: 1}, {unique: true})

const LotPricing = model<LotPricingDocument>('LotPricing', LotPricingSchema)

export default LotPricing