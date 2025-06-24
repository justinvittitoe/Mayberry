import { Schema } from 'mongoose';

export interface LotPremium {
  filing: number;
  lot: number;
  width: number;
  length: number;
  price: number;
}

const lotPremiumSchema = new Schema<LotPremium>({
  filing: { type: Number, required: true },
  lot: { type: Number, required: true },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  price: { type: Number, required: true },
});

export default lotPremiumSchema;
