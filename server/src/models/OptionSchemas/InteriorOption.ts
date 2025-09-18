import { Schema} from 'mongoose';
import { OptionDocument } from './Option';
import Option from './Option.js';

export interface InteriorOptionDocument extends OptionDocument {
    classification: 'interior'; //enforce interior classification
    material: 'fixture' | 'lvp' | 'carpet' | 'backsplash' | 'masterBathTile' | 'countertop' | 'cabinet';
}

const interiorOptionSchema = new Schema<InteriorOptionDocument>({
    material: { type: String, required: true, enum: ['fixture', 'lvp', 'carpet', 'backsplash', 'masterBathTile', 'countertop', 'cabinet']}
})

interiorOptionSchema.pre('save', function() {
    if (this.classification !== 'interior') {
        throw new Error('Interior must have classification set to "interior"')
    }
});

interiorOptionSchema.index({material: 1});
interiorOptionSchema.index({ material: 1, price: 1});

const InteriorOption = Option.discriminator<InteriorOptionDocument>('InteriorOption', interiorOptionSchema)

export default InteriorOption;