import { gql } from '@apollo/client';

// Plan-option relationship mutations
// These mutations add/remove existing options to/from plans by ID

// Elevation relationship mutations
export const ADD_ELEVATION_TO_PLAN = gql`
    mutation addElevationToPlan($planId: ObjectId!, $elevationId: ID!) {
        addElevationToPlan(planId: $planId, elevationId: $elevationId) {
            _id
            name
            elevations {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_ELEVATION_FROM_PLAN = gql`
    mutation removeElevationFromPlan($planId: ObjectId!, $elevationId: ID!) {
        removeElevationFromPlan(planId: $planId, elevationId: $elevationId) {
            _id
            name
            elevations {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                isActive
                sortOrder
            }
        }
    }
`;

// Structural relationship mutations
export const ADD_STRUCTURAL_TO_PLAN = gql`
    mutation addStructuralToPlan($planId: ObjectId!, $structuralId: ID!) {
        addStructuralToPlan(planId: $planId, structuralId: $structuralId) {
            _id
            name
            structural {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                garage
                bedrooms
                bathrooms
                width
                length
                totalSqft
                resSqft
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_STRUCTURAL_FROM_PLAN = gql`
    mutation removeStructuralFromPlan($planId: ObjectId!, $structuralId: ID!) {
        removeStructuralFromPlan(planId: $planId, structuralId: $structuralId) {
            _id
            name
            structural {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                garage
                bedrooms
                bathrooms
                width
                length
                totalSqft
                resSqft
                isActive
                sortOrder
            }
        }
    }
`;

// Interior Package relationship mutations
export const ADD_INTERIOR_PACKAGE_TO_PLAN = gql`
    mutation addInteriorPackageToPlan($planId: ObjectId!, $interiorPackageId: ObjectId!) {
        addInteriorPackageToPlan(planId: $planId, interiorPackageId: $interiorPackageId) {
            _id
            name
            interiors {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                basePackage
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_INTERIOR_PACKAGE_FROM_PLAN = gql`
    mutation removeInteriorPackageFromPlan($planId: ObjectId!, $interiorPackageId: ObjectId!) {
        removeInteriorPackageFromPlan(planId: $planId, interiorPackageId: $interiorPackageId) {
            _id
            name
            interiors {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                basePackage
                isActive
                sortOrder
            }
        }
    }
`;

// Interior Option relationship mutations (for individual interior options, not packages)
export const ADD_INTERIOR_OPTION_TO_PLAN = gql`
    mutation addInteriorOptionToPlan($planId: ObjectId!, $interiorOptionId: ID!) {
        addInteriorOptionToPlan(planId: $planId, interiorOptionId: $interiorOptionId) {
            _id
            name
            interiors {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                basePackage
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_INTERIOR_OPTION_FROM_PLAN = gql`
    mutation removeInteriorOptionFromPlan($planId: ObjectId!, $interiorOptionId: ID!) {
        removeInteriorOptionFromPlan(planId: $planId, interiorOptionId: $interiorOptionId) {
            _id
            name
            interiors {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                basePackage
                isActive
                sortOrder
            }
        }
    }
`;

// Appliance relationship mutations
export const ADD_APPLIANCE_TO_PLAN = gql`
    mutation addApplianceToPlan($planId: ObjectId!, $applianceId: ObjectId!) {
        addApplianceToPlan(planId: $planId, applianceId: $applianceId) {
            _id
            name
            kitchenAppliance {
                _id
                name
                totalCost
                clientPrice
                markup
                type
                description
                img
                brand
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                totalCost
                clientPrice
                markup
                type
                description
                img
                brand
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_APPLIANCE_FROM_PLAN = gql`
    mutation removeApplianceFromPlan($planId: ObjectId!, $applianceId: ObjectId!) {
        removeApplianceFromPlan(planId: $planId, applianceId: $applianceId) {
            _id
            name
            kitchenAppliance {
                _id
                name
                totalCost
                clientPrice
                markup
                type
                description
                img
                brand
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                totalCost
                clientPrice
                markup
                type
                description
                img
                brand
                isActive
                sortOrder
            }
        }
    }
`;

// Additional Option relationship mutations
export const ADD_ADDITIONAL_TO_PLAN = gql`
    mutation addAdditionalToPlan($planId: ObjectId!, $additionalId: ObjectId!) {
        addAdditionalToPlan(planId: $planId, additionalId: $additionalId) {
            _id
            name
            additional {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_ADDITIONAL_FROM_PLAN = gql`
    mutation removeAdditionalFromPlan($planId: ObjectId!, $additionalId: ObjectId!) {
        removeAdditionalFromPlan(planId: $planId, additionalId: $additionalId) {
            _id
            name
            additional {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                isActive
                sortOrder
            }
        }
    }
`;

// Lot Pricing relationship mutations
// Note: lot field in Plan contains LotPricing documents (which reference both Lot and Plan)
export const ADD_LOT_PRICING_TO_PLAN = gql`
    mutation addLotPricingToPlan($planId: ObjectId!, $lotPricingId: ObjectId!) {
        addLotPricingToPlan(planId: $planId, lotPricingId: $lotPricingId) {
            _id
            name
            lot {
                _id
                lotPremium
                isActive
                lot {
                    _id
                    filing
                    lot
                    width
                    length
                    lotSqft
                    streetNumber
                    streetName
                    garageDir
                    parcelNumber
                    notes
                    isActive
                }
                plan {
                    _id
                    name
                }
            }
        }
    }
`;

export const REMOVE_LOT_PRICING_FROM_PLAN = gql`
    mutation removeLotPricingFromPlan($planId: ObjectId!, $lotPricingId: ObjectId!) {
        removeLotPricingFromPlan(planId: $planId, lotPricingId: $lotPricingId) {
            _id
            name
            lot {
                _id
                lotPremium
                isActive
                lot {
                    _id
                    filing
                    lot
                    width
                    length
                    lotSqft
                    streetNumber
                    streetName
                    garageDir
                    parcelNumber
                    notes
                    isActive
                }
                plan {
                    _id
                    name
                }
            }
        }
    }
`;

// Color Scheme relationship mutations
export const ADD_COLOR_SCHEME_TO_PLAN = gql`
    mutation addColorSchemeToPlan($planId: ObjectId!, $colorSchemeId: ObjectId!) {
        addColorSchemeToPlan(planId: $planId, colorSchemeId: $colorSchemeId) {
            _id
            name
            colorScheme {
                _id
                name
                planId
                description
                price
                primaryName
                primaryCode
                secondaryName
                secondaryCode
                trimName
                trimCode
                doorName
                doorCode
                shingleBrand
                shingleColor
                stone
                stoneColor
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_COLOR_SCHEME_FROM_PLAN = gql`
    mutation removeColorSchemeFromPlan($planId: ObjectId!, $colorSchemeId: ObjectId!) {
        removeColorSchemeFromPlan(planId: $planId, colorSchemeId: $colorSchemeId) {
            _id
            name
            colorScheme {
                name
                planId
                description
                price
                primaryName
                primaryCode
                secondaryName
                secondaryCode
                trimName
                trimCode
                doorName
                doorCode
                shingleBrand
                shingleColor
                stone
                stoneColor
                isActive
                sortOrder
            }
        }
    }
`;

// Legacy export aliases for backward compatibility
export const REMOVE_PLAN_ELEVATION = REMOVE_ELEVATION_FROM_PLAN;
export const REMOVE_PLAN_STRUCTURAL = REMOVE_STRUCTURAL_FROM_PLAN;
export const REMOVE_PLAN_INTERIOR = REMOVE_INTERIOR_PACKAGE_FROM_PLAN;
export const REMOVE_PLAN_APPLIANCE = REMOVE_APPLIANCE_FROM_PLAN;
export const REMOVE_PLAN_ADDITIONAL = REMOVE_ADDITIONAL_FROM_PLAN;
export const REMOVE_PLAN_LOT = REMOVE_LOT_PRICING_FROM_PLAN;

// Backward compatibility aliases for old naming conventions
export const ADD_LOT_TO_PLAN = ADD_LOT_PRICING_TO_PLAN;
export const UPDATE_PLAN_ELEVATION = ADD_ELEVATION_TO_PLAN;
export const UPDATE_PLAN_STRUCTURAL = ADD_STRUCTURAL_TO_PLAN;
export const UPDATE_PLAN_INTERIOR = ADD_INTERIOR_PACKAGE_TO_PLAN;
export const UPDATE_PLAN_APPLIANCE = ADD_APPLIANCE_TO_PLAN;
export const UPDATE_PLAN_ADDITIONAL = ADD_ADDITIONAL_TO_PLAN;
export const UPDATE_PLAN_LOT = ADD_LOT_PRICING_TO_PLAN;

// Note: Bulk operations like REORDER_PLAN_OPTIONS and COPY_OPTIONS_FROM_PLAN
// are not implemented in the current backend schema
export const REORDER_PLAN_OPTIONS = gql`
    mutation reorderPlanOptions($planId: ID!, $optionType: String!, $optionIds: [ID!]!) {
        reorderPlanOptions(planId: $planId, optionType: $optionType, optionIds: $optionIds) {
            _id
            name
        }
    }
`;

export const COPY_OPTIONS_FROM_PLAN = gql`
    mutation copyOptionsFromPlan($sourcePlanId: ID!, $targetPlanId: ID!, $optionTypes: [String!]!) {
        copyOptionsFromPlan(sourcePlanId: $sourcePlanId, targetPlanId: $targetPlanId, optionTypes: $optionTypes) {
            _id
            name
        }
    }
`;