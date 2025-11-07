import { Schema, Types, model, type Document} from 'mongoose';

export interface ApplianceDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    baseCost: number;
    totalCost: number;
    markup: number;
    minMarkup: number;
    clientPrice: number;
    classification: 'appliance';
    type: 'laundry' | 'kitchen';
    brand?: string,
    img?: string;
    planId: Types.ObjectId;
    isActive: boolean;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const applianceSchema = new Schema<ApplianceDocument>({
    name: {type: String, required: true},
    baseCost: {type: Number, required: true},
    totalCost: {type: Number, required: true},
    markup: {type: Number, required: true, default: 0.35},
    minMarkup: {type: Number, required: true, default: 200},
    clientPrice: {type: Number, required: true, min: 0, default: 0},
    classification: {type: String, required: true, default: 'appliance', enum: ['appliance']},
    type: {type: String, required: true, enum: ['kitchen', 'laundry']},
    img: {type: String},
    planId: {type: Schema.Types.ObjectId, required: true, ref: 'Plan'},
    isActive: {type: Boolean, default: true},
    sortOrder: {type: Number, default: 0},
}, {timestamps: true, _id: true});


const Appliance = model<ApplianceDocument>('Appliance', applianceSchema);

applianceSchema.index({ type: 1, sortOrder: 1, name: 1 });
applianceSchema.index({ brand: 1, type: 1 });

export default Appliance;