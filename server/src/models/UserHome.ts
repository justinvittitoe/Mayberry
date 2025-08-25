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
    customerNotes: { type: String, maxlength: 500}
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
})

// Pre-save validation for lot premium (must fit plan dimensions)
userPlanSchema.pre('save', async function () {
    if (this.lotPremium && (this.isNew || this.isModified('lotPremium') || this.isModified('plan'))) {
        const Plan = this.db.model('Plan');
        const LotPremium = this.db.model('LotPremium');

        const [basePlan, selectedLot] = await Promise.all([
            Plan.findById(this.plan),
            LotPremium.findById(this.lotPremium)
        ]);

        if (!basePlan || !selectedLot) {
            throw new Error('Invalid plan or lot premium selected');
        }

        // Check if plan dimensions fit on the lot
        const planArea = basePlan.width * basePlan.length;
        const lotArea = selectedLot.width * selectedLot.length; // Assuming lot has width/length

        if (planArea > lotArea) {
            throw new Error(`Plan dimensions (${basePlan.width}' x ${basePlan.length}') do not fit on selected lot (${selectedLot.width}' x ${selectedLot.length}')`);
        }
        // I need to verify how this is calculated in the pricing model
        // const bufferRatio = 0.8; // Plan can use max 80% of lot area
        // if (planArea > (lotArea * bufferRatio)) {
        //     throw new Error(`Plan is too large for selected lot. Plan needs ${Math.ceil(planArea / bufferRatio)} sq ft minimum lot size.`);
        // }
    }
});

// Calculate and update pricing before save
userPlanSchema.pre('save', async function () {
    if (this.isModified('elevation') || this.isModified('colorScheme') ||
        this.isModified('interiorPackage') || this.isModified('kitchenAppliance') ||
        this.isModified('laundryAppliance') || this.isModified('lotPremium') ||
        this.isModified('structuralOptions') || this.isModified('additionalOptions')) {

        let optionsTotal = 0;

        // Collect all option IDs
        const optionIds = [
            this.elevation,
            this.colorScheme,
            this.interiorPackage,
            this.kitchenAppliance,
            this.laundryAppliance,
            this.lotPremium,
            ...this.structuralOptions,
            ...this.additionalOptions
        ].filter(id => id); // Remove null/undefined

        if (optionIds.length > 0) {
            // Query all option prices (this assumes all options have a price field or method)
            const Option = this.db.model('Option');
            const InteriorPackage = this.db.model('InteriorPackage');
            const ColorScheme = this.db.model('ColorScheme');
            const Appliance = this.db.model('Appliance');
            const LotPremium = this.db.model('LotPremium');
            const Structural = this.db.model('Structural');

            // Get prices from different collections
            const [options, interiorPackages, colorSchemes, appliances, lotPremiums, structurals] = await Promise.all([
                Option.find({ _id: { $in: [this.elevation, ...this.additionalOptions] } }).select('price'),
                InteriorPackage.find({ _id: this.interiorPackage }).select('clientPrice totalPrice'),
                ColorScheme.find({ _id: this.colorScheme }).select('price'),
                Appliance.find({ _id: { $in: [this.kitchenAppliance, this.laundryAppliance].filter(id => id) } }).select('price'),
                LotPremium.find({ _id: this.lotPremium }).select('premiumAmount price'),
                Structural.find({ _id: { $in: this.structuralOptions } }).select('price')
            ]);

            // Calculate total options price
            optionsTotal += options.reduce((sum, opt) => sum + (opt.price || 0), 0);
            optionsTotal += interiorPackages.reduce((sum, pkg) => sum + (pkg.clientPrice || pkg.totalPrice || 0), 0);
            optionsTotal += colorSchemes.reduce((sum, cs) => sum + (cs.price || 0), 0);
            optionsTotal += appliances.reduce((sum, app) => sum + (app.price || 0), 0);
            optionsTotal += lotPremiums.reduce((sum, lot) => sum + (lot.premiumAmount || lot.price || 0), 0);
            optionsTotal += structurals.reduce((sum, struct) => sum + (struct.price || 0), 0);
        }

        this.optionsTotalPrice = optionsTotal;
        this.totalPrice = (this.basePlanPrice || 0) + optionsTotal;
    }
});

// Indexes for performance
userPlanSchema.index({ userId: 1, isActive: 1 });
userPlanSchema.index({ status: 1 });
userPlanSchema.index({ userId: 1, status: 1 });
userPlanSchema.index({ planType: 1 });
userPlanSchema.index({ createdAt: -1 });
userPlanSchema.index({ userId: 1, createdAt: -1 });

// Instance method to get configuration summary
userPlanSchema.methods.getConfigurationSummary = function () {
    return {
        id: this._id,
        name: this.configurationName,
        status: this.status,
        totalPrice: this.totalPrice,
        basePlanPrice: this.basePlanPrice,
        optionsTotalPrice: this.optionsTotalPrice,
        hasLaundryAppliance: !!this.laundryAppliance,
        hasLotPremium: !!this.lotPremium,
        structuralOptionsCount: this.structuralOptions.length,
        additionalOptionsCount: this.additionalOptions.length,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

//Static method to find user's active configurations
userPlanSchema.statics.findActiveByUser = function (userId: Types.ObjectId) {
    return this.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

// Virtual for total price - this will need to be calculated in resolvers
//This may need to be edited based of the new model schema
// userPlanSchema.virtual('totalPrice').get(function (this: UserHomeSelection) {
//     // This will be calculated in resolvers when we populate the references
//     return 0; // Placeholder
// });

const UserPlan = model<UserHomeSelection>('UserPlan', userPlanSchema);

export default UserPlan;