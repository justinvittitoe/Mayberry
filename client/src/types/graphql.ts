// Shared TypeScript interfaces for GraphQL types (client-side)

export interface Option {
  _id?: string;
  name: string;
  price: number;
  classification?: string;
  description?: string;
  img?: string;
  width?: number;
  length?: number;
  svgPath?: string;
  supportsColorSchemes?: boolean;
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
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  garageType: string;
  basePrice: number;
  description?: string;
  width?: number;
  length?: number;
  elevations?: Option[];
  colorScheme?: ColorScheme[];
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
  colorScheme?: ColorScheme;
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

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  homeCount?: number;
  savedHomes?: UserHome[];
}

export interface Auth {
  token: string;
  user: User;
}