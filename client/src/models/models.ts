/**
 * Frontend Models for Mayberry Home Builder
 * These models ensure type safety and data consistency across the application
 * They match the GraphQL schema and provide clean interfaces for CRUD operations
 */

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