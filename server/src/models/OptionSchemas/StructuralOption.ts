import {Schema, Types, type Document} from 'mongoose';
import Option from './Option.js';

//Remove the Option Document extension and create a unique model document
export interface StructuralDocument extends Document{
    _id: Types.ObjectId;
    name: string;
    price: number;
    description?: string
    img?: string;
    classification: 'structural';
    garage?: number;
    bedrooms?: number;
    bathrooms?: number;
    width: number;
    length: number;
    totalSqft?: number;
    resSqft?: number;
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    udatedAt?:Date;
}

const structuralSchema = new Schema<StructuralDocument>({
    name: { type: String, required: true, trim: true, maxLength: 100 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, maxLength: 500, trim: true },
    img: { type: String, trim: true },
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
    width: { type: Number, required: true, min: 0 },
    length: { type: Number, required: true, min: 0 },
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

const StructuralOption = Option.discriminator<StructuralDocument>('Structural', structuralSchema);

export default StructuralOption

