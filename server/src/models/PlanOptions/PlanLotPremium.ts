import { Schema, Types } from 'mongoose';

export interface PlanLotPremium {
  _id?: Types.ObjectId;
  filing: number;
  lot: number;
  width: number;
  length: number;
  lotSqft: number;
  premium: number;  // Premium price for this lot
  address: string;
  parcelNumber: string;
  description?: string;
  features?: string[];  // e.g., ["Corner Lot", "Cul-de-sac", "Pond View", "Wooded"]
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const planLotPremiumSchema = new Schema<PlanLotPremium>({
  filing: {
    type: Number,
    required: true,
    min: 1
  },
  lot: {
    type: Number,
    required: true,
    min: 1
  },
  width: {
    type: Number,
    required: true,
    min: 10,
    max: 500
  },
  length: {
    type: Number,
    required: true,
    min: 10,
    max: 500
  },
  lotSqft: {
    type: Number,
    required: true,
    min: 1000
  },
  premium: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  parcelNumber: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  description: {
    type: String,
    maxLength: 500,
    trim: true
  },
  features: [{
    type: String,
    trim: true,
    maxLength: 100
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  _id: true
});

// Virtual for lot area calculation verification
planLotPremiumSchema.virtual('calculatedSqft').get(function() {
  return this.width * this.length;
});

// Pre-save validation to ensure lotSqft matches calculated area
planLotPremiumSchema.pre('save', function() {
  const calculatedArea = this.width * this.length;
  if (Math.abs(this.lotSqft - calculatedArea) > 100) { // Allow 100 sqft tolerance for irregular lots
    console.warn(`Lot ${this.filing}-${this.lot}: lotSqft (${this.lotSqft}) doesn't match calculated area (${calculatedArea})`);
  }
});

// Add indexes for lot identification and sorting
planLotPremiumSchema.index({ filing: 1, lot: 1 }, { unique: false }); // Not unique since multiple plans can reference same lot
planLotPremiumSchema.index({ width: 1, length: 1 }); // For compatibility queries
planLotPremiumSchema.index({ sortOrder: 1, filing: 1, lot: 1 });