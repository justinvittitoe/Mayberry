import { Schema, model, type Document, Types } from 'mongoose';



export interface InteriorPackageDocument extends Document {
  name: string;
  planType?: number;
  totalPrice?: number;
  clientPrice?: number;
  //markup?: number;
  fixtures: Types.ObjectId[];
  lvp: Types.ObjectId[];
  carpet: Types.ObjectId[];
  backsplash: Types.ObjectId[];
  masterBathTile: Types.ObjectId[];
  countertop: Types.ObjectId[];
  primaryCabinets: Types.ObjectId[];
  secondaryCabinets: Types.ObjectId[];
  upgrade: boolean;
  basePackage: boolean;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const interiorPackageSchema = new Schema<InteriorPackageDocument>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  planType: {type: Number},
  totalPrice: { type: Number, min: 0, default: 0 },
  clientPrice: { type: Number, min: 0, default: 0},
  // markup: { type: Number, min: 1, default: 1.2, validate: {
  //   validator: function(v:number) { return v >= 1; },
  //   message: 'Markup must be 1 or greater(1 = no markup, 1.2 = 20% markup)'
  // }}
  fixtures: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption'}],
  lvp: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption' }],
  carpet: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption' }],
  backsplash: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption' }],
  masterBathTile: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption' }],
  countertop: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption' }],
  primaryCabinets: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption' }],
  secondaryCabinets: [{ type: Schema.Types.ObjectId, ref: 'InteriorOption' }],
  upgrade: { type: Boolean, default: false },
  basePackage: { type: Boolean, default: false},
  isActive: {type: Boolean, default: true}
}, { timestamps: true});

//Calculate the total price of the package
interiorPackageSchema.pre('save', function() {

})
//note a mutation will need to be made to find the add to pricing for the interior price
//this means total price is not a client facing value and only client price should be sent to the client
//Where does total price and client price need to be calculated so that it does not affect the efficiency of any query/mutation

const InteriorPackage = model<InteriorPackageDocument>('InteriorPackage', interiorPackageSchema);

export default InteriorPackage;