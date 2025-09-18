import { Schema, Types } from 'mongoose';

export interface PlanStructuralOption {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  img?: string;
  garage?: number;
  bedrooms?: number;
  bathrooms?: number;
  width?: number;
  length?: number;
  totalSqft?: number;
  resSqft?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const planStructuralOptionSchema = new Schema<PlanStructuralOption>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    maxLength: 500,
    trim: true
  },
  img: {
    type: String,
    trim: true
  },
  garage: {
    type: Number,
    min: 0,
    max: 6
  },
  bedrooms: {
    type: Number,
    min: 0,
    max: 10
  },
  bathrooms: {
    type: Number,
    min: 0,
    max: 10
  },
  width: {
    type: Number,
    min: 0,
    max: 200
  },
  length: {
    type: Number,
    min: 0,
    max: 200
  },
  totalSqft: {
    type: Number,
    min: 0
  },
  resSqft: {
    type: Number,
    min: 0
  },
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

// Validation: Residential Sqft should be less than or equal to total sqft
planStructuralOptionSchema.pre('save', function() {
  if (this.resSqft && this.totalSqft && this.resSqft > this.totalSqft) {
    throw new Error('Residential square footage cannot be greater than total square footage');
  }
});

// Add index for sorting
planStructuralOptionSchema.index({ sortOrder: 1, name: 1 });