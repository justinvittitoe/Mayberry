import { Schema, model, type Document, Types } from 'mongoose';


export interface InteriorOptionDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    brand: string;
    basePrice: number;
    totalCost: number;
    markup: number;
    classification: 'interior'; //enforce interior classification
    material: 'fixture' | 'lvp' | 'carpet' | 'backsplash' | 'masterBathTile' | 'countertop' | 'cabinet' | 'cabinetHardware';
    tier?: 'base' | 'tier-1' | 'tier-2' | 'tier-3';
    cabinetOverlay?: 'standard' | 'full';
    planId?: Types.ObjectId
    img?: string;
    isActive: boolean
    sortOrder?: number
    createdAt?: Date;
    updatedAt?: Date;
}

const interiorOptionSchema = new Schema<InteriorOptionDocument>({
    name: { type: String, required: true},
    brand: {type: String, required: true},
    basePrice: {type: Number, required: true, min: 0},
    totalCost: {type: Number, required: true, min:0, step: 0.1},
    markup: {type: Number, required: true, min: 0, max: 1.0},
    classification: {type: String, required: true, enum: ['interior']},
    material: { type: String, required: true, enum: ['fixture', 'lvp', 'carpet', 'backsplash', 'masterBathTile', 'countertop', 'cabinet', 'cabinetHardware'] },
    tier: { type: String, enum: ['base', 'tier-1', 'tier-2', 'tier-3']},
    cabinetOverlay: {type: String, enum: ['standard', 'full']},
    planId: {type: Types.ObjectId, required: true, ref: 'Plan'},
    img: {type: String, trim: true},
    isActive: {type: Boolean, required: true, default: true},
    sortOrder: {type: Number, default: 1},
}, {timestamps: true, _id: true});

interiorOptionSchema.pre('save', function () {
    if (this.classification !== 'interior') {
        throw new Error('Interior must have classification set to "interior"')
    }
});

//if a cabinet option is saved, but the overlay was not input - auto save as STD overlay
interiorOptionSchema.pre('save', function() {
    if(this.material === 'cabinet' && !this.cabinetOverlay) {
        return this.cabinetOverlay = 'standard'
    }
    return
})
//LVP pre-save base
interiorOptionSchema.pre('save', function () {
    if (this.material === 'lvp' && !this.tier) {
        return this.tier = 'base'
    }
    return
})
//Carpet pre-save base
interiorOptionSchema.pre('save', function () {
    if (this.material === 'carpet' && !this.tier) {
        return this.tier = 'base'
    }
    return
})
//Bathroom Tile pre-save base
interiorOptionSchema.pre('save', function () {
    if (this.material === 'masterBathTile' && !this.tier) {
        return this.tier = 'base'
    }
    return
})

interiorOptionSchema.virtual('clientPrice').get(function() {
    const clientPrice = (this.totalCost * this.markup) - this.basePrice
    return clientPrice
})

interiorOptionSchema.index({ material: 1 });
interiorOptionSchema.index({ material: 1, price: 1 });

const InteriorOption = model<InteriorOptionDocument>('InteriorOption', interiorOptionSchema)

export default InteriorOption;


