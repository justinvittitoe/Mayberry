/**
 * Frontend Models for Mayberry Home Builder
 * These models ensure type safety and data consistency across the application
 * They match the GraphQL schema and provide clean interfaces for CRUD operations
 */

// Base interfaces
export interface BaseModel {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Option Model
export interface Option extends BaseModel {
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

// Color Scheme Models
export interface ColorValues {
  primary: string;
  secondary: string;
  roof: string;
  accent: string;
  foundation?: string;
}

export interface ColorScheme extends BaseModel {
  name: string;
  description?: string;
  price: number;
  colorValues: ColorValues;
  isActive: boolean;
  sortOrder?: number;
}

// Interior Package Model
export interface InteriorPackage extends BaseModel {
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
  isCustom?: boolean; // Added for custom packages
}

// Lot Premium Model
export interface LotPremium extends BaseModel {
  filing: number;
  lot: number;
  width: number;
  length: number;
  price: number;
}

// Plan Model
export interface Plan extends BaseModel {
  planType: number;
  name: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  garageType: string;
  basePrice: number;
  description?: string;
  elevations?: Option[];
  colorScheme?: ColorScheme[];
  interiors?: InteriorPackage[];
  structural?: Option[];
  additional?: Option[];
  kitchenAppliance?: Option[];
  laundryAppliance?: Option[];
  lotPremium?: LotPremium[];
  width: number;
  length: number;
}

// User Home Model
export interface UserHome extends BaseModel {
  userId?: string;
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
  width?: number;
  length?: number;
  lotPremium?: LotPremium;
  totalPrice?: number;
  isComplete?: boolean;
}

// Customization State (for wizard)
export interface CustomizationState {
  elevation: Option | null;
  colorScheme: ColorScheme | null;
  interior: InteriorPackage | null;
  structural: Option[];
  additional: Option[];
  kitchenAppliance: Option | null;
  laundryAppliance: Option | null;
  lotPremium: LotPremium | null;
}

// Input types for mutations (cleaned versions)
export interface OptionInput {
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
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  garageType: string;
  basePrice: number;
  description?: string;
  elevations?: OptionInput[];
  colorScheme?: ColorSchemeInput[];
  interiors?: InteriorPackageInput[];
  structural?: OptionInput[];
  additional?: OptionInput[];
  kitchenAppliance?: OptionInput[];
  laundryAppliance?: OptionInput[];
  lotPremium?: LotPremiumInput[];
  width: number;
  length: number;
}

export interface UserHomeInput {
  planTypeId: string;
  planTypeName: string;
  basePrice: number;
  elevation?: OptionInput;
  colorScheme?: ColorSchemeInput;
  interior?: InteriorPackageInput;
  structural?: OptionInput[];
  additional?: OptionInput[];
  kitchenAppliance?: OptionInput;
  laundryAppliance?: OptionInput;
  lotPremium?: LotPremiumInput;
  totalPrice?: number;
  isComplete?: boolean;
}

// User and Auth Models
export interface User extends BaseModel {
  username: string;
  email: string;
  role: string;
  homeCount?: number;
  savedHomes?: UserHome[];
}

export interface Auth {
  token: string;
  user: User;
}

// Utility types for form state
export type FormMode = 'create' | 'edit';

export interface FormState<T> {
  data: Partial<T>;
  errors: { [key: string]: string };
  isSubmitting: boolean;
  mode: FormMode;
}

// Interior Options Categories (for interior options manager)
export type InteriorOptionCategory = 
  | 'fixture' 
  | 'flooring' 
  | 'countertop' 
  | 'cabinet' 
  | 'tile' 
  | 'backsplash';

export interface InteriorOptionCategoryInfo {
  key: InteriorOptionCategory;
  label: string;
  description: string;
}

// Wizard step information
export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  required?: boolean;
}

// Filter and search interfaces
export interface OptionFilter {
  classification?: string;
  search?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface PlanFilter {
  bedrooms?: number;
  bathrooms?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  squareFootageRange?: {
    min: number;
    max: number;
  };
}

// API Response interfaces
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Validation interfaces
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule;
}