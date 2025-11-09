// TypeScript interfaces corresponding to GraphQL types
import { Types } from 'mongoose';

export interface AuthType {
    token: string;
    user: UserType;
}

export interface UserType {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    homeCount?: number;
    savedHomes?: UserHome[];
}
//CORRECT
export interface ElevationType {
    _id: Types.ObjectId;
    name: string;
    totalCost: number;
    clientPrice: number;
    markup: number;
    minMarkup: number;
    description?: string;
    img?: string;
    planId: Types.ObjectId;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

//CORRECT
export interface StructuralType {
    _id: Types.ObjectId;
    name: string;
    totalCost: number;
    clientPrice: number;
    markup: number;
    minMarkup: number;
    description?: string;
    img?: string;
    planId: Types.ObjectId;
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
    _id: Types.ObjectId;
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
    planId: Types.ObjectId;
    img?: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface InteriorPackageType {
    _id: Types.ObjectId;
    name: string;
    totalCost: number;
    markup: number;
    minMarkup: number;
    clientPrice: number;
    description?: string;
    img?: string;
    planId: Types.ObjectId;
    fixtures?: Types.ObjectId | InteriorOptionType;
    lvp?: Types.ObjectId | InteriorOptionType;
    carpet?: Types.ObjectId | InteriorOptionType;
    backsplash?: Types.ObjectId | InteriorOptionType;
    masterBathTile?: Types.ObjectId | InteriorOptionType;
    secondaryBathTile?: Types.ObjectId | InteriorOptionType;
    countertop?: Types.ObjectId | InteriorOptionType;
    primaryCabinets?: Types.ObjectId | InteriorOptionType;
    secondaryCabinets?: Types.ObjectId | InteriorOptionType;
    cabinetHardware?: Types.ObjectId | InteriorOptionType;
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
    planId: Types.ObjectId;
    fixtures?: Types.ObjectId[];
    lvp?: Types.ObjectId;
    carpet?: Types.ObjectId;
    backsplash?: Types.ObjectId;
    masterBathTile?: Types.ObjectId;
    secondaryBathTile?: Types.ObjectId;
    countertop?: Types.ObjectId;
    primaryCabinets?: Types.ObjectId;
    secondaryCabinets?: Types.ObjectId;
    cabinetHardware?: Types.ObjectId;
    softClose?: boolean;
    basePackage?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}

export interface ApplianceType {
    _id: Types.ObjectId;
    name: string;
    baseCost: number;
    totalCost: number;
    markup: number;
    minMarkup: number;
    clientPrice: number;
    classification: Classification;
    type: string;
    brand: string;
    img?: string;
    planId: Types.ObjectId;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdditionalType {
    _id: Types.ObjectId;
    name: string;
    totalCost: number;
    clientPrice: number;
    markup: number;
    minMarkup: number;
    description?: string;
    img?: string;
    planId: Types.ObjectId;
    isActive: boolean
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}


export interface ColorValues {
    primary: string;
    secondary: string;
    roof: string;
    accent: string;
    foundation?: string;
}

export interface ColorScheme {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    colorValues: ColorValues;
    isActive: boolean;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface LotPremium {
    _id: Types.ObjectId;
    filing: number;
    lot: number;
    width: number;
    length: number;
    lotSqft: number;
    premium: number;
    address: string;
    parcelNumber: string;
}

export interface PlanType {
    _id: Types.ObjectId;
    planType: number;
    name: string;
    bedrooms: number;
    bathrooms: number;
    totalSqft: number;
    resSqft: number;
    garage: number;
    basePrice: number;
    description?: string;
    elevations?: Option[];
    colorScheme?: ColorScheme[];
    interiors?: InteriorPackage[];
    structural?: Structural[];
    additional?: Option[];
    kitchenAppliance?: Appliance[];
    laundryAppliance?: Appliance[];
    lotPremium?: LotPremium[];
    width: number;
    length: number;
    garageSqft?: number;
    pricePerSqft?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserHomeType {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    planId: Types.ObjectId;
    configurationName: string;
    elevation: string;
    colorScheme: string;
    interiorPackage: string;
    kitchenAppliance: string;
    laundryAppliance?: string;
    lotPremium?: string;
    structuralOptions: string[];
    additionalOptions: string[];
    basePlanPrice?: number;
    optionsTotalPrice?: number;
    totalPrice?: number;
    status: string;
    isActive: boolean;
    submittedAt?: string;
    contractedAt?: string;
    notes?: string;
    customerNotes?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Input types for mutations

export interface ColorValuesInput {
    primary: string;
    secondary: string;
    roof: string;
    accent: string;
    foundation?: string;
}

export interface ColorSchemeInput {
    name: string;
    description?: string;
    price: number;
    colorValues: ColorValuesInput;
    isActive?: boolean;
    sortOrder?: number;
}

export interface LotPremiumInput {
    filing: number;
    lot: number;
    width: number;
    length: number;
    lotSqft?: number;
    premium: number;
    address: string;
    parcelNumber: string;
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
    elevations?: string[];
    colorScheme?: string[];
    interiors?: string[];
    structural?: string[];
    additional?: string[];
    kitchenAppliance?: string[];
    laundryAppliance?: string[];
    lotPremium?: string[];
    width: number;
    length: number;
}

export interface UserHomeInput {
    plan: string;
    configurationName?: string;
    elevation: string;
    colorScheme: string;
    interiorPackage: string;
    kitchenAppliance: string;
    laundryAppliance?: string;
    lotPremium?: string;
    structuralOptions?: string[];
    additionalOptions?: string[];
    status?: string;
    isActive?: boolean;
    notes?: string;
    customerNotes?: string;
}

export interface InteriorOptionInput {
    name: string;
    price: number;
    classification: string;
    planType: number;
    description?: string;
    img?: string;
    material: string;
}

export interface ApplianceInput {
    name: string;
    price: number;
    classification: string;
    type: string;
    description?: string;
    img?: string;
}

export interface StructuralInput {
    name: string;
    price: number;
    classification: string;
    planType: number;
    description?: string;
    img?: string;
    garage?: number;
    bedrooms?: number;
    bathrooms?: number;
    width: number;
    length: number;
    totalSqft?: number;
    resSqft?: number;
} 