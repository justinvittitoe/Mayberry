// TypeScript interfaces corresponding to GraphQL types
import { ObjectId } from 'mongodb';

export interface AuthType {
    token: string;
    user: UserAuthType;
}

export interface UserAuthType {
    _id: ObjectId;
    username: string;
    email: string;
    role: 'admin' | 'user';
}

export interface UserType {
    _id: ObjectId;
    username: string;
    email: string;
    role: 'admin' | 'user';
    homeCount?: number;
    savedPlans?: UserPlanPopulated[];
}



//CORRECT
export interface ElevationType {
    _id: ObjectId;
    name: string;
    totalCost: number;
    clientPrice: number;
    markup: number;
    minMarkup: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ElevationInput {
    name: string;
    totalCost: number;
    clientPrice?: number;
    markup?: number;
    minMarkup?: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    isActive?: boolean;
    sortOrder?: number;
}

//CORRECT
export interface StructuralType {
    _id: ObjectId;
    name: string;
    totalCost: number;
    clientPrice: number;
    markup: number;
    minMarkup: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    garage?: number;
    bedrooms?: number;
    bathrooms?: number;
    width?: number;
    length?: number;
    totalSqft?: number;
    resSqft?: number;
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface StructuralInput {
    name: string;
    totalCost: number;
    clientPrice?: number;
    markup?: number;
    minMarkup?: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    garage?: number;
    bedrooms?: number;
    bathrooms?: number;
    width?: number;
    length?: number;
    totalSqft?: number;
    resSqft?: number;
    isActive: boolean;
    sortOrder?: number;
}

export type Material =
    | 'fixture'
    | 'lvp'
    | 'carpet'
    | 'backsplash'
    | 'masterBathTile'
    | 'countertop'
    | 'cabinet'
    | 'cabinetHardware';

export type Tier = 
    | 'base' 
    | 'tier-1' 
    | 'tier-2' 
    | 'tier-3';

export type CabinetOverlay = 
    | 'standard'
    | 'full';

//CORRECT
export interface InteriorOptionType {
    _id: ObjectId;
    name: string;
    brand: string;
    color: string;
    cost: number;
    markup: number;
    minMarkup: number;
    clientPrice: number;
    material: Material;
    tier?: Tier;
    cabinetOverlay?: CabinetOverlay;
    planId: ObjectId;
    img?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface InteriorOptionInput {
    name: string;
    brand: string;
    color?: string;
    cost: number;
    markup?: number;
    minMarkup?: number;
    clientPrice?: number;
    material: Material;
    tier?: Tier;
    cabinetOverlay?: CabinetOverlay;
    planId: ObjectId;
    img?: string;
    isActive?: boolean;
}

export interface InteriorPackageType {
    _id: ObjectId;
    name: string;
    totalCost: number;
    markup: number;
    minMarkup: number;
    clientPrice: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    fixtures?: ObjectId | InteriorOptionType;
    lvp?: ObjectId | InteriorOptionType;
    carpet?: ObjectId | InteriorOptionType;
    backsplash?: ObjectId | InteriorOptionType;
    masterBathTile?: ObjectId | InteriorOptionType;
    secondaryBathTile?: ObjectId | InteriorOptionType;
    countertop?: ObjectId | InteriorOptionType;
    primaryCabinets?: ObjectId | InteriorOptionType;
    secondaryCabinets?: ObjectId | InteriorOptionType;
    cabinetHardware?: ObjectId | InteriorOptionType;
    softClose: boolean;
    basePackage: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Input type for mutations
export interface InteriorPackageInput {
    name: string;
    totalCost: number;
    markup?: number;
    minMarkup?: number;
    clientPrice?: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    fixtures?: ObjectId[];
    lvp?: ObjectId;
    carpet?: ObjectId;
    backsplash?: ObjectId;
    masterBathTile?: ObjectId;
    secondaryBathTile?: ObjectId;
    countertop?: ObjectId;
    primaryCabinets?: ObjectId;
    secondaryCabinets?: ObjectId;
    cabinetHardware?: ObjectId;
    softClose?: boolean;
    basePackage?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

// Correct
export interface ApplianceType {
    _id: ObjectId;
    name: string;
    baseCost: number;
    totalCost: number;
    markup: number;
    minMarkup: number;
    clientPrice: number;
    type: string;
    brand?: string;
    img?: string;
    planId: ObjectId[];
    isActive: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

//Correct
export interface ApplianceInput {
    name: string;
    baseCost?: number;
    totalCost?: number;
    markup: number;
    minMarkup?: number;
    clientPrice?: number;
    type: string;
    brand?: string;
    img?: string;
    planId: ObjectId;
    isActive?: boolean;
    sortOrder?: number;
}

// Correct
export interface AdditionalType {
    _id: ObjectId;
    name: string;
    totalCost: number;
    clientPrice: number;
    markup: number;
    minMarkup: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    isActive: boolean
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

// Correct
export interface AdditionalInput {
    name: string;
    totalCost?: number;
    clientPrice?: number;
    markup?: number;
    minMarkup?: number;
    description?: string;
    img?: string;
    planId: ObjectId;
    isActive?: boolean
    sortOrder?: number;
}

//Correct
export interface ColorSchemeType {
    _id: ObjectId;
    name: string;
    planId: ObjectId;
    description?: string;
    price: number;
    primaryName?: string;
    primaryCode?: string;
    secondaryName?: string;
    secondaryCode?: string;
    trimName: string;
    trimCode: string;
    doorName: string;
    doorCode: string;
    shingleBrand: string;
    shingleColor: string;
    stone: boolean;
    stoneColor?: string;
    colorSchemeImg?: string;
    isActive: boolean;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Correct
export interface ColorSchemeInput {
    name: string;
    planId: ObjectId;
    description?: string;
    price: number;
    primaryName?: string;
    primaryCode?: string;
    secondaryName?: string;
    secondaryCode?: string;
    trimName?: string;
    trimCode?: string;
    doorName?: string;
    doorCode?: string;
    shingleBrand: string;
    shingleColor?: string;
    stone?: boolean;
    stoneColor?: string;
    colorSchemeImg?: string;
    isActive?: boolean;
    sortOrder?: number;
}

//Correct
export interface LotType {
    _id: ObjectId;
    filing: number;
    lot: number;
    width: number;
    length: number;
    lotSqft: number;
    streetNumber: string;
    streetName: string;
    garageDir: string;
    parcelNumber: string;
    notes?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

//Correct
export interface LotInput {
    filing: number;
    lot: number;
    width: number;
    length: number;
    lotSqft: number;
    premium: number;
    streetNumber?: string;
    streetName?: string;
    garageDir?: string;
    parcelNumber?: string;
    notes?: string;
    isActive?: boolean;
}

// Correct
export interface LotPricingType {
    _id: ObjectId;
    lot: ObjectId
    plan: ObjectId;
    lotPremium: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Correct
export interface LotPricingInput {
    lot: ObjectId;
    plan: ObjectId;
    lotPremium: number;
    isActive: boolean
}

export interface PlanType {
    _id: ObjectId;
    planType: number;
    name: string;
    bedrooms: number;
    bathrooms: number;
    totalSqft: number;
    resSqft: number;
    garage: number;
    basePrice: number;
    description?: string;
    elevations?: ElevationType[];
    colorScheme?: ColorSchemeType[];
    interiors?: InteriorPackageType[];
    structural?: StructuralType[];
    additional?: AdditionalType[];
    kitchenAppliance?: ApplianceType[];
    laundryAppliance?: ApplianceType[];
    lotPremium?: LotPricingType[];
    width: number;
    length: number;
    garageSqft?: number;
    pricePerSqft?: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PlanInput {
    planType: number;
    name: string;
    bedrooms: number;
    bathrooms: number;
    totalSqft: number;
    resSqft: number;
    garage: number;
    basePrice: number;
    description?: string;
    elevations?: ObjectId[];
    colorScheme?: ObjectId[];
    interiors?: ObjectId[];
    structural?: Object[];
    additional?: ObjectId[];
    kitchenAppliance?: ObjectId[];
    laundryAppliance?: ObjectId[];
    lot?: ObjectId[];
    width: number;
    length: number;
}

export interface BasePlanInput {
    planType: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    totalSqft: number;
    resSqft: number;
    garage: number;
    basePrice: number;
    description: string;
    width: number;
    length: number;
}

// UserPlanType with unpopulated ObjectId references (database layer)
export interface UserPlanType {
    _id: ObjectId;
    userId: ObjectId;
    planId: ObjectId;
    configurationName: string;
    elevation: ObjectId;
    colorScheme: ObjectId;
    interiorPackage: ObjectId;
    kitchenAppliance: ObjectId;
    laundryAppliance?: ObjectId;
    lot?: ObjectId;
    structuralOptions: ObjectId[];
    additionalOptions: ObjectId[];
    basePlanPrice?: number;
    optionsTotalPrice?: number;
    totalPrice?: number;
    status: string;
    isActive: boolean;
    submittedAt?: string;
    contractedAt?: string;
    notes?: string;
    customerNotes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// UserPlanPopulated with populated nested objects (GraphQL resolver return type)
export interface UserPlanPopulated {
    _id: ObjectId;
    userId: ObjectId;
    planId: ObjectId;
    configurationName: string;
    elevation?: ElevationType;
    colorScheme?: ColorSchemeType;
    interiorPackage?: InteriorPackageType;
    kitchenAppliance?: ApplianceType;
    laundryAppliance?: ApplianceType;
    lot?: LotPricingType;
    structuralOptions?: StructuralType[];
    additionalOptions?: AdditionalType[];
    basePlanPrice?: number;
    optionsTotalPrice?: number;
    totalPrice?: number;
    status: string;
    isActive: boolean;
    submittedAt?: string;
    contractedAt?: string;
    notes?: string;
    customerNotes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserPlanInput {
    planId: ObjectId;
    configurationName?: string;
    elevation: ObjectId;
    colorScheme: ObjectId;
    interiorPackage: ObjectId;
    kitchenAppliance: ObjectId;
    laundryAppliance?: ObjectId;
    lot?: ObjectId;
    structuralOptions?: ObjectId[];
    additionalOptions?: ObjectId[];
    status?: string;
    isActive?: boolean;
    notes?: string;
    customerNotes?: string;
}

export interface CustomizationSelectionsInput {
    elevation: ObjectId;
    colorScheme: ObjectId;
    interiorPackage: ObjectId;
    kitchenAppliance: ObjectId;
    laundryAppliance?: ObjectId;
    lot?: ObjectId;
    structuralOptions?: ObjectId[];
    additionalOptions?: ObjectId[];
}
