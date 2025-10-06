import { Schema, model, type Document, Types } from 'mongoose';

export interface ElevationOptionDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  totalCost: number;
  clientPrice: number; //Client price = totalcost * 1+markup
  markup: number; //minimum percentage markup
  minMarkup: number; // Cash minimum markup
  description?: string;
  img?: string;
  planId: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ElevationOptionSchema = new Schema<ElevationOptionDocument>({
  name: {type: String, required: true, trim: true, maxLength: 100},
  totalCost: {type: Number, required: true, min: 0},
  clientPrice: {type: Number, required: true, min: 0},
  markup: {type: Number, required: true, min:0},
  minMarkup: {type: Number, required: true, min:0},
  description: {type: String, maxLength: 500, trim: true},
  img: {type: String, trim: true},
  planId: [{type: Types.ObjectId, ref: 'Plan'}],
  isActive: {type: Boolean, default: true},
  sortOrder: {type: Number, default: 0}
}, {
  timestamps: true,
  _id: true // Ensure each elevation option has its own unique ID
});

//Pre-save calculate the client price based on a comparison between the markup percentage or min cash markup
ElevationOptionSchema.pre('save', function() {
  if (!this.totalCost && !this.markup && ! this.minMarkup) {
    throw Error('Missing total cost, markup, and/or minMarkup')
  } else if((this.totalCost*this.markup) > this.minMarkup) {
    this.clientPrice = this.totalCost * (1 + this.markup)
  } else {
    this.clientPrice = this.totalCost + this.minMarkup
  }
});

// Add index for sorting
ElevationOptionSchema.index({ sortOrder: 1, name: 1 });

const ElevationOption = model<ElevationOptionDocument>('Elevation', ElevationOptionSchema)

export default ElevationOption