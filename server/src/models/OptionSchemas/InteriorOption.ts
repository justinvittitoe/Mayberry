import { Schema, model, type Document, Types } from 'mongoose';
import { Material, Tier, CabinetOverlay } from '../../types/graphql';
//CORRECT
export interface InteriorOptionDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    brand: string;
    color?: string;
    cost: number;
    markup: number;
    minMarkup: number;
    clientPrice: number;
    material: Material;
    tier?: Tier;
    cabinetOverlay?: CabinetOverlay;
    softClosePrice?: number;
    planId: Types.ObjectId
    img?: string;
    isActive: boolean
    sortOrder?: number
    createdAt?: Date;
    updatedAt?: Date;
}

//CORRECT
const interiorOptionSchema = new Schema<InteriorOptionDocument>({
    name: { type: String, required: true},
    brand: {type: String, required: true},
    color: { type: String, trim: true, required: true },
    cost: {type: Number, required: true, min: 0},
    markup: {type: Number, required: true, min: 0, max: 1.0, default: 0.35},
    minMarkup: { type: Number, required: true, min: 0, default: 200 },
    clientPrice: {type: Number, required: true, min:0, default: 0},
    material: { type: String, required: true, enum: ['fixture', 'lvp', 'carpet', 'backsplash', 'masterBathTile', 'countertop', 'cabinet', 'cabinetHardware'] },
    tier: { type: String, enum: ['base', 'tier-1', 'tier-2', 'tier-3'] },
    cabinetOverlay: {type: String, enum: ['standard', 'full']},
    softClosePrice: { type: Number, min: 0, default: 0},
    planId: {type: Schema.Types.ObjectId, required: true, ref: 'Plan'},
    img: {type: String, trim: true},
    isActive: {type: Boolean, required: true, default: true},
    sortOrder: {type: Number, default: 1},
}, {timestamps: true, _id: true});

// Pre-save hook to calculate clientPrice
interiorOptionSchema.pre('save', function () {
    if (this.isModified('cost') || this.isModified('markup') || this.isModified('minMarkup')) {
        const markupAmount = Math.max(this.cost * this.markup, this.minMarkup);
        this.clientPrice = this.cost + markupAmount;
    }
});

//if a cabinet option is saved, but the overlay was not input error handling
interiorOptionSchema.pre('save', function() {
    if(this.material === 'cabinet' && !this.cabinetOverlay) {
        throw new Error('Cabinet option must include cabinetOverlay"')
    }
})

// Auto-assign tier for certain materials
interiorOptionSchema.pre('save', function () {
    if (['lvp', 'carpet', 'masterBathTile'].includes(this.material) && !this.tier) {
        this.tier = 'base';
    }
});

//Calculate Client Price
interiorOptionSchema.pre('save', function () {
    if (this.cost == null && this.markup == null && this.minMarkup == null) {
        throw Error('cost, markup, and/or minMarkup are required')
    } 
    const markupPrice = this.cost * this.markup;
    this.clientPrice = markupPrice > this.minMarkup ? 
    this.cost + markupPrice : 
    this.cost + this.minMarkup
});


interiorOptionSchema.index({ material: 1 });
interiorOptionSchema.index({ planId: 1, material: 1 });
interiorOptionSchema.index({ material: 1, cost: 1 });

const InteriorOption = model<InteriorOptionDocument>('InteriorOption', interiorOptionSchema)

export default InteriorOption;


