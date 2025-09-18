import { Schema, Types } from 'mongoose';

export interface PlanElevationOption {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  img?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const planElevationOptionSchema = new Schema<PlanElevationOption>({
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
  _id: true // Ensure each elevation option has its own unique ID
});

// Add index for sorting
planElevationOptionSchema.index({ sortOrder: 1, name: 1 });