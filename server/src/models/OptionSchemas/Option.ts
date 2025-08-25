import { Schema, model, type Document } from 'mongoose';

export interface OptionDocument extends Document {
  name: string;
  price: number;
  classification: 'elevation' | 'colorScheme' | 'interior' | 'structural' | 'additional' | 'lot';
  planType: number;
  description?: string;
  img?: string;
}

const optionSchema = new Schema<OptionDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0},
  classification: { type: String, required: true, enum: ['elevation', 'colorScheme', 'interior', 'structural', 'additional', 'lot']},
  planType: {type: Number, required: true},
  description: String,
  img: {type: String},
});

// Add indexes for better query performance
optionSchema.index({ classification: 1, name: 1 });
optionSchema.index({ price: 1 });
optionSchema.index({ classification: 1, price: 1 });

const Option = model<OptionDocument>('Option', optionSchema);

export default Option;
