import { gql } from 'graphql-tag';

const typeDefs = gql`

    scalar ObjectId

    type User {
        _id: ObjectId!
        username: String!
        email: String!
        role: String!
        homeCount: Int
        savedHomes: [UserHome]
    }
    
    # CORRECT
    # Plan-specific option types
    type Elevation {
        _id: ObjectId!
        name: String!
        totalCost: Float!
        clientPrice: Float!
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        planId: ObjectId!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }
    # CORRECT
    type Structural {
        _id: ObjectId!
        name: String!
        totalCost: Float!
        clientPrice: Float!
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        planId: ObjectId!
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

    # CORRECT
    type InteriorOption {
        _id: ObjectId!
        name: String!
        brand: String!
        color: String!
        cost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float!
        material: String!
        tier: String
        cabinetOverlay: String
        softClosePrice: Float
        planId: ObjectId!
        img: String
        isActive: Boolean!
        sortOrder: Int
        createdAt: String
        updatedAt: String
    }

    type InteriorPackage {
        _id: ObjectId!
        name: String!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float!
        description: String
        img: String
        planId: ObjectId!
        fixtures: InteriorOption
        lvp: InteriorOption
        carpet: InteriorOption
        backsplash: InteriorOption
        masterBathTile: InteriorOption
        secondaryBathTile: InteriorOption
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
        _id: ObjectId!
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
        planId: ObjectId!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type Additional {
        _id: ObjectId!
        name: String!
        totalCost: Float!
        clientPrice: Float!
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        classification: String!
        planId: ObjectId!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    type Lot {
        _id: ObjectId!
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
        _id: ObjectId!
        lot: Lot!
        plan: Plan!
        lotPremium: Float!
        isActive: Boolean!
        createdAt: String
        updatedAt: String
    }
   
    
    type ColorScheme {
        _id: ObjectId!
        name: String!
        planId: ObjectId!
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
        _id: ObjectId!
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
        _id: ObjectId!
        userId: ObjectId!
        plan: ObjectId!
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
        user(id: ObjectId, username: String): User

        #Plan queries
        plans: [Plan]
        plan(id: ObjectId!): Plan
        planByType(planType: Int!): Plan

        #User home queries
        userHomes(userId: ObjectId): [UserHome]
        userHome(id: ObjectId!): UserHome

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
        planElevations(planId: ObjectId!): [Elevation]
        planStructural(planId: ObjectId!): [Structural]
        planInteriorOptions(planId: ObjectId!): [InteriorOption]
        planInteriorPackages(planId: ObjectId!): [InteriorPackage]
        planAppliances(planId: ObjectId!): [Appliance]
        planAdditional(planId: ObjectId!): [Additional]
        planColorSchemes(planId: ObjectId!): [ColorScheme]
        planLotPricing(planId: ObjectId!): [LotPricing]
        
        # Search plan options across all plans
        searchOptions(query: String!, type: String!): [SearchResult]
        
    }

    type Mutation {
        # Auth mutations
        login(email: String!, password: String!): Auth
        createUser(username: String!, email: String!, password: String!): Auth
        
        # Plan mutations (admin only)
        createPlan(plan: PlanInput!): Plan
        updatePlan(id: ObjectId!, plan: PlanInput!): Plan
        deletePlan(id: ObjectId!): Plan
        
        # Option mutations (admin only)
        # Elevation Options
        createElevation(elevation: ElevationInput!): Elevation
        updateElevation(id: ObjectId!, elevation: ElevationInput!): Elevation
        deleteElevation(id: ObjectId!): Elevation

        # Structural Options
        createStructural(structural: StructuralInput!): Structural
        updateStructural(id: ObjectId!, structural: StructuralInput!): Structural
        deleteStructural(id: ObjectId!): Structural

        # Interior Options
        createInteriorOption(input: InteriorOptionInput!): InteriorOption!
        updateInteriorOption(id: ObjectId!, input: InteriorOptionInput!): InteriorOption!
        deleteInteriorOption(id: ObjectId!): Boolean!

        # Interior Package Options
        createInteriorPackage(input: InteriorPackageInput!): InteriorPackage!
        updateInteriorPackage(id: ObjectId!, input: InteriorPackageUpdateInput!): InteriorPackage!
        deleteInteriorPackage(id: ObjectId!): Boolean!

        # Utiltiy mutations
        recalculatePackagePrice(id: ObjectId!): InteriorPackage!
        recalculateAllPackagePrices(planId: ObjectId!): [InteriorPackage!]!
        setBasePackage(id: ObjectId!): InteriorPackage!
        reassignBasePackage(planId: ObjectId!): InteriorPackage

        # Appliance Options
        createAppliance(appliance: ApplianceInput!): Appliance
        updateAppliance(id: ObjectId!, appliance: ApplianceInput!): Appliance
        deleteAppliance(id: ObjectId!): Appliance

        # Additional Options
        createAdditional(additional: AdditionalInput!): Additional
        updateAdditional(id: ObjectId!, additional: AdditionalInput!): Additional
        deleteAdditional(id: ObjectId!): Additional
        
        # ColorScheme
        createColorScheme(colorScheme: ColorSchemeInput!): ColorScheme
        updateColorScheme(id: ObjectId!, colorScheme: ColorSchemeInput!): ColorScheme
        deleteColorScheme(id: ObjectId!): ColorScheme
        
        # Lot Options
        createLot(lot: LotInput!): Lot
        updateLot(id: ObjectId!, lot: LotInput!): Lot
        deleteLot(id: ObjectId!): Lot

        # Lot Pricing Mutations
        createLotPricing(lotPricing: LotPricingInput!): LotPricing
        updateLotPricing(id: ObjectId!, lotPricing: LotPricingInput!): LotPricing
        deleteLotPricing(id: ObjectId!): LotPricing
        
        # User Home mutations
        createUserHome(userHome: UserHomeInput!): UserHome
        updateUserHome(id: ObjectId!, userHome: UserHomeInput!): UserHome
        deleteUserHome(id: ObjectId!): UserHome
        
        # Plan-option relationship mutations
        addElevationToPlan(planId: ObjectId!, elevationId: ID!): Plan
        removeElevationFromPlan(planId: ObjectId!, elevationId: ID!): Plan
    
        addStructuralToPlan(planId: ObjectId!, structuralId: ID!): Plan
        removeStructuralFromPlan(planId: ObjectId!, structuralId: ID!): Plan
    
        addInteriorOptionToPlan(planId: ObjectId!, interiorOptionId: ID!): Plan
        removeInteriorOptionFromPlan(planId: ObjectId!, interiorOptionId: ID!): Plan
    
        addInteriorPackageToPlan(planId: ObjectId!, interiorPackageId: ObjectId!): Plan
        removeInteriorPackageFromPlan(planId: ObjectId!, interiorPackageId: ObjectId!): Plan
    
        addApplianceToPlan(planId: ObjectId!, applianceId: ObjectId!): Plan
        removeApplianceFromPlan(planId: ObjectId!, applianceId: ObjectId!): Plan
    
        addAdditionalToPlan(planId: ObjectId!, additionalId: ObjectId!): Plan
        removeAdditionalFromPlan(planId: ObjectId!, additionalId: ObjectId!): Plan
    
        addColorSchemeToPlan(planId: ObjectId!, colorSchemeId: ObjectId!): Plan
        removeColorSchemeFromPlan(planId: ObjectId!, colorSchemeId: ObjectId!): Plan
    
        addLotPricingToPlan(planId: ObjectId!, lotPricingId: ObjectId!): Plan
        removeLotPricingFromPlan(planId: ObjectId!, lotPricingId: ObjectId!): Plan
    }

    # CORRECT
    input ElevationInput {
        name: String!
        totalCost: Float!
        clientPrice: Float!
        markup: Float
        minMarkup: Float
        description: String
        img: String
        planId: ID!
        isActive: Boolean
        sortOrder: Int
        }

    # CORRECT
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
        width: Float
        length: Float
        totalSqft: Float
        resSqft: Float
        isActive: Boolean
        sortOrder: Int
        }
    
    # CORRECT
    input InteriorOptionInput {
        name: String!
        brand: String!
        color: String!
        cost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        tier: String
        cabinetOverlay: String
        softClosePrice: Float
        planId: ID!
        img: String
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

    input CabinetOptionInput {
        name: String!
        brand: String!
        color: String!
        cost: Float!
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
        cost: Float!
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
        cost: Float!
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
        cost: Float!
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
        cost: Float!
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
        cost: Float!
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
        cost: Float!
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
        cost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        material: String!
        planId: ID!
        img: String
        isActive: Boolean
        sortOrder: Int
    }
    
    # CORRECT
    input InteriorPackageInput {
        name: String!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        description: String
        img: String
        planId: ObjectId!
        fixtures: ObjectId
        lvp: ObjectId
        carpet: ObjectId
        backsplash: ObjectId
        masterBathTile: ObjectId
        secondaryBathTile: ObjectId
        countertop: ObjectId
        primaryCabinets: ObjectId
        secondaryCabinets: ObjectId
        cabinetHardware: ObjectId
        softClose: Boolean
        basePackage: Boolean
        isActive: Boolean
        sortOrder: Int
    }
    # CORRECT
    input InteriorPackageUpdateInput {
        name: String!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float
        description: String
        img: String
        fixtures: ObjectId
        lvp: ObjectId
        carpet: ObjectId
        backsplash: ObjectId
        masterBathTile: ObjectId
        secondaryBathTile: ObjectId
        countertop: ObjectId
        primaryCabinets: ObjectId
        secondaryCabinets: ObjectId
        cabinetHardware: ObjectId
        softClose: Boolean
        basePackage: Boolean
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