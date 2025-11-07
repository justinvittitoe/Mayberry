import { Schema, Types, model, type Document } from 'mongoose';

export interface LotDocument extends Document {
  _id: Types.ObjectId;
  filing: number;
  lot: number;
  width: number;
  length: number;
  lotSqft: number;
  streetNumber: string;
  streetName: string;
  garageDir: "left" | "right";
  parcelNumber: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lotSchema = new Schema<LotDocument>({
  filing: { type: Number, required: true },
  lot: { type: Number, required: true },
  width: { type: Number, required: true, min: 0 },
  length: { type: Number, required: true, min: 0 },
  lotSqft: {type: Number, required: true, min: 0},
  streetNumber: {type: String, required: true},
  streetName: { type: String, required: true },
  garageDir: { type: String, required: true, enum: ["left", "right"]},
  parcelNumber: {type: String, required: true},
  notes: { type: String, maxlength: 500, trim: true},
  isActive: {type: Boolean, default: true},
}, {timestamps: true, _id: true});

//calaculate the total lot sqft footage prior to save
lotSchema.pre('save', function() {
  if (!this.lotSqft && this.width && this.length) {
    this.lotSqft = this.width * this.length
  }
})

// Add indexes for better query performance
lotSchema.index({ filing: 1, lot: 1 });
lotSchema.index({ width: 1, length: 1 });
lotSchema.index({ price: 1 });

const LotPremium = model<LotDocument>('Lot', lotSchema);

export default LotPremium;
