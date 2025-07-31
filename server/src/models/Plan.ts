import { Schema, model, type Document } from 'mongoose';
import type { OptionDocument } from './Option.js';
import type { InteriorPackageDocument } from './InteriorPackage.js';
import type { LotPremiumDocument } from './LotPremium.js';

export interface PlanTypeDocument extends Document {
  planType: number;
  name: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  garageType: string;
  basePrice: number;
  description?: string;
  elevations: OptionDocument[];
  colorScheme: number[];
  interiors: InteriorPackageDocument[];
  structural: OptionDocument[];
  additional: OptionDocument[];
  kitchenAppliance: OptionDocument[];
  laundryAppliance: OptionDocument[];
  lotPremium: LotPremiumDocument[];
}

const planTypeSchema = new Schema({
  planType: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFootage: { type: Number, required: true },
  garageType: { type: String, required: true },
  basePrice: { type: Number, required: true },
  description: { type: String },
  elevations: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  colorScheme: [Number],
  interiors: [{ type: Schema.Types.ObjectId, ref: 'InteriorPackage' }],
  structural: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  additional: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  kitchenAppliance: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  laundryAppliance: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  lotPremium: [{ type: Schema.Types.ObjectId, ref: 'LotPremium' }],
});

const Plan = model<PlanTypeDocument>('Plan', planTypeSchema);

export default Plan;

