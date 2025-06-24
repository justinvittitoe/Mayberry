import { Schema } from 'mongoose';

export interface Option {
  name: string;
  price: number;
  classification?: string;
  description?: string;
  img?: string;
}

const optionSchema = new Schema<Option>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  classification: String,
  description: String,
  img: String,
});

export default optionSchema
