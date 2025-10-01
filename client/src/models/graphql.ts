// Shared TypeScript interfaces for GraphQL types (client-side)

//Verified with GraphQL schema
export interface Option {
  _id: string;
  name: string;
  price: number;
  classification: Classification;
  planType: number;
  description?: string;
  img?: string;
  isActive: boolean;
}

export type Classification =
  | 'elevation'
  | 'colorScheme'
  | 'interior'
  | 'structural'
  | 'additional'
  | 'lot';

export type Material = 
  | 'fixture' 
  | 'lvp' 
  | 'carpet' 
  | 'backsplash' 
  | 'masterBathTile' 
  | 'countertop' 
  | 'cabinet';


//Verified with GraphQL schema
export interface InteriorOption {
  _id: string;
  name: string;
  price: number;
  classification: Classification;
  planType: number;
  description?: string;
  img?: string;
  material: Material;
  isActive: boolean;
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

//Verified with GraphQL schema
export interface Structural {
  _id: string;
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
  isActive: boolean;
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
export interface InteriorPackage {
  _id: string;
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

//Verified with GraphQL schema
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  homeCount?: number;
  savedHomes?: UserHome[];
}

//Verified with GraphQL schema
export interface Auth {
  token: string;
  user: User;
}