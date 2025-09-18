// TypeScript interfaces corresponding to GraphQL types

export interface Auth {
    token: string;
    user: User;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    homeCount?: number;
    savedHomes?: UserHome[];
}

export interface Option {
    _id?: string;
    name: string;
    price: number;
    classification?: string;
    planType: number;
    description?: string;
    img?: string;
}

export interface InteriorOption {
    _id?: string;
    name: string;
    price: number;
    classification: string;
    planType: number;
    description?: string;
    img?: string;
    material: string;
}

export interface Appliance {
    _id?: string;
    name: string;
    price: number;
    classification: string;
    type: string;
    description?: string;
    img?: string;
}

export interface Structural {
    _id?: string;
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

export interface Classification {
    value: 'elevation' | 'colorScheme' | 'interior' | 'structural' | 'additional' | 'appliance' | 'lot' 
}

export interface ColorValues {
    primary: string;
    secondary: string;
    roof: string;
    accent: string;
    foundation?: string;
}

export interface ColorScheme {
    _id?: string;
    name: string;
    description?: string;
    price: number;
    colorValues: ColorValues;
    isActive: boolean;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface InteriorPackage {
    _id?: string;
    name: string;
    planType?: number;
    totalPrice?: number;
    clientPrice?: number;
    fixtures?: InteriorOption[];
    lvp?: InteriorOption[];
    carpet?: InteriorOption[];
    backsplash?: InteriorOption[];
    masterBathTile?: InteriorOption[];
    countertop?: InteriorOption[];
    primaryCabinets?: InteriorOption[];
    secondaryCabinets?: InteriorOption[];
    upgrade?: boolean;
    basePackage?: boolean;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LotPremium {
    _id?: string;
    filing: number;
    lot: number;
    width: number;
    length: number;
    lotSqft: number;
    premium: number;
    address: string;
    parcelNumber: string;
}

export interface Plan {
    _id: string;
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

export interface UserHome {
    _id: string;
    userId: string;
    plan: string;
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
export interface OptionInput {
    name: string;
    price: number;
    classification?: string;
    planType: number;
    description?: string;
    img?: string;
}

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

export interface InteriorPackageInput {
    name: string;
    planType?: number;
    totalPrice?: number;
    clientPrice?: number;
    fixtures?: string[];
    lvp?: string[];
    carpet?: string[];
    backsplash?: string[];
    masterBathTile?: string[];
    countertop?: string[];
    primaryCabinets?: string[];
    secondaryCabinets?: string[];
    upgrade?: boolean;
    basePackage?: boolean;
    isActive?: boolean;
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