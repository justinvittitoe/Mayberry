import { Schema, Types } from 'mongoose';

export interface PlanApplianceOption {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  type: 'kitchen' | 'laundry';
  description?: string;
  img?: string;
  brand?: string;
  model?: string;
  appliances: string[];  // List of appliances included (e.g., "Refrigerator", "Dishwasher", "Range")
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const planApplianceOptionSchema = new Schema<PlanApplianceOption>({
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
  type: {
    type: String,
    required: true,
    enum: ['kitchen', 'laundry']
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
  brand: {
    type: String,
    trim: true,
    maxLength: 100
  },
  model: {
    type: String,
    trim: true,
    maxLength: 100
  },
  appliances: [{
    type: String,
    required: true,
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

// Add indexes for sorting and type filtering
planApplianceOptionSchema.index({ type: 1, sortOrder: 1, name: 1 });
planApplianceOptionSchema.index({ brand: 1, type: 1 });