import {Schema} from 'mongoose';
import { OptionDocument } from './Option.js';
import Option from './Option.js';

export interface StructuralDocument extends OptionDocument {
    classification: 'structural';
    garage?: number;
    bedrooms?: number;
    bathrooms?: number;
    width: number;
    length: number;
    totalSqft?: number;
    resSqft?: number;
}



const structuralSchema = new Schema<StructuralDocument>({
    garage: {type: Number, min: 0, validate: {
        validator: Number.isInteger,
        message: 'Garage count must be an integer'
    }},
    bedrooms: {type: Number, min: 0, validate: {
            validator: Number.isInteger,
            message: 'Bedroom count must be an integer'
        }
    },
    bathrooms: { type: Number, min:0, step: 0.5}, //allow for half baths
    width: { type: Number, required: true, min: 0 },
    length: { type: Number, required: true, min: 0 },
    totalSqft: { type: Number, min: 0 },
    resSqft: { type: Number, min: 0 },
})

structuralSchema.pre('save', function() {
    if (!this.totalSqft && this.width && this.length) {
        this.totalSqft = this.width * this.length;
    }
})

structuralSchema.index({bedroom: 1, bathroom: 1});
structuralSchema.index({ totalSqft: 1 });

const Structural = Option.discriminator<StructuralDocument>('Structural', structuralSchema);

export default Structural

