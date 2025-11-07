import { gql } from '@apollo/client';

// Plan-specific option management mutations

// Elevation mutations
export const ADD_ELEVATION_TO_PLAN = gql`
    mutation addElevationToPlan($planId: ID!, $elevation: PlanElevationOptionInput!) {
        addElevationToPlan(planId: $planId, elevation: $elevation) {
            _id
            name
            elevations {
                _id
                name
                price
                description
                img
                isActive
                sortOrder
            }
        }
    }
`;

export const UPDATE_PLAN_ELEVATION = gql`
    mutation updatePlanElevation($planId: ID!, $elevationId: ID!, $elevation: PlanElevationOptionInput!) {
        updatePlanElevation(planId: $planId, elevationId: $elevationId, elevation: $elevation) {
            _id
            name
            elevations {
                _id
                name
                price
                description
                img
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_PLAN_ELEVATION = gql`
    mutation removePlanElevation($planId: ID!, $elevationId: ID!) {
        removePlanElevation(planId: $planId, elevationId: $elevationId) {
            _id
            name
            elevations {
                _id
                name
                price
                description
                img
                isActive
                sortOrder
            }
        }
    }
`;

// Structural mutations
export const ADD_STRUCTURAL_TO_PLAN = gql`
    mutation addStructuralToPlan($planId: ID!, $structural: PlanStructuralOptionInput!) {
        addStructuralToPlan(planId: $planId, structural: $structural) {
            _id
            name
            structural {
                _id
                name
                price
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

export const UPDATE_PLAN_STRUCTURAL = gql`
    mutation updatePlanStructural($planId: ID!, $structuralId: ID!, $structural: PlanStructuralOptionInput!) {
        updatePlanStructural(planId: $planId, structuralId: $structuralId, structural: $structural) {
            _id
            name
            structural {
                _id
                name
                price
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

export const REMOVE_PLAN_STRUCTURAL = gql`
    mutation removePlanStructural($planId: ID!, $structuralId: ID!) {
        removePlanStructural(planId: $planId, structuralId: $structuralId) {
            _id
            name
            structural {
                _id
                name
                price
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

// Interior mutations
export const ADD_INTERIOR_TO_PLAN = gql`
    mutation addInteriorToPlan($planId: ID!, $interior: PlanInteriorOptionInput!) {
        addInteriorToPlan(planId: $planId, interior: $interior) {
            _id
            name
            interiors {
                _id
                name
                totalPrice
                clientPrice
                description
                img
                fixtures
                lvp
                carpet
                backsplash
                masterBathTile
                countertop
                primaryCabinets
                secondaryCabinets
                upgrade
                basePackage
                isActive
                sortOrder
            }
        }
    }
`;

export const UPDATE_PLAN_INTERIOR = gql`
    mutation updatePlanInterior($planId: ID!, $interiorId: ID!, $interior: PlanInteriorOptionInput!) {
        updatePlanInterior(planId: $planId, interiorId: $interiorId, interior: $interior) {
            _id
            name
            interiors {
                _id
                name
                totalPrice
                clientPrice
                description
                img
                fixtures
                lvp
                carpet
                backsplash
                masterBathTile
                countertop
                primaryCabinets
                secondaryCabinets
                upgrade
                basePackage
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_PLAN_INTERIOR = gql`
    mutation removePlanInterior($planId: ID!, $interiorId: ID!) {
        removePlanInterior(planId: $planId, interiorId: $interiorId) {
            _id
            name
            interiors {
                _id
                name
                totalPrice
                clientPrice
                description
                img
                fixtures
                lvp
                carpet
                backsplash
                masterBathTile
                countertop
                primaryCabinets
                secondaryCabinets
                upgrade
                basePackage
                isActive
                sortOrder
            }
        }
    }
`;

// Appliance mutations
export const ADD_APPLIANCE_TO_PLAN = gql`
    mutation addApplianceToPlan($planId: ID!, $appliance: PlanApplianceOptionInput!) {
        addApplianceToPlan(planId: $planId, appliance: $appliance) {
            _id
            name
            kitchenAppliance {
                _id
                name
                price
                type
                description
                img
                brand
                model
                appliances
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                price
                type
                description
                img
                brand
                model
                appliances
                isActive
                sortOrder
            }
        }
    }
`;

export const UPDATE_PLAN_APPLIANCE = gql`
    mutation updatePlanAppliance($planId: ID!, $applianceId: ID!, $appliance: PlanApplianceOptionInput!) {
        updatePlanAppliance(planId: $planId, applianceId: $applianceId, appliance: $appliance) {
            _id
            name
            kitchenAppliance {
                _id
                name
                price
                type
                description
                img
                brand
                model
                appliances
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                price
                type
                description
                img
                brand
                model
                appliances
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_PLAN_APPLIANCE = gql`
    mutation removePlanAppliance($planId: ID!, $applianceId: ID!) {
        removePlanAppliance(planId: $planId, applianceId: $applianceId) {
            _id
            name
            kitchenAppliance {
                _id
                name
                price
                type
                description
                img
                brand
                model
                appliances
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                price
                type
                description
                img
                brand
                model
                appliances
                isActive
                sortOrder
            }
        }
    }
`;

// Additional mutations
export const ADD_ADDITIONAL_TO_PLAN = gql`
    mutation addAdditionalToPlan($planId: ID!, $additional: PlanAdditionalOptionInput!) {
        addAdditionalToPlan(planId: $planId, additional: $additional) {
            _id
            name
            additional {
                _id
                name
                price
                description
                img
                category
                isActive
                sortOrder
            }
        }
    }
`;

export const UPDATE_PLAN_ADDITIONAL = gql`
    mutation updatePlanAdditional($planId: ID!, $additionalId: ID!, $additional: PlanAdditionalOptionInput!) {
        updatePlanAdditional(planId: $planId, additionalId: $additionalId, additional: $additional) {
            _id
            name
            additional {
                _id
                name
                price
                description
                img
                category
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_PLAN_ADDITIONAL = gql`
    mutation removePlanAdditional($planId: ID!, $additionalId: ID!) {
        removePlanAdditional(planId: $planId, additionalId: $additionalId) {
            _id
            name
            additional {
                _id
                name
                price
                description
                img
                category
                isActive
                sortOrder
            }
        }
    }
`;

// Lot mutations
export const ADD_LOT_TO_PLAN = gql`
    mutation addLotToPlan($planId: ID!, $lot: PlanLotPremiumInput!) {
        addLotToPlan(planId: $planId, lot: $lot) {
            _id
            name
            lotPremium {
                _id
                filing
                lot
                width
                length
                lotSqft
                premium
                address
                parcelNumber
                description
                features
                isActive
                sortOrder
            }
        }
    }
`;

export const UPDATE_PLAN_LOT = gql`
    mutation updatePlanLot($planId: ID!, $lotId: ID!, $lot: PlanLotPremiumInput!) {
        updatePlanLot(planId: $planId, lotId: $lotId, lot: $lot) {
            _id
            name
            lotPremium {
                _id
                filing
                lot
                width
                length
                lotSqft
                premium
                address
                parcelNumber
                description
                features
                isActive
                sortOrder
            }
        }
    }
`;

export const REMOVE_PLAN_LOT = gql`
    mutation removePlanLot($planId: ID!, $lotId: ID!) {
        removePlanLot(planId: $planId, lotId: $lotId) {
            _id
            name
            lotPremium {
                _id
                filing
                lot
                width
                length
                lotSqft
                premium
                address
                parcelNumber
                description
                features
                isActive
                sortOrder
            }
        }
    }
`;

// Bulk operations
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