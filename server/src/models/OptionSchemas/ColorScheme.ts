import { Schema, model, type Document } from 'mongoose';

export interface ColorValues {
  primary: string;    // Main siding
  secondary: string;  // Secondary Siding
  roof: string;       // Roof color
  accent: string;     // Trim color
  stone?: string;      // Stone color
  foundation?: string; // Foundation color (optional)
}

export interface ColorSchemeDocument extends Document {
  name: string;
  description?: string;
  price: number;
  colorValues: ColorValues;
  isActive: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const colorValuesSchema = new Schema<ColorValues>({
  primary: { type: String, required: true },
  secondary: { type: String, required: true },
  roof: { type: String, required: true },
  accent: { type: String, required: true },
  stone: { type: String, required: false },
  foundation: { type: String }
}, { _id: false });

const colorSchemeSchema = new Schema<ColorSchemeDocument>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  colorValues: { type: colorValuesSchema, required: true },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

// Index for efficient querying
colorSchemeSchema.index({ isActive: 1, sortOrder: 1 });
colorSchemeSchema.index({ name: 1 });

const ColorScheme = model<ColorSchemeDocument>('ColorScheme', colorSchemeSchema);

export default ColorScheme;