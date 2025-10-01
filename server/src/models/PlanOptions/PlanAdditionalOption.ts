import { Schema, Types } from 'mongoose';

export interface PlanAdditionalOption {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  img?: string;
  category?: string;  // e.g., "HVAC", "Electrical", "Plumbing", "Flooring", "Smart Home"
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const planAdditionalOptionSchema = new Schema<PlanAdditionalOption>({
  name: {type: String, required: true, trim: true, maxLength: 100},
  price: {type: Number, required: true, min: 0},
  description: {type: String, maxLength: 500, trim: true},
  img: {type: String, trim: true},
  category: {type: String, trim: true, maxLength: 50, 
    enum: ['HVAC', 'Electrical', 'Plumbing', 'Flooring', 'Smart Home', 'Security', 'Outdoor', 'Other']},
  isActive: {type: Boolean, default: true},
  sortOrder: {type: Number, default: 0}
}, {
  timestamps: true,
  _id: true
});

// Add indexes for sorting and category filtering
planAdditionalOptionSchema.index({ category: 1, sortOrder: 1, name: 1 });
planAdditionalOptionSchema.index({ sortOrder: 1, name: 1 });