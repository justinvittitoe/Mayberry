import { Schema, type Document, Types, model } from 'mongoose';


// Main user home selection schema
export interface UserHomeSelection extends Document {
    userId: Types.ObjectId;
    plan: Types.ObjectId;
    configurationName: string; //User can make their own name
    //Required single selections
    elevation: Types.ObjectId;
    colorScheme: Types.ObjectId;
    interiorPackage: Types.ObjectId;
    kitchenAppliance: Types.ObjectId;

    // Optional single selections
    laundryAppliance?: Types.ObjectId;
    lotPremium?: Types.ObjectId;

    //Multiple selections allowed
    structuralOptions: Types.ObjectId[];
    additionalOptions: Types.ObjectId[];

    basePlanPrice?: number;
    optionsTotalPrice?: number;
    totalPrice?: number;

    //configuration status
    status: 'draft' | 'submitted' | 'contracted' | 'building' | 'completed';
    isActive: boolean; //For soft deletion

    //Metadata
    submittedAt?: Date;
    contractedAt?: Date;
    notes?: string;
    customerNotes?: string;
}

const userPlanSchema = new Schema<UserHomeSelection>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: {type: Schema.Types.ObjectId, ref: 'Plan', required: true},
    configurationName: { type: String, trim: true, maxLength: 100, default: function() {
        return `My Semi-Custom Home ${new Date().toLocaleDateString()}`
    }},
    elevation: { type: Schema.Types.ObjectId, ref: 'Option', required: true},
    colorScheme: { type: Schema.Types.ObjectId, ref: 'ColorScheme', required: true},
    interiorPackage: { type: Schema.Types.ObjectId, ref: 'InteriorPackage', required: true},
    kitchenAppliance: { type: Schema.Types.ObjectId, ref: 'Appliance', required: true},
    laundryAppliance: { type: Schema.Types.ObjectId, ref: 'Appliance'},
    lotPremium: { type: Schema.Types.ObjectId, ref: 'LotPremium'},
    structuralOptions: [{ type: Schema.Types.ObjectId, ref: 'Structural'}],
    additionalOptions: [{ type: Schema.Types.ObjectId, ref: 'Option'}],
    basePlanPrice: { type: Number, min: 0},
    optionsTotalPrice: { type: Number, min: 0, default: 0},
    totalPrice: { type: Number, min: 0},
    status: { type: String, enum: ['draft', 'submitted', 'contracted', 'building', 'completed'], default: 'draft'},
    isActive: { type: Boolean, default: true},
    submittedAt: Date,
    contractedAt: Date,
    notes: { type: String, maxlength: 1000},
    customerNotes: { type: String, maxlength: 500},
}, { timestamps: true });

// Pre-save validation to ensure selected options are valid for the plan
userPlanSchema.pre('save', async function() {
    if (this.isNew || this.isModified('plan') || this.isModified('elevation') || this.isModified('colorScheme') || this.isModified('interiorPackage') || this.isModified('kitchenAppliance') || this.isModified('laundryAppliance') || this.isModified('structuralOptions') || this.isModified('additionalOptions')) {
        const Plan = this.db.model('Plan');
        const basePlan = await Plan.findById(this.plan)

        if (!basePlan) {
            throw new Error('Invlaid plan type selected');
        }

        if (!basePlan.elevations.includes(this.elevation)) {
            throw new Error('Selected elevation is not available for this plan');
        }

        // Validate color scheme is available for this plan
        if (!basePlan.colorScheme.includes(this.colorScheme)) {
            throw new Error('Selected color scheme is not available for this plan');
        }

        // Validate interior package is available for this plan
        if (!basePlan.interiors.includes(this.interiorPackage)) {
            throw new Error('Selected interior package is not available for this plan');
        }

        // Validate kitchen appliance is available for this plan
        if (!basePlan.kitchenAppliance.includes(this.kitchenAppliance)) {
            throw new Error('Selected kitchen appliance package is not available for this plan');
        }

        // Validate laundry appliance (if selected) is available for this plan
        if (this.laundryAppliance && !basePlan.laundryAppliance.includes(this.laundryAppliance)) {
            throw new Error('Selected laundry appliance package is not available for this plan');
        }

        // Validate structural options are available for this plan
        for (const structuralId of this.structuralOptions) {
            if (!basePlan.structural.includes(structuralId)) {
                throw new Error('One or more selected structural options are not available for this plan');
            }
        }

        // Validate additional options are available for this plan
        for (const additionalId of this.additionalOptions) {
            if (!basePlan.additional.includes(additionalId)) {
                throw new Error('One or more selected additional options are not available for this plan');
            }
        }

        // Cache base plan price
        this.basePlanPrice = basePlan.basePrice;
    }
});

//Calculate total dimensions
userPlanSchema.pre('save', async function () {
    if (this.lotPremium && (this.isNew || this.isModified('lotPremium') || this.isModified('plan') || this.isModified('structuralOptions'))) {
        const Plan = this.db.model('Plan');
        const LotPremium = this.db.model('LotPremium');
        const Structural = this.db.model('Structural');

        const [basePlan, selectedLot, structuralOptions] = await Promise.all([
            Plan.findById(this.plan),
            LotPremium.findById(this.lotPremium),
            this.structuralOptions.length > 0 ?
                Structural.find({ _id: { $in: this.structuralOptions } }) :
                Promise.resolve([])
        ]);

        if (!basePlan || !selectedLot) {
            throw new Error('Invalid plan or lot premium selected');
        }

        // Calculate total dimensions including structural upgrades
        let totalWidth = basePlan.width;
        let totalLength = basePlan.length;

        // Add structural upgrade dimensions
        structuralOptions.forEach(structural => {
            totalWidth += structural.width || 0;
            totalLength += structural.length || 0;
        });

        // Validate dimensions fit on lot
        if (totalWidth > selectedLot.width) {
            throw new Error(
                `Total home width (${totalWidth}') exceeds lot width (${selectedLot.width}'). ` +
                `Plan: ${basePlan.width}', Structural additions: ${totalWidth - basePlan.width}'`
            );
        }

        if (totalLength > selectedLot.length) {
            throw new Error(
                `Total home length (${totalLength}') exceeds lot length (${selectedLot.length}'). ` +
                `Plan: ${basePlan.length}', Structural additions: ${totalLength - basePlan.length}'`
            );
        }
    }
});


// Indexes for performance
userPlanSchema.index({ userId: 1, isActive: 1 });
userPlanSchema.index({ status: 1 });
userPlanSchema.index({ userId: 1, status: 1 });
userPlanSchema.index({ planType: 1 });
userPlanSchema.index({ createdAt: -1 });
userPlanSchema.index({ userId: 1, createdAt: -1 });

//Static method to find user's active configurations
userPlanSchema.statics.findActiveByUser = function (userId: Types.ObjectId) {
    return this.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

const UserPlan = model<UserHomeSelection>('UserPlan', userPlanSchema);

export const userHomeSelectionSchema = userPlanSchema;
export default UserPlan;