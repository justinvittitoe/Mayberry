import { Schema, Types, model, type Document} from 'mongoose';

export interface ApplianceDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    baseCost: number;
    packageCost: number;
    markup: number;
    classification: 'appliance';
    type: 'laundry' | 'kitchen';
    brand?: string,
    img?: string;
    planType?: Types.ObjectId;
    isActive: boolean;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const applianceSchema = new Schema<ApplianceDocument>({
    name: {type: String, required: true},
    baseCost: {type: Number, required: true},
    packageCost: {type: Number, required: true},
    markup: {type: Number, required: true, default: 0.35},
    classification: {type: String, required: true, default: 'appliance'},
    type: {type: String, required: true, default: 'kitchen'},
    img: {type: String},
    planType: {type: Types.ObjectId, ref: 'Plan'},
    isActive: {type: Boolean, default: true},
    sortOrder: {type: Number, default: 0},
}, {timestamps: true, _id: true});

applianceSchema.virtual('clientPrice').get(function() {
    return (this.baseCost - this.packageCost) * (1+this.markup)
})

const Appliance = model<ApplianceDocument>('Appliance', applianceSchema);

applianceSchema.index({ type: 1, sortOrder: 1, name: 1 });
applianceSchema.index({ brand: 1, type: 1 });

export default Appliance;