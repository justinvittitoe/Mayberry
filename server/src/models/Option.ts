import { Schema, model, type Document } from 'mongoose';

export interface OptionDocument extends Document {
  name: string;
  price: number;
  classification?: string;
  description?: string;
  img?: string;
  width?: number;
  length?: number;
}

const optionSchema = new Schema<OptionDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  classification: String,
  description: String,
  img: String,
  width: Number,
  length: Number,
});

const Option = model<OptionDocument>('Option', optionSchema);

export default Option;
