import { Schema, Types, model, type Document } from 'mongoose';

export interface LotPremiumDocument extends Document {
  _id: Types.ObjectId;
  filing: number;
  lot: number;
  width: number;
  length: number;
  lotSqft: number;
  premium: number;
  address: string;
  parcelNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lotPremiumSchema = new Schema<LotPremiumDocument>({
  filing: { type: Number, required: true },
  lot: { type: Number, required: true },
  width: { type: Number, required: true, min: 0 },
  length: { type: Number, required: true, min: 0 },
  lotSqft: {type: Number, required: true, min: 0},
  premium: { type: Number, required: true },
  address: {type: String, required: true},
  parcelNumber: {type: String, required: true},
  isActive: {type: Boolean, default: true}
}, {timestamps: true, _id: true});

//calaculate the total lot sqft footage prior to save
lotPremiumSchema.pre('save', function() {
  if (!this.lotSqft && this.width && this.length) {
    this.lotSqft = this.width * this.length
  }
})

// Add indexes for better query performance
lotPremiumSchema.index({ filing: 1, lot: 1 });
lotPremiumSchema.index({ width: 1, length: 1 });
lotPremiumSchema.index({ price: 1 });

const LotPremium = model<LotPremiumDocument>('LotPremium', lotPremiumSchema);

export default LotPremium;
