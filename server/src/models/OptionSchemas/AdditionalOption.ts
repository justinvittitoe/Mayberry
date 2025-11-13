import { Schema, model, type Document, Types } from 'mongoose';

export interface AdditionalOptionDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  totalCost: number;
  clientPrice: number;
  markup: number;
  minMarkup: number;
  description?: string;
  img?: string;
  planId: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const additionalOptionSchema = new Schema<AdditionalOptionDocument>({
  name: {type: String, required: true, trim: true, maxLength: 100},
  totalCost: {type: Number, required: true, min: 0},
  clientPrice: {type: Number, required: true, min: 0, default: 0},
  markup: {type: Number, required: true, min:0, max: 1, default: 0.35},
  minMarkup: {type: Number, required: true, min: 0, default: 200},
  description: {type: String, maxLength: 500, trim: true},
  img: {type: String, trim: true},
  planId: {type: Schema.Types.ObjectId, required: true, ref: 'Plan'},
  isActive: {type: Boolean, default: true},
  sortOrder: {type: Number, default: 0}
}, {
  timestamps: true,
  _id: true
});

additionalOptionSchema.pre('save', function () {
  if (this.totalCost == null && this.markup == null && this.minMarkup == null) {
    throw Error('cost, markup, and/or minMarkup are required')
  }
  const markupPrice = this.totalCost * this.markup;
  this.clientPrice = markupPrice > this.minMarkup ?
    this.totalCost + markupPrice :
    this.totalCost + this.minMarkup
});

// Add indexes for sorting and category filtering
additionalOptionSchema.index({ category: 1, sortOrder: 1, name: 1 });
additionalOptionSchema.index({ sortOrder: 1, name: 1 });

const AdditionalOption = model<AdditionalOptionDocument>('Additional', additionalOptionSchema)

export default AdditionalOption