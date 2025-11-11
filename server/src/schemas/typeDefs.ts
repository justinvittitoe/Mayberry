import { gql } from 'graphql-tag';

const typeDefs = gql`

    scalar ObjectId

    # CORRECT
    type User {
        _id: ObjectId!
        username: String!
        email: String!
        role: String!
        homeCount: Int
        savedPlans: [UserPlan!]
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

    #CORRECT
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

    # CORRECT
    type Appliance {
        _id: ObjectId!
        name: String!
        baseCost: Float!
        totalCost: Float!
        markup: Float!
        minMarkup: Float!
        clientPrice: Float!
        type: String!
        brand: String!
        img: String
        planId: ObjectId!
        isActive: Boolean!
        sortOrder: Int!
        createdAt: String
        updatedAt: String
    }

    # CORRECT
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

    # CORRECT
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
        createdAt: String
        updatedAt: String
    }

    # CORRECT
    type LotPricing {
        _id: ObjectId!
        lot: Lot!
        plan: Plan!
        lotPremium: Float!
        isActive: Boolean!
        createdAt: String
        updatedAt: String
    }
   
    # CORRECT
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
        doorName: String!
        doorCode: String!
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
    
    # CORRECT
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
        lot: [LotPricing]
        width: Int!
        length: Int!
        garageSqft: Int
        pricePerSqft: Float
        isActive: Boolean!
        createdAt: String
        updatedAt: String
    }
    
    type UserPlan {
        _id: ObjectId!
        userId: ObjectId!
        planId: ObjectId!
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
    
    # CORRECT
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

        #User plan queries
        userPlans(userId: ObjectId): [UserPlan]
        userPlan(id: ObjectId!): UserPlan

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
        deletePlan(id: ObjectId!): Boolean!
        
        # Option mutations (admin only)
        # Elevation Options
        createElevation(elevation: ElevationInput!): Elevation!
        updateElevation(id: ObjectId!, elevation: ElevationInput!): Elevation!
        deleteElevation(id: ObjectId!): Boolean!

        # Structural Options
        createStructural(structural: StructuralInput!): Structural!
        updateStructural(id: ObjectId!, structural: StructuralInput!): Structural!
        deleteStructural(id: ObjectId!): Boolean!

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
        
        # User Plan mutations
        createUserPlan(userPlan: UserPlanInput!): UserPlan
        updateUserPlan(id: ObjectId!, userPlan: UserPlanInput!): UserPlan
        deleteUserPlan(id: ObjectId!): UserPlan
        
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
        planId: ObjectId!
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
        planId: ObjectId!
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
        planId: ObjectId!
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

    # CORRECT
    input ColorSchemeInput {
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
        doorName: String!
        doorCode: String!
        shingleBrand: String!
        shingleColor: String!
        stone: Boolean
        stoneColor: String
        colorSchemeImg: String
        isActive: Boolean
        sortOrder: Int
    }

    #CORRECT
    input AdditionalInput {
        name: String!
        totalCost: Float!
        clientPrice: Float
        markup: Float!
        minMarkup: Float!
        description: String
        img: String
        planId: ObjectId!
        isActive: Boolean
        sortOrder: Int
    }

    #CORRECT
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
        planId: ObjectId!
        isActive: Boolean
        sortOrder: Int
    }
    
    # CORRECT
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

    # CORRECT
    input LotPricingInput {
        lot: ObjectId!
        plan: ObjectId!
        lotPremium: Float!
        isActive: Boolean
    }
    
    # Plan Specific Input

    # CORRECT
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
        elevations: [ObjectId!]
        colorScheme: [ObjectId!]
        interiors: [ObjectId!]
        structural: [ObjectId!]
        additional: [ObjectId!]
        kitchenAppliance: [ObjectId!]
        laundryAppliance: [ObjectId!]
        lot: [ObjectId!]
        isActive: Boolean
        sortOrder: Int
    }
    
    # CORRECT
    input UserPlanInput {
        planId: ObjectId!
        configurationName: String
        elevation: ObjectId!
        colorScheme: ObjectId!
        interiorPackage: ObjectId!
        kitchenAppliance: ObjectId!
        laundryAppliance: ObjectId
        lot: ObjectId
        structuralOptions: [ObjectId!]
        additionalOptions: [ObjectId!]
        status: String
        isActive: Boolean
        notes: String
        customerNotes: String
    }

    input CustomizationSelectionsInput {
        elevation: ObjectId
        colorScheme: ObjectId
        interiorPackage: ObjectId
        structural: [ObjectId!]
        additional: [ObjectId!]
        kitchenAppliance: ObjectId
        laundryAppliance: ObjectId
        lotPremium: ObjectId
    }

`

export default typeDefs;