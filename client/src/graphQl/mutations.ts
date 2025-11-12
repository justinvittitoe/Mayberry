import { gql } from '@apollo/client';

// ============================================
// AUTH MUTATIONS
// ============================================

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                role
            }
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                role
            }
        }
    }
`;

// ============================================
// ADMIN USER MANAGEMENT MUTATIONS
// ============================================

export const CREATE_ADMIN_USER = gql`
    mutation createAdminUser($username: String!, $email: String!, $password: String!) {
        createAdminUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                role
            }
        }
    }
`;

export const UPDATE_USER_ROLE = gql`
    mutation updateUserRole($userId: ObjectId!, $role: String!) {
        updateUserRole(userId: $userId, role: $role) {
            _id
            username
            email
            role
        }
    }
`;

export const DELETE_USER = gql`
    mutation deleteUser($userId: ObjectId!) {
        deleteUser(userId: $userId)
    }
`;

// ============================================
// PLAN MUTATIONS (Admin Only)
// ============================================

export const CREATE_PLAN = gql`
    mutation createPlan($plan: PlanInput!) {
        createPlan(plan: $plan) {
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
        }
    }
`;

export const UPDATE_PLAN = gql`
    mutation updatePlan($id: ObjectId!, $plan: PlanInput!) {
        updatePlan(id: $id, plan: $plan) {
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
        }
    }
`;

export const DELETE_PLAN = gql`
    mutation deletePlan($id: ObjectId!) {
        deletePlan(id: $id)
    }
`;

// ============================================
// ELEVATION MUTATIONS (Admin Only)
// ============================================

export const CREATE_ELEVATION = gql`
    mutation createElevation($elevation: ElevationInput!) {
        createElevation(elevation: $elevation) {
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

export const UPDATE_ELEVATION = gql`
    mutation updateElevation($id: ObjectId!, $elevation: ElevationInput!) {
        updateElevation(id: $id, elevation: $elevation) {
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
            updatedAt
        }
    }
`;

export const DELETE_ELEVATION = gql`
    mutation deleteElevation($id: ObjectId!) {
        deleteElevation(id: $id)
    }
`;

// ============================================
// STRUCTURAL MUTATIONS (Admin Only)
// ============================================

export const CREATE_STRUCTURAL = gql`
    mutation createStructural($structural: StructuralInput!) {
        createStructural(structural: $structural) {
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

export const UPDATE_STRUCTURAL = gql`
    mutation updateStructural($id: ObjectId!, $structural: StructuralInput!) {
        updateStructural(id: $id, structural: $structural) {
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
            updatedAt
        }
    }
`;

export const DELETE_STRUCTURAL = gql`
    mutation deleteStructural($id: ObjectId!) {
        deleteStructural(id: $id)
    }
`;

// ============================================
// INTERIOR OPTION MUTATIONS (Admin Only)
// ============================================

export const CREATE_INTERIOR_OPTION = gql`
    mutation createInteriorOption($input: InteriorOptionInput!) {
        createInteriorOption(input: $input) {
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

export const UPDATE_INTERIOR_OPTION = gql`
    mutation updateInteriorOption($id: ObjectId!, $input: InteriorOptionInput!) {
        updateInteriorOption(id: $id, input: $input) {
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
            updatedAt
        }
    }
`;

export const DELETE_INTERIOR_OPTION = gql`
    mutation deleteInteriorOption($id: ObjectId!) {
        deleteInteriorOption(id: $id)
    }
`;

// ============================================
// INTERIOR PACKAGE MUTATIONS (Admin Only)
// ============================================

export const CREATE_INTERIOR_PACKAGE = gql`
    mutation createInteriorPackage($input: InteriorPackageInput!) {
        createInteriorPackage(input: $input) {
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
        }
    }
`;

export const UPDATE_INTERIOR_PACKAGE = gql`
    mutation updateInteriorPackage($id: ObjectId!, $input: InteriorPackageUpdateInput!) {
        updateInteriorPackage(id: $id, input: $input) {
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
            updatedAt
        }
    }
`;

export const DELETE_INTERIOR_PACKAGE = gql`
    mutation deleteInteriorPackage($id: ObjectId!) {
        deleteInteriorPackage(id: $id)
    }
`;

// ============================================
// UTILITY MUTATIONS
// ============================================

export const RECALCULATE_PACKAGE_PRICE = gql`
    mutation recalculatePackagePrice($id: ObjectId!) {
        recalculatePackagePrice(id: $id) {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
        }
    }
`;

export const RECALCULATE_ALL_PACKAGE_PRICES = gql`
    mutation recalculateAllPackagePrices($planId: ObjectId!) {
        recalculateAllPackagePrices(planId: $planId) {
            _id
            name
            totalCost
            clientPrice
            markup
            minMarkup
        }
    }
`;

export const SET_BASE_PACKAGE = gql`
    mutation setBasePackage($id: ObjectId!) {
        setBasePackage(id: $id) {
            _id
            name
            basePackage
            planId
        }
    }
`;

// ============================================
// APPLIANCE MUTATIONS (Admin Only)
// ============================================

export const CREATE_APPLIANCE = gql`
    mutation createAppliance($appliance: ApplianceInput!) {
        createAppliance(appliance: $appliance) {
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

export const UPDATE_APPLIANCE = gql`
    mutation updateAppliance($id: ObjectId!, $appliance: ApplianceInput!) {
        updateAppliance(id: $id, appliance: $appliance) {
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
            updatedAt
        }
    }
`;

export const DELETE_APPLIANCE = gql`
    mutation deleteAppliance($id: ObjectId!) {
        deleteAppliance(id: $id) {
            _id
            name
        }
    }
`;

// ============================================
// ADDITIONAL OPTION MUTATIONS (Admin Only)
// ============================================

export const CREATE_ADDITIONAL = gql`
    mutation createAdditional($additional: AdditionalInput!) {
        createAdditional(additional: $additional) {
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

export const UPDATE_ADDITIONAL = gql`
    mutation updateAdditional($id: ObjectId!, $additional: AdditionalInput!) {
        updateAdditional(id: $id, additional: $additional) {
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
            updatedAt
        }
    }
`;

export const DELETE_ADDITIONAL = gql`
    mutation deleteAdditional($id: ObjectId!) {
        deleteAdditional(id: $id) {
            _id
            name
        }
    }
`;

// ============================================
// COLOR SCHEME MUTATIONS (Admin Only)
// ============================================

export const CREATE_COLOR_SCHEME = gql`
    mutation createColorScheme($colorScheme: ColorSchemeInput!) {
        createColorScheme(colorScheme: $colorScheme) {
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

export const UPDATE_COLOR_SCHEME = gql`
    mutation updateColorScheme($id: ObjectId!, $colorScheme: ColorSchemeInput!) {
        updateColorScheme(id: $id, colorScheme: $colorScheme) {
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
            updatedAt
        }
    }
`;

export const DELETE_COLOR_SCHEME = gql`
    mutation deleteColorScheme($id: ObjectId!) {
        deleteColorScheme(id: $id) {
            _id
            name
        }
    }
`;

// ============================================
// LOT MUTATIONS (Admin Only)
// ============================================

export const CREATE_LOT = gql`
    mutation createLot($lot: LotInput!) {
        createLot(lot: $lot) {
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

export const UPDATE_LOT = gql`
    mutation updateLot($id: ObjectId!, $lot: LotInput!) {
        updateLot(id: $id, lot: $lot) {
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
            updatedAt
        }
    }
`;

export const DELETE_LOT = gql`
    mutation deleteLot($id: ObjectId!) {
        deleteLot(id: $id) {
            _id
            filing
            lot
        }
    }
`;

// ============================================
// LOT PRICING MUTATIONS (Admin Only)
// ============================================

export const CREATE_LOT_PRICING = gql`
    mutation createLotPricing($lotPricing: LotPricingInput!) {
        createLotPricing(lotPricing: $lotPricing) {
            _id
            lotPremium
            isActive
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_LOT_PRICING = gql`
    mutation updateLotPricing($id: ObjectId!, $lotPricing: LotPricingInput!) {
        updateLotPricing(id: $id, lotPricing: $lotPricing) {
            _id
            lotPremium
            isActive
            updatedAt
        }
    }
`;

export const DELETE_LOT_PRICING = gql`
    mutation deleteLotPricing($id: ObjectId!) {
        deleteLotPricing(id: $id) {
            _id
            lotPremium
        }
    }
`;

// ============================================
// USER PLAN MUTATIONS
// ============================================

export const CREATE_USER_PLAN = gql`
    mutation createUserPlan($userPlan: UserPlanInput!) {
        createUserPlan(userPlan: $userPlan) {
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
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_USER_PLAN = gql`
    mutation updateUserPlan($id: ObjectId!, $userPlan: UserPlanInput!) {
        updateUserPlan(id: $id, userPlan: $userPlan) {
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
            updatedAt
        }
    }
`;

export const DELETE_USER_PLAN = gql`
    mutation deleteUserPlan($id: ObjectId!) {
        deleteUserPlan(id: $id)
    }
`;

export const DUPLICATE_USER_PLAN = gql`
    mutation duplicateUserPlan($id: ObjectId!, $newConfigurationName: String!) {
        duplicateUserPlan(id: $id, newConfigurationName: $newConfigurationName) {
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
        }
    }
`;

// ============================================
// PLAN-OPTION RELATIONSHIP MUTATIONS (Admin Only)
// ============================================

// Elevation
export const ADD_ELEVATION_TO_PLAN = gql`
    mutation addElevationToPlan($planId: ObjectId!, $elevationId: ID!) {
        addElevationToPlan(planId: $planId, elevationId: $elevationId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_ELEVATION_FROM_PLAN = gql`
    mutation removeElevationFromPlan($planId: ObjectId!, $elevationId: ID!) {
        removeElevationFromPlan(planId: $planId, elevationId: $elevationId) {
            _id
            planType
            name
        }
    }
`;

// Structural
export const ADD_STRUCTURAL_TO_PLAN = gql`
    mutation addStructuralToPlan($planId: ObjectId!, $structuralId: ID!) {
        addStructuralToPlan(planId: $planId, structuralId: $structuralId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_STRUCTURAL_FROM_PLAN = gql`
    mutation removeStructuralFromPlan($planId: ObjectId!, $structuralId: ID!) {
        removeStructuralFromPlan(planId: $planId, structuralId: $structuralId) {
            _id
            planType
            name
        }
    }
`;

// Interior Option
export const ADD_INTERIOR_OPTION_TO_PLAN = gql`
    mutation addInteriorOptionToPlan($planId: ObjectId!, $interiorOptionId: ID!) {
        addInteriorOptionToPlan(planId: $planId, interiorOptionId: $interiorOptionId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_INTERIOR_OPTION_FROM_PLAN = gql`
    mutation removeInteriorOptionFromPlan($planId: ObjectId!, $interiorOptionId: ID!) {
        removeInteriorOptionFromPlan(planId: $planId, interiorOptionId: $interiorOptionId) {
            _id
            planType
            name
        }
    }
`;

// Interior Package
export const ADD_INTERIOR_PACKAGE_TO_PLAN = gql`
    mutation addInteriorPackageToPlan($planId: ObjectId!, $interiorPackageId: ObjectId!) {
        addInteriorPackageToPlan(planId: $planId, interiorPackageId: $interiorPackageId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_INTERIOR_PACKAGE_FROM_PLAN = gql`
    mutation removeInteriorPackageFromPlan($planId: ObjectId!, $interiorPackageId: ObjectId!) {
        removeInteriorPackageFromPlan(planId: $planId, interiorPackageId: $interiorPackageId) {
            _id
            planType
            name
        }
    }
`;

// Appliance
export const ADD_APPLIANCE_TO_PLAN = gql`
    mutation addApplianceToPlan($planId: ObjectId!, $applianceId: ObjectId!) {
        addApplianceToPlan(planId: $planId, applianceId: $applianceId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_APPLIANCE_FROM_PLAN = gql`
    mutation removeApplianceFromPlan($planId: ObjectId!, $applianceId: ObjectId!) {
        removeApplianceFromPlan(planId: $planId, applianceId: $applianceId) {
            _id
            planType
            name
        }
    }
`;

// Additional
export const ADD_ADDITIONAL_TO_PLAN = gql`
    mutation addAdditionalToPlan($planId: ObjectId!, $additionalId: ObjectId!) {
        addAdditionalToPlan(planId: $planId, additionalId: $additionalId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_ADDITIONAL_FROM_PLAN = gql`
    mutation removeAdditionalFromPlan($planId: ObjectId!, $additionalId: ObjectId!) {
        removeAdditionalFromPlan(planId: $planId, additionalId: $additionalId) {
            _id
            planType
            name
        }
    }
`;

// Color Scheme
export const ADD_COLOR_SCHEME_TO_PLAN = gql`
    mutation addColorSchemeToPlan($planId: ObjectId!, $colorSchemeId: ObjectId!) {
        addColorSchemeToPlan(planId: $planId, colorSchemeId: $colorSchemeId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_COLOR_SCHEME_FROM_PLAN = gql`
    mutation removeColorSchemeFromPlan($planId: ObjectId!, $colorSchemeId: ObjectId!) {
        removeColorSchemeFromPlan(planId: $planId, colorSchemeId: $colorSchemeId) {
            _id
            planType
            name
        }
    }
`;

// Lot Pricing
export const ADD_LOT_PRICING_TO_PLAN = gql`
    mutation addLotPricingToPlan($planId: ObjectId!, $lotPricingId: ObjectId!) {
        addLotPricingToPlan(planId: $planId, lotPricingId: $lotPricingId) {
            _id
            planType
            name
        }
    }
`;

export const REMOVE_LOT_PRICING_FROM_PLAN = gql`
    mutation removeLotPricingFromPlan($planId: ObjectId!, $lotPricingId: ObjectId!) {
        removeLotPricingFromPlan(planId: $planId, lotPricingId: $lotPricingId) {
            _id
            planType
            name
        }
    }
`;
