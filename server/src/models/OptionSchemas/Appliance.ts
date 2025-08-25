import { Schema, model, type Document} from 'mongoose';

export interface ApplianceDocument extends Document {
    name: string;
    price: number;
    classification: 'appliance';
    type: 'laundry' | 'kitchen';
    description?: string;
    img?: string;
}

const applianceSchema = new Schema<ApplianceDocument>({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    classification: {type: String, required: true, default: 'appliance'},
    type: {type: String, required: true},
    description: String,
    img: {type: String},
});

const Appliance = model<ApplianceDocument>('Appliance', applianceSchema);

export default Appliance;