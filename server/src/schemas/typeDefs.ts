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
    }
    
    type InteriorPackage {
        _id: ID
        name: String!
        totalPrice: Float!
        options: [Option]
    }
    
    type LotPremium {
        _id: ID
        name: String!
        price: Float!
        description: String
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
        colorScheme: [Int]
        interiors: [InteriorPackage]
        structural: [Option]
        additional: [Option]
        kitchenAppliance: [Option]
        laundryAppliance: [Option]
        lotPremium: [LotPremium]
    }
    
    type UserHome {
        _id: ID!
        userId: ID!
        planTypeId: ID!
        planTypeName: String!
        basePrice: Float!
        elevation: Option
        colorScheme: Int!
        interior: InteriorPackage
        structural: [Option]
        additional: [Option]
        kitchenAppliance: Option
        laundryAppliance: Option
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
    }
    
    input InteriorPackageInput {
        name: String!
        totalPrice: Float!
        options: [OptionInput]
    }
    
    input LotPremiumInput {
        name: String!
        price: Float!
        description: String
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
        colorScheme: [Int]
        interiors: [InteriorPackageInput]
        structural: [OptionInput]
        additional: [OptionInput]
        kitchenAppliance: [OptionInput]
        laundryAppliance: [OptionInput]
        lotPremium: [LotPremiumInput]
    }
    
    input UserHomeInput {
        planTypeId: ID!
        planTypeName: String!
        basePrice: Float!
        elevation: OptionInput
        colorScheme: Int!
        interior: InteriorPackageInput
        structural: [OptionInput]
        additional: [OptionInput]
        kitchenAppliance: OptionInput
        laundryAppliance: OptionInput
        lotPremium: LotPremiumInput
    }
`

export default typeDefs;