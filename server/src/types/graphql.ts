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
    description?: string;
    img?: string;
}

export interface InteriorPackage {
    _id?: string;
    name: string;
    totalPrice: number;
    fixtures?: Option[];
    lvp?: Option[];
    carpet?: Option[];
    backsplash?: Option[];
    masterBathTile?: Option[];
    countertop?: Option[];
    primaryCabinets?: Option[];
    secondaryCabinets?: Option[];
    upgrade?: boolean;
}

export interface LotPremium {
    _id?: string;
    filing: number;
    lot: number;
    width: number;
    length: number;
    price: number;
}

export interface Plan {
    _id: string;
    planType: number;
    name: string;
    basePrice: number;
    elevations?: Option[];
    colorScheme?: number[];
    interiors?: InteriorPackage[];
    structural?: Option[];
    additional?: Option[];
    kitchenAppliance?: Option[];
    laundryAppliance?: Option[];
    lotPremium?: LotPremium[];
}

export interface UserHome {
    _id: string;
    userId: string;
    planTypeId: string;
    planTypeName: string;
    basePrice: number;
    elevation?: Option;
    colorScheme: number;
    interior?: InteriorPackage;
    structural?: Option[];
    additional?: Option[];
    kitchenAppliance?: Option;
    laundryAppliance?: Option;
    lotPremium?: LotPremium;
    totalPrice?: number;
    createdAt?: string;
    updatedAt?: string;
}

// Input types for mutations
export interface OptionInput {
    name: string;
    price: number;
    classification?: string;
    description?: string;
    img?: string;
}

export interface InteriorPackageInput {
    name: string;
    totalPrice: number;
    fixtures?: OptionInput[];
    lvp?: OptionInput[];
    carpet?: OptionInput[];
    backsplash?: OptionInput[];
    masterBathTile?: OptionInput[];
    countertop?: OptionInput[];
    primaryCabinets?: OptionInput[];
    secondaryCabinets?: OptionInput[];
    upgrade?: boolean;
}

export interface LotPremiumInput {
    filing: number;
    lot: number;
    width: number;
    length: number;
    price: number;
}

export interface PlanInput {
    planType: number;
    name: string;
    basePrice: number;
    elevations?: OptionInput[];
    colorScheme?: number[];
    interiors?: InteriorPackageInput[];
    structural?: OptionInput[];
    additional?: OptionInput[];
    kitchenAppliance?: OptionInput[];
    laundryAppliance?: OptionInput[];
    lotPremium?: LotPremiumInput[];
}

export interface UserHomeInput {
    planTypeId: string;
    planTypeName: string;
    basePrice: number;
    elevation?: OptionInput;
    colorScheme: number;
    interior?: InteriorPackageInput;
    structural?: OptionInput[];
    additional?: OptionInput[];
    kitchenAppliance: OptionInput;
    laundryAppliance: OptionInput;
    lotPremium: LotPremiumInput;
} 