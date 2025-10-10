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
    

    # Plan-specific option types
    type Elevation {
        _id: ID!
        name: String!
        totalCost: Float!
        clientPrice: Float!
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        planId: ID!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type Structural {
        _id: ID!
        name: String!
        totalCost: Float!
        clientPrice: Float!
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        planId: ID!
        classification: String!
        garage: Int
        bedrooms: Int
        bathrooms: Float
        width: Int
        length: Int
        totalSqft: Int
        resSqft: Int
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type InteriorOption {
        _id: ID
        name: String!
        brand: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float!
        classification: String!
        material: String!
        tier: String
        cabinetOverlay: String
        planId: ID!
        img: String
        isActive: Boolean!
        sortOrder: Int
        createdAt: String
        updatedAt: String
    }

    type InteriorPackage {
        _id: ID!
        name: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float!
        description: String
        img: String
        planId: ID!
        fixtures: [InteriorOption]
        lvp: InteriorOption
        carpet: InteriorOption
        backsplash: InteriorOption
        masterBathTile: InteriorOption
        countertop: InteriorOption
        primaryCabinets: InteriorOption
        secondaryCabinets: InteriorOption
        cabinetHardware: InteriorOption
        softClose: Boolean!
        basePackage: Boolean!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type Appliance {
        _id: ID!
        name: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float!
        classification: String!
        type: String!
        brand: String!
        img: String
        planId: ID!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type Additional {
        _id: ID!
        name: String!
        totalCost: Float!
        clientPrice: Float!
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        classification: String!
        planId: ID!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type Lot {
        _id: ID!
        filing: Int!
        lot: Int!
        width: Int!
        length: Int!
        lotSqft: Int!
        streetNumber: String!
        streetName: String!
        garageDir: String!
        parcelNumber: String!
        notes: String
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type LotPricing {
        _id: ID!
        lot: Lot!
        plan: Plan!
        lotPremium: Float!
        isActive: Boolean!
        createdAt: String
        updatedAt: String
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
        classification: String!
        planId: ID!
        description: String
        price: Float!
        primaryName: String!
        primaryCode: String!
        secondaryName: String
        secondaryCode: String
        trimName: String!
        trimCode: String!
        shingleBrand: String!
        shingleColor: String!
        stone: Boolean
        stoneColor: String
        colorSchemeImg: String
        isActive: Boolean!
        sortOrder: Int
        createdAt: String
        updatedAt: String
    }
    
    type Plan {
        _id: ID!
        planType: Int!
        name: String!
        bedrooms: Int!
        bathrooms: Float!
        totalSqft: Int!
        resSqft: Int!
        garage: Int!
        basePrice: Float!
        description: String
        elevations: [Elevation]
        colorScheme: [ColorScheme]
        interiors: [InteriorOption]
        structural: [Structural]
        additional: [Additional]
        kitchenAppliance: [Appliance]
        laundryAppliance: [Appliance]
        lotPremium: [LotPricing]
        width: Int!
        length: Int!
        garageSqft: Int
        pricePerSqft: Float
        isActive: Boolean!
        createdAt: String
        updatedAt: String
    }
    
    type UserHome {
        _id: ID!
        userId: ID!
        plan: ID!
        configurationName: String!
        elevation: Elevation
        colorScheme: ColorScheme
        interiorPackage: InteriorPackage
        kitchenAppliance: Appliance
        laundryAppliance: Appliance
        lot: LotPricing
        structuralOptions: [Structural]
        additionalOptions: [Additional]
        basePlanPrice: Float
        optionsTotalPrice: Float
        totalPrice: Float
        status: String!
        isActive: Boolean!
        submittedAt: String
        contractedAt: String
        notes: String
        customerNotes: String
        createdAt: String
        updatedAt: String
    }
    
    type Auth {
        token: ID!
        user: User
    }

    # Union type for plan option search results
    union PlanOption = PlanElevationOption | PlanStructuralOption | PlanInteriorOption | PlanApplianceOption | PlanAdditionalOption | PlanLotPremium

    type Query {
        me: User
        user(id: ID, username: String): User
        plans: [Plan]
        plan(id: ID!): Plan
        planByType(planType: Int!): Plan
        userHomes: [UserHome]
        userHome(id: ID!): UserHome
        options: [Option]
        elevationOptions: [Option]
        interiorOptions: [InteriorOption]
        appliances: [Appliance]
        structuralOptions: [Structural]
        colorSchemes: [ColorScheme]
        interiorPackages: [InteriorPackage]
        lotPremiums: [LotPremium]
        
        # Plan-specific option queries (for browsing across all plans)
        allPlanElevations: [PlanElevationOption!]!
        allPlanStructural: [PlanStructuralOption!]!
        allPlanInteriors: [PlanInteriorOption!]!
        allPlanAppliances: [PlanApplianceOption!]!
        allPlanAdditional: [PlanAdditionalOption!]!
        allPlanLots: [PlanLotPremium!]!
        
        # Search plan options across all plans
        searchPlanOptions(query: String!, type: String!): [PlanOption!]!
        
        # Get options for a specific plan
        planOptions(planId: ID!, optionType: String!): [PlanOption!]!
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
        
        # Plan-specific option management mutations
        addElevationToPlan(planId: ID!, elevation: PlanElevationOptionInput!): Plan
        updatePlanElevation(planId: ID!, elevationId: ID!, elevation: PlanElevationOptionInput!): Plan
        removePlanElevation(planId: ID!, elevationId: ID!): Plan
        
        addStructuralToPlan(planId: ID!, structural: PlanStructuralOptionInput!): Plan
        updatePlanStructural(planId: ID!, structuralId: ID!, structural: PlanStructuralOptionInput!): Plan
        removePlanStructural(planId: ID!, structuralId: ID!): Plan
        
        addInteriorToPlan(planId: ID!, interior: PlanInteriorOptionInput!): Plan
        updatePlanInterior(planId: ID!, interiorId: ID!, interior: PlanInteriorOptionInput!): Plan
        removePlanInterior(planId: ID!, interiorId: ID!): Plan
        
        addApplianceToPlan(planId: ID!, appliance: PlanApplianceOptionInput!): Plan
        updatePlanAppliance(planId: ID!, applianceId: ID!, appliance: PlanApplianceOptionInput!): Plan
        removePlanAppliance(planId: ID!, applianceId: ID!): Plan
        
        addAdditionalToPlan(planId: ID!, additional: PlanAdditionalOptionInput!): Plan
        updatePlanAdditional(planId: ID!, additionalId: ID!, additional: PlanAdditionalOptionInput!): Plan
        removePlanAdditional(planId: ID!, additionalId: ID!): Plan
        
        addLotToPlan(planId: ID!, lot: PlanLotPremiumInput!): Plan
        updatePlanLot(planId: ID!, lotId: ID!, lot: PlanLotPremiumInput!): Plan
        removePlanLot(planId: ID!, lotId: ID!): Plan
        
        # Bulk operations
        reorderPlanOptions(planId: ID!, optionType: String!, optionIds: [ID!]!): Plan
        copyOptionsFromPlan(sourcePlanId: ID!, targetPlanId: ID!, optionTypes: [String!]!): Plan
        
        # Appliance mutations (admin only)
        createAppliance(appliance: ApplianceInput!): Appliance
        updateAppliance(id: ID!, appliance: ApplianceInput!): Appliance
        deleteAppliance(id: ID!): Appliance
        
        # Structural mutations (admin only)
        createStructural(structural: StructuralInput!): Structural
        updateStructural(id: ID!, structural: StructuralInput!): Structural
        deleteStructural(id: ID!): Structural
        
        # InteriorOption mutations (admin only)
        createInteriorOption(interiorOption: InteriorOptionInput!): InteriorOption
        updateInteriorOption(id: ID!, interiorOption: InteriorOptionInput!): InteriorOption
        deleteInteriorOption(id: ID!): InteriorOption
    }

    input OptionInput {
        name: String!
        price: Float!
        classification: String
        planType: Int!
        description: String
        img: String
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
        planType: Int
        totalPrice: Float
        clientPrice: Float
        fixtures: [ID]
        lvp: [ID]
        carpet: [ID]
        backsplash: [ID]
        masterBathTile: [ID]
        countertop: [ID]
        primaryCabinets: [ID]
        secondaryCabinets: [ID]
        upgrade: Boolean!
        basePackage: Boolean!
        isActive: Boolean
    }
    
    input LotPremiumInput {
        filing: Int!
        lot: Int!
        width: Int!
        length: Int!
        lotSqft: Int
        premium: Float!
        address: String!
        parcelNumber: String!
    }
    
    # Input types for plan-specific options
    input PlanElevationOptionInput {
        name: String!
        price: Float!
        description: String
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input PlanStructuralOptionInput {
        name: String!
        price: Float!
        description: String
        img: String
        garage: Int
        bedrooms: Int
        bathrooms: Float
        width: Int
        length: Int
        totalSqft: Int
        resSqft: Int
        isActive: Boolean
        sortOrder: Int
    }

    input PlanInteriorOptionInput {
        name: String!
        totalPrice: Float!
        clientPrice: Float
        description: String
        img: String
        fixtures: [String!]
        lvp: [String!]
        carpet: [String!]
        backsplash: [String!]
        masterBathTile: [String!]
        countertop: [String!]
        primaryCabinets: [String!]
        secondaryCabinets: [String!]
        upgrade: Boolean
        basePackage: Boolean
        isActive: Boolean
        sortOrder: Int
    }

    input PlanApplianceOptionInput {
        name: String!
        price: Float!
        type: String!
        description: String
        img: String
        brand: String
        model: String
        appliances: [String!]!
        isActive: Boolean
        sortOrder: Int
    }

    input PlanAdditionalOptionInput {
        name: String!
        price: Float!
        description: String
        img: String
        category: String
        isActive: Boolean
        sortOrder: Int
    }

    input PlanLotPremiumInput {
        filing: Int!
        lot: Int!
        width: Int!
        length: Int!
        lotSqft: Int!
        premium: Float!
        address: String!
        parcelNumber: String!
        description: String
        features: [String!]
        isActive: Boolean
        sortOrder: Int
    }

    input PlanInput {
        planType: Int!
        name: String!
        bedrooms: Int!
        bathrooms: Float!
        totalSqft: Int!
        resSqft: Int!
        garage: Int!
        basePrice: Float!
        description: String
        elevations: [PlanElevationOptionInput!]
        colorScheme: [ID]
        interiors: [PlanInteriorOptionInput!]
        structural: [PlanStructuralOptionInput!]
        additional: [PlanAdditionalOptionInput!]
        kitchenAppliance: [PlanApplianceOptionInput!]
        laundryAppliance: [PlanApplianceOptionInput!]
        lotPremium: [PlanLotPremiumInput!]
        width: Int!
        length: Int!
    }
    
    input UserHomeInput {
        plan: ID!
        configurationName: String
        elevation: ID!
        colorScheme: ID!
        interiorPackage: ID!
        kitchenAppliance: ID!
        laundryAppliance: ID
        lotPremium: ID
        structuralOptions: [ID!]
        additionalOptions: [ID!]
        status: String
        isActive: Boolean
        notes: String
        customerNotes: String
    }

    input InteriorOptionInput {
        name: String!
        price: Float!
        classification: String!
        planType: Int!
        description: String
        img: String
        material: String!
    }

    input ApplianceInput {
        name: String!
        price: Float!
        classification: String!
        type: String!
        description: String
        img: String
    }

    input StructuralInput {
        name: String!
        price: Float!
        classification: String!
        planType: Int!
        description: String
        img: String
        garage: Int
        bedrooms: Int
        bathrooms: Float
        width: Int!
        length: Int!
        totalSqft: Int
        resSqft: Int
    }
`

export default typeDefs;