import { Schema, model, type Document } from 'mongoose';
import type { OptionDocument } from './OptionSchemas/Option.js';
import type { InteriorPackageDocument } from './OptionSchemas/InteriorPackage.js';
import type { LotPremiumDocument } from './OptionSchemas/LotPremium.js';
import type { ColorSchemeDocument } from './OptionSchemas/ColorScheme.js';
import type { ApplianceDocument } from './OptionSchemas/Appliance.js';
import { kMaxLength } from 'buffer';

export interface PlanTypeDocument extends Document {
  planType: number; //Unique plan identifier
  name: string; //Plan name (e.g. Beacon)
  bedrooms: number; //Number of bedrooms
  bathrooms: number; //Number of bedrooms
  totalSqft: number; //Total square footage
  resSqft: number; //Total residential square feet
  garage: number; //The number of car garage the floor plan fits
  basePrice: number; //starting price for this floorplan
  description?: string; //Plan description
  //Available options for this plan type (catalogs of choices)
  elevations: OptionDocument[]; //Avalable exterior elevations
  colorScheme: ColorSchemeDocument[]; //Available color schemes
  interiors: InteriorPackageDocument[]; //Avaailable interior packages
  structural: OptionDocument[]; //Available structual modifications
  additional: OptionDocument[]; //Available additional upgrades (e.g. Air Conditioning)
  kitchenAppliance: ApplianceDocument[]; //Available kitchen appliance package
  laundryAppliance: ApplianceDocument[]; //Available laundry appliance package
  lotPremium: LotPremiumDocument[]; //Available lot premium option
  width: number; //Plan width in feet
  length: number; //Plan depth/length in feet
}

const planTypeSchema = new Schema({
  planType: { type: Number, required: true, unique: true, min: 0},
  name: { type: String, required: true, trim: true, maxLength: 100 },
  bedrooms: { type: Number, required: true, min: 3, validate:{
    validator: Number.isInteger,
    message: 'Bedrooms must be an integer'
  } },
  bathrooms: { type: Number, required: true, min: 2, step: 0.5 }, //Allow half baths
  totalSqft: { type: Number, required: true, min: 500 },
  resSqft: { type: Number, required: true, min: 400 },
  garage: { type: Number, required: true, enum: [2,3,4,5,6], default: 2 },
  basePrice: { type: Number, required: true, min: 0 },
  description: { type: String, maxLength: 500 },
  elevations: [{ type: Schema.Types.ObjectId, ref: 'Option'}],
  colorScheme: [{ type: Schema.Types.ObjectId, ref: 'ColorScheme' }],
  interiors: [{ type: Schema.Types.ObjectId, ref: 'InteriorPackage'}],
  structural: [{ type: Schema.Types.ObjectId, ref: 'Structural'}],
  additional: [{ type: Schema.Types.ObjectId, ref: 'Option'}],
  kitchenAppliance: [{ type: Schema.Types.ObjectId, ref: 'Appliance'}],
  laundryAppliance: [{ type: Schema.Types.ObjectId, ref: 'Appliance'}],
  lotPremium: [{ type: Schema.Types.ObjectId, ref: 'LotPremium' }],
  width: { type: Number, required: true, min: 10, max: 120 },
  length: { type: Number, required: true, min: 10, max: 120 }
}, {timestamps: true});

//Validation: Residential Sqft should be less than or equal to total sqft
planTypeSchema.pre('save', function() {
  if (this.resSqft > this.totalSqft) {
    throw new Error('Residential squarefootage cannot be greater than the total squarefootage')
  }
});

//Virtual to calculate garage squarefootage (estimated)
planTypeSchema.virtual('garageSqft').get(function() {
  return this.totalSqft - this.resSqft;
});

//Virtual to calculate price per sqft
planTypeSchema.virtual('pricePerSqft').get(function() {
  return Math.round((this.basePrice / this.totalSqft) * 100) / 100;
})

// Add indexes for better query performance
planTypeSchema.index({ planType: 1 });
planTypeSchema.index({ basePrice: 1 });
planTypeSchema.index({ bedrooms: 1, bathrooms: 1 });
planTypeSchema.index({ squareFootage: 1 });
planTypeSchema.index({ width: 1, length: 1 });
planTypeSchema.index({ name: 1 })
planTypeSchema.index({ garage: 1 })

// Method to get all available options count
planTypeSchema.methods.getOptionCounts = function () {
  return {
    elevations: this.elevations.length,
    colorSchemes: this.colorScheme.length,
    interiors: this.interiors.length,
    structural: this.structural.length,
    additional: this.additional.length,
    kitchenAppliances: this.kitchenAppliance.length,
    laundryAppliances: this.laundryAppliance.length,
    lotPremiums: this.lotPremium.length
  };
};

const Plan = model<PlanTypeDocument>('Plan', planTypeSchema);

export default Plan;

