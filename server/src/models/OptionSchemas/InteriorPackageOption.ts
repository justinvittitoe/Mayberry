import { Schema, model, type Document, Types } from 'mongoose';

export interface InteriorPackageDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  baseCost: number; //Base package price specific to plantype = sum of option base prices
  totalCost: number; //sum of the costs for each interior option = sum of option costs
  markup: number; //mark-up for package -> admin sets this
  minMarkup: number;
  clientPrice: number; //Price client pays for interior package specific to a plan -> when pkg is created -> resolver sums client prices of options
  description?: string; //input for customer/or admin describing the interior
  img?: string; //interior package img
  //Plan ID refrence
  planId: Types.ObjectId;
  // Interior package contents (simplified for plan-specific use)
  fixtures?: Types.ObjectId[];          // Array of fixture ID's includes sink fixtures and light fixtures
  lvp?: Types.ObjectId;              // Luxury Vinyl Plank option
  carpet?: Types.ObjectId;           // Carpet option
  backsplash?: Types.ObjectId;       // Backsplash option
  masterBathTile?: Types.ObjectId;   // Master bath tile option
  secondaryBathTile?: Types.ObjectId;
  countertop?: Types.ObjectId;       // Countertop option
  primaryCabinets?: Types.ObjectId;  // Primary cabinet option
  secondaryCabinets?: Types.ObjectId; // Secondary cabinet option
  cabinetHardware?: Types.ObjectId;
  softClose: boolean;
  basePackage: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const interiorPackageSchema = new Schema<InteriorPackageDocument>({
  name: {type: String, required: true, trim: true, maxLength: 100},
  baseCost: {type: Number, required: true},
  totalCost: {type: Number, required: true},
  markup: {type: Number, required: true, default: 0.35},
  minMarkup: {type: Number, required: true, default: 200},
  clientPrice: {type: Number, required: true, min:0, default: 0},
  description: {type: String,maxLength: 500,trim: true},
  img: {type: String, trim: true},
  planId: {type: Schema.Types.ObjectId, required: true, ref: 'Plan'},
  fixtures: [{type: Types.ObjectId, ref: 'InteriorOption'}],
  lvp: { type: Types.ObjectId, ref: 'InteriorOption' },
  carpet: { type: Types.ObjectId, ref: 'InteriorOption' },
  backsplash: { type: Types.ObjectId, ref: 'InteriorOption' },
  masterBathTile: { type: Types.ObjectId, ref: 'InteriorOption' },
  countertop: { type: Types.ObjectId, ref: 'InteriorOption' },
  primaryCabinets: { type: Types.ObjectId, ref: 'InteriorOption' },
  secondaryCabinets: { type: Types.ObjectId, ref: 'InteriorOption' },
  cabinetHardware: { type: Types.ObjectId, ref: 'InteriorOption'},
  softClose: {type: Boolean, default: false},
  basePackage: {type: Boolean, default: false},
  isActive: {type: Boolean, default: true},
  sortOrder: {type: Number, default: 0}
}, {
  timestamps: true,
  _id: true
});

//Virtual


// Add index for sorting and base package queries
interiorPackageSchema.index({ sortOrder: 1, name: 1 });
interiorPackageSchema.index({ basePackage: 1, upgrade: 1 });

const InteriorPackage = model<InteriorPackageDocument>('InteriorPackage', interiorPackageSchema)

export default InteriorPackage