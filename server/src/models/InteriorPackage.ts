import { Schema, model, type Document } from 'mongoose';

export interface InteriorPackageDocument extends Document {
  name: string;
  totalPrice: number;
  fitures: string;
  lvp: string;
  carpet: string;
  kitchenBackspash: string;
  masterBathTile: string;
  countertop: string;
  primaryCabinets: string;
  secondaryCabinets: string;
  upgrade: string;
}

const interiorPackageSchema = new Schema<InteriorPackageDocument>({
  name: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  fitures: String,
  lvp: String,
  carpet: String,
  kitchenBackspash: String,
  masterBathTile: String,
  countertop: String,
  primaryCabinets: String,
  secondaryCabinets: String,
  upgrade: String,
});

const InteriorPackage = model<InteriorPackageDocument>('InteriorPackage', interiorPackageSchema);

export default InteriorPackage;