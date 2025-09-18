import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            role
            homeCount
            savedHomes {
                _id
                planTypeId
                planTypeName
                basePrice
                elevation {
                    _id
                    name
                    price
                    classification
                    description
                    img
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
                interior {
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
                structural {
                    _id
                    name
                    price
                    classification
                    description
                    img
                }
                additional {
                    _id
                    name
                    price
                    classification
                    description
                    img
                }
                kitchenAppliance {
                    _id
                    name
                    price
                    classification
                    description
                    img
                }
                laundryAppliance {
                    _id
                    name
                    price
                    classification
                    description
                    img
                }
                lotPremium {
                    _id
                    filing
                    lot
                    width
                    length
                    price
                }
                totalPrice
                createdAt
                updatedAt
            }
        }
    }
`;

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
            elevations {
                name
                price
                classification
                description
                img
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
            structural {
                name
                price
                classification
                description
                img
                width
                length
            }
            additional {
                name
                price
                classification
                description
                img
            }
            kitchenAppliance {
                name
                price
                classification
                description
                img
            }
            laundryAppliance {
                name
                price
                classification
                description
                img
            }
            lotPremium {
                _id
                filing
                lot
                width
                length
                price
            }
        }
    }
`;

export const GET_PLAN = gql`
    query getPlan($id: ID!) {
        plan(id: $id) {
            _id
            planType
            name
            basePrice
            elevations {
                name
                price
                classification
                description
                img
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
            structural {
                name
                price
                classification
                description
                img
                width
                length
            }
            additional {
                name
                price
                classification
                description
                img
            }
            kitchenAppliance {
                name
                price
                classification
                description
                img
            }
            laundryAppliance {
                name
                price
                classification
                description
                img
            }
            lotPremium {
                _id
                filing
                lot
                width
                length
                price
            }
        }
    }
`;

export const GET_OPTIONS = gql`
    query getOptions {
        options {
            _id
            name
            price
            classification
            description
            img
        }
    }
`;

export const GET_INTERIOR_PACKAGES = gql`
    query getInteriorPackages {
        interiorPackages {
            _id
            name
            totalPrice
            fixtures {
                name
                price
                classification
                description
                img
            }
            lvp {
                name
                price
                classification
                description
                img
            }
            carpet {
                name
                price
                classification
                description
                img
            }
            backsplash {
                name
                price
                classification
                description
                img
            }
            masterBathTile {
                name
                price
                classification
                description
                img
            }
            countertop {
                name
                price
                classification
                description
                img
            }
            primaryCabinets {
                name
                price
                classification
                description
                img
            }
            secondaryCabinets {
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

export const GET_LOT_PREMIUMS = gql`
    query getLotPremiums {
        lotPremiums {
            _id
            filing
            lot
            width
            length
            price
        }
    }
`;

export const GET_COLOR_SCHEMES = gql`
    query getColorSchemes {
        colorSchemes {
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