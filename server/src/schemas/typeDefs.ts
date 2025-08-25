import { gql } from 'graphql-tag';

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        role: String!
        homeCount: Int
        savedHomes: [UserHome]
    }
    
    type Option {
        _id: ID
        name: String!
        price: Float!
        classification: String
        description: String
        img: String
        width: Int
        length: Int
        svgPath: String
        supportsColorSchemes: Boolean
    }
    
    type ColorValues {
        primary: String!
        secondary: String!
        roof: String!
        accent: String!
        foundation: String
    }
    
    type ColorScheme {
        _id: ID!
        name: String!
        description: String
        price: Float!
        colorValues: ColorValues!
        isActive: Boolean!
        sortOrder: Int
        createdAt: String
        updatedAt: String
    }
    
    type InteriorPackage {
        _id: ID
        name: String!
        totalPrice: Float!
        fixtures: [Option]
        lvp: [Option]
        carpet: [Option]
        backsplash: [Option]
        masterBathTile: [Option]
        countertop: [Option]
        primaryCabinets: [Option]
        secondaryCabinets: [Option]
        upgrade: Boolean
    }
    
    type LotPremium {
        _id: ID
        filing: Int!
        lot: Int!
        width: Int!
        length: Int!
        price: Float!
    }
    
    type Plan {
        _id: ID!
        planType: Int!
        name: String!
        bedrooms: Int!
        bathrooms: Float!
        squareFootage: Int!
        garageType: String!
        basePrice: Float!
        description: String
        elevations: [Option]
        colorScheme: [ColorScheme]
        interiors: [InteriorPackage]
        structural: [Option]
        additional: [Option]
        kitchenAppliance: [Option]
        laundryAppliance: [Option]
        lotPremium: [LotPremium]
        width: Int!
        length: Int!
    }
    
    type UserHome {
        _id: ID!
        userId: ID!
        planTypeId: ID!
        planTypeName: String!
        basePrice: Float!
        elevation: Option
        colorScheme: ColorScheme
        interior: InteriorPackage
        structural: [Option]
        additional: [Option]
        kitchenAppliance: Option
        laundryAppliance: Option
        width: Int!
        length: Int!
        lotPremium: LotPremium
        totalPrice: Float
        createdAt: String
        updatedAt: String
    }
    
    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        user(id: ID, username: String): User
        plans: [Plan]
        plan(id: ID!): Plan
        planByType(planType: Int!): Plan
        userHomes: [UserHome]
        userHome(id: ID!): UserHome
        options: [Option]
        colorSchemes: [ColorScheme]
        interiorPackages: [InteriorPackage]
        lotPremiums: [LotPremium]
    }

    type Mutation {
        # Auth mutations
        login(email: String!, password: String!): Auth
        createUser(username: String!, email: String!, password: String!): Auth
        
        # Plan mutations (admin only)
        createPlan(plan: PlanInput!): Plan
        updatePlan(id: ID!, plan: PlanInput!): Plan
        deletePlan(id: ID!): Plan
        
        # Option mutations (admin only)
        createOption(option: OptionInput!): Option
        updateOption(id: ID!, option: OptionInput!): Option
        deleteOption(id: ID!): Option
        
        # Color Scheme mutations (admin only)
        createColorScheme(colorScheme: ColorSchemeInput!): ColorScheme
        updateColorScheme(id: ID!, colorScheme: ColorSchemeInput!): ColorScheme
        deleteColorScheme(id: ID!): ColorScheme
        
        # Interior Package mutations (admin only)
        createInteriorPackage(interiorPackage: InteriorPackageInput!): InteriorPackage
        updateInteriorPackage(id: ID!, interiorPackage: InteriorPackageInput!): InteriorPackage
        deleteInteriorPackage(id: ID!): InteriorPackage
        
        # Lot Premium mutations (admin only)
        createLotPremium(lotPremium: LotPremiumInput!): LotPremium
        updateLotPremium(id: ID!, lotPremium: LotPremiumInput!): LotPremium
        deleteLotPremium(id: ID!): LotPremium
        
        # User Home mutations
        saveUserHome(userHome: UserHomeInput!): User
        updateUserHome(id: ID!, userHome: UserHomeInput!): UserHome
        deleteUserHome(id: ID!): User
    }

    input OptionInput {
        name: String!
        price: Float!
        classification: String
        description: String
        img: String
        width: Int
        length: Int
        svgPath: String
        supportsColorSchemes: Boolean
    }
    
    input ColorValuesInput {
        primary: String!
        secondary: String!
        roof: String!
        accent: String!
        foundation: String
    }
    
    input ColorSchemeInput {
        name: String!
        description: String
        price: Float!
        colorValues: ColorValuesInput!
        isActive: Boolean
        sortOrder: Int
    }
    
    input InteriorPackageInput {
        name: String!
        totalPrice: Float!
        fixtures: [OptionInput]
        lvp: [OptionInput]
        carpet: [OptionInput]
        backsplash: [OptionInput]
        masterBathTile: [OptionInput]
        countertop: [OptionInput]
        primaryCabinets: [OptionInput]
        secondaryCabinets: [OptionInput]
        upgrade: Boolean
    }
    
    input LotPremiumInput {
        filing: Int!
        lot: Int!
        width: Float!
        length: Float!
        price: Float!
    }
    
    input PlanInput {
        planType: Int!
        name: String!
        bedrooms: Int!
        bathrooms: Float!
        squareFootage: Int!
        garageType: String!
        basePrice: Float!
        description: String
        elevations: [OptionInput]
        colorScheme: [ColorSchemeInput]
        interiors: [InteriorPackageInput]
        structural: [OptionInput]
        additional: [OptionInput]
        kitchenAppliance: [OptionInput]
        laundryAppliance: [OptionInput]
        lotPremium: [LotPremiumInput]
        width: Int!
        length: Int!
    }
    
    input UserHomeInput {
        planTypeId: ID!
        planTypeName: String!
        basePrice: Float!
        elevation: OptionInput
        colorScheme: ColorSchemeInput
        interior: InteriorPackageInput
        structural: [OptionInput]
        additional: [OptionInput]
        kitchenAppliance: OptionInput
        laundryAppliance: OptionInput
        lotPremium: LotPremiumInput
    }
`

export default typeDefs;