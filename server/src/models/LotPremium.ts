import { Schema, model, type Document } from 'mongoose';

export interface LotPremiumDocument extends Document {
  filing: number;
  lot: number;
  width: number;
  length: number;
  price: number;
}

const lotPremiumSchema = new Schema<LotPremiumDocument>({
  filing: { type: Number, required: true },
  lot: { type: Number, required: true },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  price: { type: Number, required: true },
});

const LotPremium = model<LotPremiumDocument>('LotPremium', lotPremiumSchema);

export default LotPremium;
