import { gql } from '@apollo/client';

// ============================================
// USER QUERIES
// ============================================

export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            role
            homeCount
        }
    }
`;

export const GET_USER = gql`
    query getUser($id: ObjectId, $username: String) {
        user(id: $id, username: $username) {
            _id
            username
            email
            role
            homeCount
        }
    }
`;

export const GET_USERS = gql`
    query getUsers {
        users {
            _id
            username
            email
            role
            homeCount
            createdAt
            updatedAt
        }
    }
`;

// ============================================
// PLAN QUERIES
// ============================================

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
            isActive
            createdAt
            updatedAt
            elevations {
                _id
                name
                totalCost
                clientPrice
                markup
                minMarkup
                description
                img
                planId
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
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
                colorSchemeImg
                isActive
                sortOrder
            }
            interiors {
                _id
                name
                brand
                color
                cost
                clientPrice
                material
                tier
                img
                isActive
            }
            structural {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                classification
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
                totalCost
                clientPrice
                markup
                description
                img
                classification
                isActive
                sortOrder
            }
            kitchenAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            lot {
                _id
                lotPremium
                isActive
            }
        }
    }
`;

export const GET_PLAN = gql`
    query getPlan($id: ObjectId!) {
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
            isActive
            createdAt
            updatedAt
            elevations {
                _id
                name
                totalCost
                clientPrice
                markup
                minMarkup
                description
                img
                planId
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
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
                colorSchemeImg
                isActive
                sortOrder
            }
            interiors {
                _id
                name
                brand
                color
                cost
                clientPrice
                material
                tier
                img
                isActive
            }
            structural {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                classification
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
                totalCost
                clientPrice
                markup
                description
                img
                classification
                isActive
                sortOrder
            }
            kitchenAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            lot {
                _id
                lotPremium
                isActive
            }
        }
    }
`;

export const GET_PLAN_BY_TYPE = gql`
    query getPlanByType($planType: Int!) {
        planByType(planType: $planType) {
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
            isActive
            elevations {
                _id
                name
                totalCost
                clientPrice
                markup
                minMarkup
                description
                img
                planId
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
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
                colorSchemeImg
                isActive
                sortOrder
            }
            interiors {
                _id
                name
                brand
                color
                cost
                clientPrice
                material
                tier
                img
                isActive
            }
            structural {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                classification
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
                totalCost
                clientPrice
                markup
                description
                img
                classification
                isActive
                sortOrder
            }
            kitchenAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            lot {
                _id
                lotPremium
                isActive
            }
        }
    }
`;

export const GET_ACTIVE_PLANS = gql`
    query getActivePlans {
        activePlans {
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
            isActive
            elevations {
                _id
                name
                totalCost
                clientPrice
                markup
                minMarkup
                description
                img
                planId
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
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
                colorSchemeImg
                isActive
                sortOrder
            }
            interiors {
                _id
                name
                brand
                color
                cost
                clientPrice
                material
                tier
                img
                isActive
            }
            structural {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                classification
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
                totalCost
                clientPrice
                markup
                description
                img
                classification
                isActive
                sortOrder
            }
            kitchenAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            lot {
                _id
                lotPremium
                isActive
            }
        }
    }
`;

export const SEARCH_PLANS = gql`
    query searchPlans(
        $minPrice: Float,
        $maxPrice: Float,
        $minBedrooms: Int,
        $maxBedrooms: Int,
        $minBathrooms: Float,
        $maxBathrooms: Float,
        $minSqft: Int,
        $maxSqft: Int
    ) {
        searchPlans(
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            minBedrooms: $minBedrooms,
            maxBedrooms: $maxBedrooms,
            minBathrooms: $minBathrooms,
            maxBathrooms: $maxBathrooms,
            minSqft: $minSqft,
            maxSqft: $maxSqft
        ) {
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

// ============================================
// USER PLAN QUERIES
// ============================================

export const GET_USER_PLANS = gql`
    query getUserPlans($userId: ObjectId) {
        userPlans(userId: $userId) {
            _id
            userId
            planId
            configurationName
            status
            basePlanPrice
            optionsTotalPrice
            totalPrice
            isActive
            createdAt
            updatedAt
            elevation {
                _id
                name
                totalCost
                clientPrice
                markup
                minMarkup
                description
                img
                planId
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
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
                colorSchemeImg
                isActive
                sortOrder
            }
            interiorPackage {
                _id
                name
                brand
                color
                cost
                clientPrice
                material
                tier
                img
                isActive
            }
            structural {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                classification
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
                totalCost
                clientPrice
                markup
                description
                img
                classification
                isActive
                sortOrder
            }
            kitchenAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            lot {
                _id
                lotPremium
                isActive
            }
        }
    }
`;

export const GET_USER_PLAN = gql`
    query getUserPlan($id: ObjectId!) {
        userPlan(id: $id) {
            _id
            userId
            planId
            configurationName
            status
            basePlanPrice
            optionsTotalPrice
            totalPrice
            isActive
            notes
            customerNotes
            submittedAt
            contractedAt
            createdAt
            updatedAt
            elevation {
                _id
                name
                totalCost
                clientPrice
                markup
                minMarkup
                description
                img
                planId
                isActive
                sortOrder
            }
            colorScheme {
                _id
                name
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
                colorSchemeImg
                isActive
                sortOrder
            }
            interiorPackage {
                _id
                name
                brand
                color
                cost
                clientPrice
                material
                tier
                img
                isActive
            }
            structuralOptions {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                classification
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
            additionalOptions {
                _id
                name
                totalCost
                clientPrice
                markup
                description
                img
                classification
                isActive
                sortOrder
            }
            kitchenAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            laundryAppliance {
                _id
                name
                baseCost
                totalCost
                clientPrice
                type
                brand
                img
                isActive
                sortOrder
            }
            lot {
                _id
                lotPremium
                isActive
            }
        }
    }
`;

// ============================================
// OPTION QUERIES (All Options Across Plans)
// ============================================

export const GET_ELEVATION_OPTIONS = gql`
    query getElevationOptions {
        elevationOptions {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
            description
            img
            planId
            isActive
            sortOrder
            createdAt
            updatedAt
        }
    }
`;

export const GET_INTERIOR_PACKAGES = gql`
    query getInteriorPackages {
        interiorPackages {
            _id
            name
            totalCost
            markup
            minMarkup
            clientPrice
            description
            img
            planId
            softClose
            basePackage
            isActive
            sortOrder
            createdAt
            updatedAt
            fixtures {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            lvp {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            carpet {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            backsplash {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            masterBathTile {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            secondaryBathTile {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            countertop {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            primaryCabinets {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            secondaryCabinets {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            cabinetHardware {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
        }
    }
`;

export const GET_INTERIOR_OPTIONS = gql`
    query getInteriorOptions {
        interiorOptions {
            _id
            name
            brand
            color
            cost
            markup
            minMarkup
            clientPrice
            material
            tier
            cabinetOverlay
            softClosePrice
            planId
            img
            isActive
            sortOrder
            createdAt
            updatedAt
        }
    }
`;

export const GET_STRUCTURAL_OPTIONS = gql`
    query getStructuralOptions {
        structuralOptions {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
            description
            img
            planId
            classification
            garage
            bedrooms
            bathrooms
            width
            length
            totalSqft
            resSqft
            isActive
            sortOrder
            createdAt
            updatedAt
        }
    }
`;

export const GET_ADDITIONAL_OPTIONS = gql`
    query getAdditionalOptions {
        additional {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
            description
            img
            classification
            planId
            isActive
            sortOrder
            createdAt
            updatedAt
        }
    }
`;

export const GET_APPLIANCES = gql`
    query getAppliances {
        appliances {
            _id
            name
            baseCost
            totalCost
            markup
            minMarkup
            clientPrice
            type
            brand
            img
            planId
            isActive
            sortOrder
            createdAt
            updatedAt
        }
    }
`;

export const GET_COLOR_SCHEMES = gql`
    query getColorSchemes {
        colorSchemes {
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
            colorSchemeImg
            isActive
            sortOrder
            createdAt
            updatedAt
        }
    }
`;

export const GET_LOTS = gql`
    query getLots {
        lots {
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
            createdAt
            updatedAt
        }
    }
`;

export const GET_LOT_PRICING = gql`
    query getLotPricing {
        lotPricing {
            _id
            lotPremium
            isActive
            createdAt
            updatedAt
        }
    }
`;

// ============================================
// PLAN-SPECIFIC OPTION QUERIES
// ============================================

export const GET_PLAN_ELEVATIONS = gql`
    query getPlanElevations($planId: ObjectId!) {
        planElevations(planId: $planId) {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
            description
            img
            planId
            isActive
            sortOrder
            createdAt
            updatedAt
        }
    }
`;

export const GET_PLAN_STRUCTURAL = gql`
    query getPlanStructural($planId: ObjectId!) {
        planStructural(planId: $planId) {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
            description
            img
            planId
            classification
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
`;

export const GET_PLAN_INTERIOR_OPTIONS = gql`
    query getPlanInteriorOptions($planId: ObjectId!) {
        planInteriorOptions(planId: $planId) {
            _id
            name
            brand
            color
            cost
            markup
            minMarkup
            clientPrice
            material
            tier
            cabinetOverlay
            softClosePrice
            planId
            img
            isActive
            sortOrder
        }
    }
`;

export const GET_PLAN_INTERIOR_PACKAGES = gql`
    query getPlanInteriorPackages($planId: ObjectId!) {
        planInteriorPackages(planId: $planId) {
            _id
            name
            totalCost
            markup
            minMarkup
            clientPrice
            description
            img
            planId
            softClose
            basePackage
            isActive
            sortOrder
            fixtures {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            lvp {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            carpet {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            backsplash {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            masterBathTile {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            secondaryBathTile {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            countertop {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            primaryCabinets {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            secondaryCabinets {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
            cabinetHardware {
                _id
                name
                brand
                color
                cost
                markup
                minMarkup
                clientPrice
                material
                tier
                cabinetOverlay
                softClosePrice
                planId
                img
                isActive
            }
        }
    }
`;

export const GET_PLAN_APPLIANCES = gql`
    query getPlanAppliances($planId: ObjectId!) {
        planAppliances(planId: $planId) {
            _id
            name
            baseCost
            totalCost
            markup
            minMarkup
            clientPrice
            type
            brand
            img
            planId
            isActive
            sortOrder
        }
    }
`;

export const GET_PLAN_ADDITIONAL = gql`
    query getPlanAdditional($planId: ObjectId!) {
        planAdditional(planId: $planId) {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
            description
            img
            classification
            planId
            isActive
            sortOrder
        }
    }
`;

export const GET_PLAN_COLOR_SCHEMES = gql`
    query getPlanColorSchemes($planId: ObjectId!) {
        planColorSchemes(planId: $planId) {
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
            colorSchemeImg
            isActive
            sortOrder
        }
    }
`;

export const GET_PLAN_LOT_PRICING = gql`
    query getPlanLotPricing($planId: ObjectId!) {
        planLotPricing(planId: $planId) {
            _id
            lotPremium
            isActive
        }
    }
`;

// ============================================
// SEARCH QUERIES
// ============================================

export const SEARCH_OPTIONS = gql`
    query searchOptions($query: String!, $type: String!) {
        searchOptions(query: $query, type: $type) {
            ... on Elevation {
                _id
                name
                totalCost
                clientPrice
                planId
            }
            ... on Structural {
                _id
                name
                totalCost
                clientPrice
                planId
            }
            ... on InteriorOption {
                _id
                name
                cost
                clientPrice
                material
                planId
            }
            ... on InteriorPackage {
                _id
                name
                totalCost
                clientPrice
                planId
            }
            ... on Appliance {
                _id
                name
                totalCost
                clientPrice
                type
                planId
            }
            ... on Additional {
                _id
                name
                totalCost
                clientPrice
                planId
            }
            ... on ColorScheme {
                _id
                name
                price
                planId
            }
            ... on Lot {
                _id
                filing
                lot
                lotSqft
            }
            ... on LotPricing {
                _id
                lotPremium
            }
        }
    }
`;
