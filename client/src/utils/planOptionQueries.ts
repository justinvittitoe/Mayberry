import { gql } from '@apollo/client';

// Plan-specific option queries

// Updated GET_PLANS query to include plan-specific options
export const GET_PLANS_WITH_OPTIONS = gql`
    query getPlansWithOptions {
        plans {
            _id
            planType
            name
            bedrooms
            bathrooms
            totalSqft
            resSqft
            garage
            basePrice
            description
            width
            length
            elevations {
                _id
                name
                price
                description
                img
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
                description
                price
                colorValues {
                    primary
                    secondary
                    roof
                    accent
                    foundation
                }
                isActive
                sortOrder
            }
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

// Get a single plan with all its options
export const GET_PLAN_WITH_OPTIONS = gql`
    query getPlanWithOptions($id: ID!) {
        plan(id: $id) {
            _id
            planType
            name
            bedrooms
            bathrooms
            totalSqft
            resSqft
            garage
            basePrice
            description
            width
            length
            elevations {
                _id
                name
                price
                description
                img
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
                description
                price
                colorValues {
                    primary
                    secondary
                    roof
                    accent
                    foundation
                }
                isActive
                sortOrder
            }
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

// Queries for browsing options across all plans (for inspiration)
export const GET_ALL_PLAN_ELEVATIONS = gql`
    query getAllPlanElevations {
        allPlanElevations {
            _id
            name
            price
            description
            img
            isActive
            sortOrder
            planName
            planType
            planId
        }
    }
`;

export const GET_ALL_PLAN_STRUCTURAL = gql`
    query getAllPlanStructural {
        allPlanStructural {
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
            planName
            planType
            planId
        }
    }
`;

export const GET_ALL_PLAN_INTERIORS = gql`
    query getAllPlanInteriors {
        allPlanInteriors {
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
            planName
            planType
            planId
        }
    }
`;

export const GET_ALL_PLAN_APPLIANCES = gql`
    query getAllPlanAppliances {
        allPlanAppliances {
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
            planName
            planType
            planId
        }
    }
`;

export const GET_ALL_PLAN_ADDITIONAL = gql`
    query getAllPlanAdditional {
        allPlanAdditional {
            _id
            name
            price
            description
            img
            category
            isActive
            sortOrder
            planName
            planType
            planId
        }
    }
`;

export const GET_ALL_PLAN_LOTS = gql`
    query getAllPlanLots {
        allPlanLots {
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
            planName
            planType
            planId
        }
    }
`;

// Search for options across all plans
export const SEARCH_PLAN_OPTIONS = gql`
    query searchPlanOptions($query: String!, $type: String!) {
        searchPlanOptions(query: $query, type: $type) {
            ... on PlanElevationOption {
                _id
                name
                price
                description
                img
                planName
                planType
                planId
            }
            ... on PlanStructuralOption {
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
                planName
                planType
                planId
            }
            ... on PlanInteriorOption {
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
                planName
                planType
                planId
            }
            ... on PlanApplianceOption {
                _id
                name
                price
                type
                description
                img
                brand
                model
                appliances
                planName
                planType
                planId
            }
            ... on PlanAdditionalOption {
                _id
                name
                price
                description
                img
                category
                planName
                planType
                planId
            }
            ... on PlanLotPremium {
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
                planName
                planType
                planId
            }
        }
    }
`;

// Get specific options for a plan
export const GET_PLAN_OPTIONS = gql`
    query getPlanOptions($planId: ID!, $optionType: String!) {
        planOptions(planId: $planId, optionType: $optionType) {
            ... on PlanElevationOption {
                _id
                name
                price
                description
                img
                isActive
                sortOrder
            }
            ... on PlanStructuralOption {
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
            ... on PlanInteriorOption {
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
            ... on PlanApplianceOption {
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
            ... on PlanAdditionalOption {
                _id
                name
                price
                description
                img
                category
                isActive
                sortOrder
            }
            ... on PlanLotPremium {
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
// Basic GET_PLANS query for simple use cases (like Home page)
export const GET_PLANS = gql`
    query getPlans {
        plans {
            _id
            planType
            name
            bedrooms
            bathrooms
            totalSqft
            resSqft
            garage
            basePrice
            description
            width
            length
        }
    }
`;
