import { gql } from '@apollo/client';

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

export const ADD_USER = gql`
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

export const SAVE_USER_HOME = gql`
    mutation saveUserHome($userHome: UserHomeInput!) {
        saveUserHome(userHome: $userHome) {
            _id
            username
            homeCount
            savedHomes {
                _id
                planTypeName
                basePrice
                totalPrice
            }
        }
    }
`;

export const SAVE_USER_HOME_PROGRESS = gql`
    mutation saveUserHomeProgress($userHome: UserHomeInput!, $isComplete: Boolean!) {
        saveUserHomeProgress(userHome: $userHome, isComplete: $isComplete) {
            _id
            planTypeId
            planTypeName
            basePrice
            totalPrice
            isComplete
            lastModified
        }
    }
`;

export const UPDATE_USER_HOME = gql`
    mutation updateUserHome($id: ID!, $userHome: UserHomeInput!) {
        updateUserHome(id: $id, userHome: $userHome) {
            _id
            planTypeName
            basePrice
            totalPrice
            elevation {
                name
                price
            }
            interior {
                name
                totalPrice
            }
            kitchenAppliance {
                name
                price
            }
            laundryAppliance {
                name
                price
            }
            lotPremium {
                filing
                lot
                price
            }
        }
    }
`;

export const DELETE_USER_HOME = gql`
    mutation deleteUserHome($id: ID!) {
        deleteUserHome(id: $id) {
            _id
            username
            homeCount
            savedHomes {
                _id
                planTypeName
            }
        }
    }
`;

// Admin mutations for CRUD operations
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
            elevations {
                _id
                name
                price
                description
                img
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

export const UPDATE_PLAN = gql`
    mutation updatePlan($id: ID!, $plan: PlanInput!) {
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
            elevations {
                _id
                name
                price
                description
                img
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

export const DELETE_PLAN = gql`
    mutation deletePlan($id: ID!) {
        deletePlan(id: $id) {
            _id
            name
            planType
        }
    }
`;

export const CREATE_OPTION = gql`
    mutation createOption($option: OptionInput!) {
        createOption(option: $option) {
            _id
            name
            price
            classification
            description
            img
        }
    }
`;

export const UPDATE_OPTION = gql`
    mutation updateOption($id: ID!, $option: OptionInput!) {
        updateOption(id: $id, option: $option) {
            _id
            name
            price
            classification
            description
            img
        }
    }
`;

export const DELETE_OPTION = gql`
    mutation deleteOption($id: ID!) {
        deleteOption(id: $id) {
            _id
            name
            classification
        }
    }
`;

export const CREATE_INTERIOR_PACKAGE = gql`
    mutation createInteriorPackage($interiorPackage: InteriorPackageInput!) {
        createInteriorPackage(interiorPackage: $interiorPackage) {
            _id
            name
            totalPrice
            fixtures {
                _id
                name
                price
                classification
                description
                img
            }
            lvp {
                _id
                name
                price
                classification
                description
                img
            }
            carpet {
                _id
                name
                price
                classification
                description
                img
            }
            backsplash {
                _id
                name
                price
                classification
                description
                img
            }
            masterBathTile {
                _id
                name
                price
                classification
                description
                img
            }
            countertop {
                _id
                name
                price
                classification
                description
                img
            }
            primaryCabinets {
                _id
                name
                price
                classification
                description
                img
            }
            secondaryCabinets {
                _id
                name
                price
                classification
                description
                img
            }
            upgrade
        }
    }
`;

export const UPDATE_INTERIOR_PACKAGE = gql`
    mutation updateInteriorPackage($id: ID!, $interiorPackage: InteriorPackageInput!) {
        updateInteriorPackage(id: $id, interiorPackage: $interiorPackage) {
            _id
            name
            totalPrice
            fixtures {
                _id
                name
                price
                classification
                description
                img
            }
            lvp {
                _id
                name
                price
                classification
                description
                img
            }
            carpet {
                _id
                name
                price
                classification
                description
                img
            }
            backsplash {
                _id
                name
                price
                classification
                description
                img
            }
            masterBathTile {
                _id
                name
                price
                classification
                description
                img
            }
            countertop {
                _id
                name
                price
                classification
                description
                img
            }
            primaryCabinets {
                _id
                name
                price
                classification
                description
                img
            }
            secondaryCabinets {
                _id
                name
                price
                classification
                description
                img
            }
            upgrade
        }
    }
`;

export const DELETE_INTERIOR_PACKAGE = gql`
    mutation deleteInteriorPackage($id: ID!) {
        deleteInteriorPackage(id: $id) {
            _id
            name
        }
    }
`;

export const CREATE_LOT_PREMIUM = gql`
    mutation createLotPremium($lotPremium: LotPremiumInput!) {
        createLotPremium(lotPremium: $lotPremium) {
            _id
            filing
            lot
            width
            length
            price
        }
    }
`;

export const UPDATE_LOT_PREMIUM = gql`
    mutation updateLotPremium($id: ID!, $lotPremium: LotPremiumInput!) {
        updateLotPremium(id: $id, lotPremium: $lotPremium) {
            _id
            filing
            lot
            width
            length
            price
        }
    }
`;

export const DELETE_LOT_PREMIUM = gql`
    mutation deleteLotPremium($id: ID!) {
        deleteLotPremium(id: $id) {
            _id
            filing
            lot
        }
    }
`;

export const CREATE_COLOR_SCHEME = gql`
    mutation createColorScheme($colorScheme: ColorSchemeInput!) {
        createColorScheme(colorScheme: $colorScheme) {
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
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_COLOR_SCHEME = gql`
    mutation updateColorScheme($id: ID!, $colorScheme: ColorSchemeInput!) {
        updateColorScheme(id: $id, colorScheme: $colorScheme) {
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
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_COLOR_SCHEME = gql`
    mutation deleteColorScheme($id: ID!) {
        deleteColorScheme(id: $id) {
            _id
            name
        }
    }
`;