// Shared TypeScript interfaces for GraphQL types (client-side)

//Verified with GraphQL schema
export interface Auth {
  token: string;
  user: User;
}

//Verified with GraphQL schema
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  homeCount?: number;
  savedHomes?: UserHome[];
}
//CORRECT
export interface Elevation {
  _id: string;
  name: string;
  totalCost: number;
  clientPrice: number;
  markup: number;
  minMarkup: number;
  description?: string;
  img?: string;
  planId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

//Verified with GraphQL schema - CORRECT
export interface Structural {
  _id: string;
  name: string;
  totalCost: number;
  clientPrice: number;
  markup: number;
  minMarkup: number;
  description?: string;
  img?: string;
  planId: string;
  garage?: number;
  bedrooms?: number;
  bathrooms?: number;
  width: number;
  length: number;
  totalSqft?: number;
  resSqft?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
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

//Verified with GraphQL schema - CORRECT
export interface InteriorOption {
  _id: string;
  name: string;
  brand: string;
  color: string;
  cost: number;
  markup: number;
  minMarkup: number;
  clientPrice: number;
  material: string;
  tier?: string;
  cabinetOverlay?: string;
  softClosePrice?: number;
  planId: string;
  img?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

//Verified with GraphQL schema
export interface InteriorPackage {
  _id: string;
  name: string;
  totalCost: number;
  markup: number;
  minMarkup: number;
  clientPrice: number;
  description?: string;
  img?: string;
  planId: string;
  fixtures?: InteriorOption;
  lvp?: InteriorOption;
  carpet?: InteriorOption;
  backsplash?: InteriorOption;
  masterBathTile?: InteriorOption;
  secondaryBathTile?: InteriorOption;
  countertop?: InteriorOption;
  primaryCabinets?: InteriorOption;
  secondaryCabinets?: InteriorOption;
  cabinetHardware?: InteriorOption;
  softClose: boolean;
  basePackage: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

//Verified with GraphQL schema
export interface Appliance {
  _id: string;
  name: string;
  price: number;
  classification: string;
  type: string;
  description?: string;
  img?: string;
  isActive: boolean;
}


export interface Additional {
  _id: string;
  name: string;
  totalCost: number;
  clientPrice: number;
  markup: number;
  minMarkup: number;
  description?: string;
  img?: string;
  classification: Classification;
  planId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

//Verified with GraphQL schema
export interface ColorValues {
  primary: string; //Main Siding
  secondary: string; //Secondary Siding
  roof: string; //Roof Color
  accent: string; //Trim Color
  stone?: string; //Stone Color
  foundation?: string; //Foundation Color
}

//Verified with GraphQL schema
export interface ColorScheme {
  _id: string;
  name: string;
  classification: Classification;
  planType?: number;
  description?: string;
  price: number;
  colorValues: ColorValues;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

//Verified with GraphQL schema
export interface LotPremium {
  _id: string;
  filing: number;
  lot: number;
  width: number;
  length: number;
  lotSqft: number;
  premium: number;
  address: string;
  parcelNumber: string;
  isActive: boolean;
}

//Verified with GraphQL schema
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
  width: number;
  length: number;
  elevations?: Option[];
  colorScheme?: ColorScheme[];
  interiors?: InteriorPackage[];
  structural?: Structural[];
  additional?: Option[];
  kitchenAppliance?: Appliance[];
  laundryAppliance?: Appliance[];
  lotPremium?: LotPremium[];
  isActive: boolean;
  garageSqft?: number;
  pricePerSqft?: number;
  createdAt?: string;
  updatedAt?: string;
}

//Verified with GraphQL schema
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

//Customization Selections Schema
export interface CustomizationSelections {
  elevation: string;
  colorScheme: string;
  interior: string;
  structural: string[];
  additional: string[];
  kitchenAppliance: string;
  laundryAppliance: string;
  lotPremium: string;
}



