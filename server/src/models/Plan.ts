import { Schema, model } from 'mongoose';
import type { Option } from './Option';
import type { InteriorPackage } from './InteriorPackage';
import type { LotPremium } from './LotPremium';
import optionSchema from './Option.js';
import interiorPackageSchema from './InteriorPackage.js';
import lotPremiumSchema from './LotPremium.js';

export interface PlanTypeDocument extends Document {
  planType: number;
  name: string;
  basePrice: number;
  elevations: Option[];
  colorScheme: number[];
  interiors: InteriorPackage[];
  structural: Option[];
  additional: Option[];
  kitchenAppliance: Option[];
  laundryAppliance: Option[];
  lotPremium: LotPremium[];
}

const planTypeSchema = new Schema({
  planType: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  elevations: [optionSchema],
  colorScheme: [Number],
  interiors: [interiorPackageSchema],
  structural: [optionSchema],
  additional: [optionSchema],
  kitchenAppliance: [optionSchema],
  laundryAppliance: [optionSchema],
  lotPremium: [lotPremiumSchema],
});

const Plan = model<PlanTypeDocument>('Plan', planTypeSchema);

export default Plan;

