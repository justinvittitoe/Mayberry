import { Schema, Types } from 'mongoose';

export interface PlanInteriorOption {
  _id?: Types.ObjectId;
  name: string;
  totalPrice: number;
  clientPrice?: number;
  description?: string;
  img?: string;
  // Interior package contents (simplified for plan-specific use)
  fixtures: string[];          // Array of fixture names/descriptions
  lvp: string[];              // Luxury Vinyl Plank options
  carpet: string[];           // Carpet options
  backsplash: string[];       // Backsplash options
  masterBathTile: string[];   // Master bath tile options
  countertop: string[];       // Countertop options
  primaryCabinets: string[];  // Primary cabinet options
  secondaryCabinets: string[]; // Secondary cabinet options
  upgrade: boolean;
  basePackage: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const planInteriorOptionSchema = new Schema<PlanInteriorOption>({
  name: {type: String, required: true, trim: true, maxLength: 100},
  totalPrice: {type: Number, required: true, min: 0},
  clientPrice: {type: Number, min: 0},
  description: {type: String,maxLength: 500,trim: true},
  img: {type: String, trim: true},
  fixtures: [{type: String, trim: true, maxLength: 200}],
  lvp: [{type: String, trim: true, maxLength: 200}],
  carpet: [{type: String, trim: true, maxLength: 200}],
  backsplash: [{type: String, trim: true, maxLength: 200}],
  masterBathTile: [{type: String, trim: true, maxLength: 200}],
  countertop: [{type: String, trim: true, maxLength: 200}],
  primaryCabinets: [{type: String, trim: true, maxLength: 200}],
  secondaryCabinets: [{type: String, trim: true, maxLength: 200}],
  upgrade: {type: Boolean, default: false},
  basePackage: {type: Boolean, default: false},
  isActive: {type: Boolean, default: true},
  sortOrder: {type: Number, default: 0}
}, {
  timestamps: true,
  _id: true
});

// Add index for sorting and base package queries
planInteriorOptionSchema.index({ sortOrder: 1, name: 1 });
planInteriorOptionSchema.index({ basePackage: 1, upgrade: 1 });