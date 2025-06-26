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

// Admin mutations (for future use)
export const CREATE_PLAN = gql`
    mutation createPlan($plan: PlanInput!) {
        createPlan(plan: $plan) {
            _id
            planType
            name
            basePrice
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
        }
    }
`;

export const CREATE_INTERIOR_PACKAGE = gql`
    mutation createInteriorPackage($interiorPackage: InteriorPackageInput!) {
        createInteriorPackage(interiorPackage: $interiorPackage) {
            _id
            name
            totalPrice
        }
    }
`;

export const CREATE_LOT_PREMIUM = gql`
    mutation createLotPremium($lotPremium: LotPremiumInput!) {
        createLotPremium(lotPremium: $lotPremium) {
            _id
            filing
            lot
            price
        }
    }
`;