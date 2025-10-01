import { Schema, model, type Document, Types } from 'mongoose';


export interface InteriorOptionDocument extends Document {
    _id?: Types.ObjectId;
    name: string;
    brand: string;
    base: number;
    totalCost: number;
    clientPrice: number;
    markup: number;
    classification: 'interior'; //enforce interior classification
    material: 'fixture' | 'lvp' | 'carpet' | 'backsplash' | 'masterBathTile' | 'countertop' | 'cabinet';
    planType?: Types.ObjectId
    img: string;
    isActive: boolean
    sortOrder?: number
    createdAt?: Date;
    updatedAt?: Date;
}

const interiorOptionSchema = new Schema<InteriorOptionDocument>({
    material: { type: String, required: true, enum: ['fixture', 'lvp', 'carpet', 'backsplash', 'masterBathTile', 'countertop', 'cabinet'] }
})

interiorOptionSchema.pre('save', function () {
    if (this.classification !== 'interior') {
        throw new Error('Interior must have classification set to "interior"')
    }
});

interiorOptionSchema.index({ material: 1 });
interiorOptionSchema.index({ material: 1, price: 1 });

const InteriorOption = model<InteriorOptionDocument>('InteriorOption', interiorOptionSchema)

export default InteriorOption;


