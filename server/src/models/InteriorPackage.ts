import { Schema, model, type Document } from 'mongoose';
import type { OptionDocument } from './Option.js';

export interface InteriorPackageDocument extends Document {
  name: string;
  totalPrice: number;
  fixtures: OptionDocument[];
  lvp: OptionDocument[];
  carpet: OptionDocument[];
  backsplash: OptionDocument[];
  masterBathTile: OptionDocument[];
  countertop: OptionDocument[];
  primaryCabinets: OptionDocument[];
  secondaryCabinets: OptionDocument[];
  upgrade: boolean;
}

const interiorPackageSchema = new Schema<InteriorPackageDocument>({
  name: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  fixtures: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  lvp: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  carpet: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  backsplash: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  masterBathTile: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  countertop: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  primaryCabinets: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  secondaryCabinets: [{ type: Schema.Types.ObjectId, ref: 'Option' }],
  upgrade: { type: Boolean, default: false },
});

const InteriorPackage = model<InteriorPackageDocument>('InteriorPackage', interiorPackageSchema);

export default InteriorPackage;