import { Schema, Types, model, type Document } from 'mongoose';


export interface ColorSchemeDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  planId: Types.ObjectId;
  description?: string;
  price: number;
  primaryName: string;
  primaryCode: string;    // Main siding
  secondaryName?: string;  // Secondary Siding
  secondaryCode?: string;
  trimName: string;       // Trim color
  trimCode: string;
  doorName: string;
  doorCode: string;
  shingleBrand: string;       // Roof color
  shingleColor: string;
  stone?: boolean;      // Stone color
  stoneColor?: string;
  colorSchemeImg?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const colorSchemeSchema = new Schema<ColorSchemeDocument>({
  name: { type: String, required: true },
  planId: { type: Schema.Types.ObjectId, required: true, ref: 'Plan'},
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  primaryName: {type: String, required: true, maxlength: 200, trim: true},
  primaryCode: {type: String, required: true, maxlength: 200, trim: true},   
  secondaryName: {type: String, maxlength: 200, trim: true},
  secondaryCode: {type: String, maxlength: 200, trim: true},
  trimName: {type: String, required: true, maxlength: 200, trim: true},
  trimCode: {type: String, required: true, maxlength: 200, trim: true},
  doorName: { type: String, required: true, maxlength: 200, trim: true },
  doorCode: { type: String, required: true, maxlength: 200, trim: true },
  shingleBrand: {type: String, required: true, maxlength: 200, trim: true},
  shingleColor: {type: String, required: true, maxlength: 200, trim: true},
  stone: {type: Boolean, default: false},
  stoneColor: {type: String, maxlength: 200, trim: true},
  colorSchemeImg: {type: String, trim: true},
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { 
  timestamps: true, _id: true 
});

// Index for efficient querying
colorSchemeSchema.index({ isActive: 1, sortOrder: 1 });
colorSchemeSchema.index({ name: 1 });

const ColorScheme = model<ColorSchemeDocument>('ColorScheme', colorSchemeSchema);

export default ColorScheme;