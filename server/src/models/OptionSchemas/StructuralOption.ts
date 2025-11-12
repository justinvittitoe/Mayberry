import {Schema, Types, type Document, model} from 'mongoose';

//CORRECT
//Remove the Option Document extension and create a unique model document
export interface StructuralDocument extends Document{
    _id: Types.ObjectId;
    name: string;
    totalCost: number;
    markup: number;
    minMarkup: number;
    clientPrice:number;
    description?: string
    img?: string;
    planId: Types.ObjectId;
    classification: 'structural';
    garage?: number;
    bedrooms?: number;
    bathrooms?: number;
    width?: number;
    length?: number;
    totalSqft?: number;
    resSqft?: number;
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?:Date;
}

//CORRECT
const structuralSchema = new Schema<StructuralDocument>({
    name: { type: String, required: true, trim: true, maxLength: 100 },
    totalCost: { type: Number, required: true, min: 0 },
    clientPrice: { type: Number, required: true, min: 0, default: 0 },
    markup: { type: Number, required: true, min: 0, default: 0.35 },
    minMarkup: { type: Number, required: true, min: 0, default: 200 },
    description: { type: String, maxLength: 500, trim: true },
    img: { type: String, trim: true },
    planId: {type: Schema.Types.ObjectId, ref: 'Plan'},
    garage: { type: Number, min: 2, max: 7, validate: {
        validator: Number.isInteger,
        message: 'Garage count must be an integer'
    } },
    bedrooms: {
        type: Number, min: 0, validate: {
            validator: Number.isInteger,
            message: 'Bedroom count must be an integer'
        }
    },
    bathrooms: { type: Number, min: 0, step: 0.5 }, //Allow for half baths
    width: { type: Number, min: 0 },
    length: { type: Number, min: 0 },
    totalSqft: { type: Number, min: 0 },
    resSqft: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
}, {
    timestamps: true,
    _id: true
});


structuralSchema.pre('save', function() {
    if (!this.totalSqft && this.width && this.length) {
        this.totalSqft = this.width * this.length;
    }
})


structuralSchema.index({bedroom: 1, bathroom: 1});
structuralSchema.index({ totalSqft: 1 });

const StructuralOption = model<StructuralDocument>('Structural', structuralSchema);

export default StructuralOption

