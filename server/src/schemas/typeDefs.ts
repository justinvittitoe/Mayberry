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
        color: String!
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
    union SearchResult = Elevation | Structural | InteriorOption | InteriorPackage | Appliance | Additional | ColorScheme | Lot | LotPricing

    type Query {
        #User queries
        me: User
        user(id: ID, username: String): User

        #Plan queries
        plans: [Plan]
        plan(id: ID!): Plan
        planByType(planType: Int!): Plan

        #User home queries
        userHomes(userId: ID): [UserHome]
        userHome(id: ID!): UserHome

        #Option queries (all options across all plans)
        elevationOptions: [Elevation]
        interiorPackages: [InteriorPackage]
        interiorOptions: [InteriorOption]
        structuralOptions: [Structural]
        additional: [Additional]
        appliances: [Appliance]
        colorSchemes: [ColorScheme]
        lots: [Lot]
        lotPricing: [LotPricing]
        
        # Plan-specific option queries (for browsing across all plans)
        planElevations(planId: ID!): [Elevation]
        planStructural(planId: ID!): [Structural]
        planInteriorOptions(planId: ID!): [InteriorOption]
        planInteriorPackages(planId: ID!): [InteriorPackage]
        planAppliances(planId: ID!): [Appliance]
        planAdditional(planId: ID!): [Additional]
        planColorSchemes(planId: ID!): [ColorScheme]
        planLotPricing(planId: ID!): [LotPricing]
        
        # Search plan options across all plans
        searchOptions(query: String!, type: String!): [SearchResult]
        
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
        # Elevation Options
        createElevation(elevation: ElevationInput!): Elevation
        updateElevation(id: ID!, elevation: ElevationInput!): Elevation
        deleteElevation(id: ID!): Elevation

        # Structural Options
        createStructural(structural: StructuralInput!): Structural
        updateStructural(id: ID!, structural: StructuralInput!): Structural
        deleteStructural(id: ID!): Structural

        # Interior Options
        createInteriorOption(interiorOption: InteriorOptionInput!): InteriorOption
        updateInteriorOption(id: ID!, interiorOption: InteriorOptionInput!): InteriorOption
        deleteInteriorOption(id: ID!): InteriorOption

        # Interior Package Options
        createInteriorPackage(interiorPackage: InteriorPackageInput!): InteriorPackage
        updateInteriorPackage(id: ID!, interiorPackage: InteriorPackageInput!): InteriorPackage
        deleteInteriorPackage(id: ID!): InteriorPackage

        # Appliance Options
        createAppliance(appliance: ApplianceInput!): Appliance
        updateAppliance(id: ID!, appliance: ApplianceInput!): Appliance
        deleteAppliance(id: ID!): Appliance

        # Additional Options
        createAdditional(additional: AdditionalInput!): Additional
        updateAdditional(id: ID!, additional: AdditionalInput!): Additional
        deleteAdditional(id: ID!): Additional
        
        # ColorScheme
        createColorScheme(colorScheme: ColorSchemeInput!): ColorScheme
        updateColorScheme(id: ID!, colorScheme: ColorSchemeInput!): ColorScheme
        deleteColorScheme(id: ID!): ColorScheme
        
        # Lot Options
        createLot(lot: LotInput!): Lot
        updateLot(id: ID!, lot: LotInput!): Lot
        deleteLot(id: ID!): Lot

        # Lot Pricing Mutations
        createLotPricing(lotPricing: LotPricingInput!): LotPricing
        updateLotPricing(id: ID!, lotPricing: LotPricingInput!): LotPricing
        deleteLotPricing(id: ID!): LotPricing
        
        # User Home mutations
        createUserHome(userHome: UserHomeInput!): UserHome
        updateUserHome(id: ID!, userHome: UserHomeInput!): UserHome
        deleteUserHome(id: ID!): UserHome
        
        # Plan-option relationship mutations
        addElevationToPlan(planId: ID!, elevationId: ID!): Plan
        removeElevationFromPlan(planId: ID!, elevationId: ID!): Plan
    
        addStructuralToPlan(planId: ID!, structuralId: ID!): Plan
        removeStructuralFromPlan(planId: ID!, structuralId: ID!): Plan
    
        addInteriorOptionToPlan(planId: ID!, interiorOptionId: ID!): Plan
        removeInteriorOptionFromPlan(planId: ID!, interiorOptionId: ID!): Plan
    
        addInteriorPackageToPlan(planId: ID!, interiorPackageId: ID!): Plan
        removeInteriorPackageFromPlan(planId: ID!, interiorPackageId: ID!): Plan
    
        addApplianceToPlan(planId: ID!, applianceId: ID!): Plan
        removeApplianceFromPlan(planId: ID!, applianceId: ID!): Plan
    
        addAdditionalToPlan(planId: ID!, additionalId: ID!): Plan
        removeAdditionalFromPlan(planId: ID!, additionalId: ID!): Plan
    
        addColorSchemeToPlan(planId: ID!, colorSchemeId: ID!): Plan
        removeColorSchemeFromPlan(planId: ID!, colorSchemeId: ID!): Plan
    
        addLotPricingToPlan(planId: ID!, lotPricingId: ID!): Plan
        removeLotPricingFromPlan(planId: ID!, lotPricingId: ID!): Plan
    }

    input ElevationInput {
        name: String!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        description: String
        img: String
        planId: ID!
        isActive: Boolean
        sortOrder: Int
    }

    input ColorSchemeInput {
        name: String!
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
        isActive: Boolean
        sortOrder: Int
    }
    
    input StructuralInput {
        name: String!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        description: String
        img: String
        planId: ID!
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

    input AdditionalInput {
        name: String!
        totalCost: Float!
        clientPrice: Float
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        planId: ID!
        isActive: Boolean
        sortOrder: Int
    }

    input InteriorOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        tier: String
        cabinetOverlay: String
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input CabinetOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        cabinetOverlay: String
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input CabinetHardwareOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input FixtureOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input LvpOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        tier: String
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input CarpetOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        tier: String
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input MasterBathOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        tier: String
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input BacksplashOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }

    input CountertopOptionInput {
        name: String!
        brand: String!
        color: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }
    
    input InteriorPackageInput {
        name: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        description: String
        img: String
        fixtures: [ID]
        lvp: ID
        carpet: ID
        backsplash: ID
        masterBathTile: ID
        countertop: ID
        primaryCabinets: ID
        secondaryCabinets: ID
        cabinetHardware: ID
        softclose: Boolean!
        basePackage: Boolean!
        isActive: Boolean
        sortOrder: Int
    }

    input ApplianceInput {
        name: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        type: String!
        brand: String
        img: String
        planId: ID!
        isActive: Boolean
        sortOrder: Int
    }
    
   input LotInput {
        filing: Int!
        lot: Int!
        width: Int!
        length: Int!
        lotSqft: Float!
        streetNumber: String!
        streetName: String!
        garageDir: String!
        parcelNumber: String!
        notes: String
        isActive: Boolean
    }

    input LotPricingInput {
        lot: ID!
        plan: ID!
        lotPremium: Float!
        isActive: Boolean
    }
    
    # Plan Specific Input

    input BasePlanInput {
        planType: Int!
        name: String!
        bedrooms: Int!
        bathrooms: Float!
        totalSqft: Int!
        resSqft: Int!
        garage: Int!
        basePrice: Float!
        description: String
        width: Int!
        length: Int!
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
        width: Int!
        length: Int!
        elevations: [ID!]
        colorScheme: [ID!]
        interiors: [ID!!]
        structural: [ID!]
        additional: [ID!]
        kitchenAppliance: [ID!]
        laundryAppliance: [ID!]
        lotPremium: [ID!]
        isActive: Boolean
        sortOrder: Int
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

`

export default typeDefs;