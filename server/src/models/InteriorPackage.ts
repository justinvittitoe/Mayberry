import { Schema, model, type Document } from 'mongoose';

export interface InteriorPackageDocument extends Document {
  name: string;
  totalPrice: number;
  fixtures: any[];
  lvp: any[];
  carpet: any[];
  backsplash: any[];
  masterBathTile: any[];
  countertop: any[];
  primaryCabinets: any[];
  secondaryCabinets: any[];
  upgrade: boolean;
}

const interiorPackageSchema = new Schema<InteriorPackageDocument>({
  name: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  fixtures: [Schema.Types.Mixed],
  lvp: [Schema.Types.Mixed],
  carpet: [Schema.Types.Mixed],
  backsplash: [Schema.Types.Mixed],
  masterBathTile: [Schema.Types.Mixed],
  countertop: [Schema.Types.Mixed],
  primaryCabinets: [Schema.Types.Mixed],
  secondaryCabinets: [Schema.Types.Mixed],
  upgrade: { type: Boolean, default: false },
});

const InteriorPackage = model<InteriorPackageDocument>('InteriorPackage', interiorPackageSchema);

export default InteriorPackage;