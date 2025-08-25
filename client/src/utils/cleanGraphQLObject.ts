/**
 * Enhanced utility functions for cleaning GraphQL objects using type-safe models
 * This prevents GraphQL input validation errors when using query results in mutations
 */

import {
  Option, ColorScheme, InteriorPackage, LotPremium, UserHome,
  OptionInput, ColorSchemeInput, InteriorPackageInput, LotPremiumInput, UserHomeInput,
  ColorValuesInput
} from '../types/models';

/**
 * Generic GraphQL object cleaner - removes __typename and other metadata
 */
export const cleanGraphQLObject = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanGraphQLObject);
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      // Skip GraphQL metadata fields
      if (key.startsWith('__')) {
        continue;
      }
      // Keep _id for updates, skip for creates
      if (key === '_id') {
        continue;
      }
      cleaned[key] = cleanGraphQLObject(obj[key]);
    }
    return cleaned;
  }

  return obj;
};

/**
 * Clean GraphQL object but preserve specific ID fields that are needed
 */
export const cleanGraphQLObjectKeepId = (obj: any, keepIdFields: string[] = []): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanGraphQLObjectKeepId(item, keepIdFields));
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      // Skip __typename but preserve specified ID fields
      if (key.startsWith('__') || (key === '_id' && !keepIdFields.includes('_id'))) {
        continue;
      }
      cleaned[key] = cleanGraphQLObjectKeepId(obj[key], keepIdFields);
    }
    return cleaned;
  }

  return obj;
};

/**
 * Type-safe color scheme cleaner
 */
export const cleanColorSchemeForMutation = (colorScheme: ColorScheme | any): ColorSchemeInput | null => {
  if (!colorScheme) return null;
  
  const colorValues: ColorValuesInput = {
    primary: colorScheme.colorValues?.primary || '#FFFFFF',
    secondary: colorScheme.colorValues?.secondary || '#000000',
    roof: colorScheme.colorValues?.roof || '#333333',
    accent: colorScheme.colorValues?.accent || '#0066CC',
    foundation: colorScheme.colorValues?.foundation || undefined
  };
  
  return {
    name: colorScheme.name || '',
    description: colorScheme.description || undefined,
    price: Number(colorScheme.price) || 0,
    colorValues,
    isActive: Boolean(colorScheme.isActive ?? true),
    sortOrder: Number(colorScheme.sortOrder) || 0
  };
};

/**
 * Type-safe option cleaner
 */
export const cleanOptionForMutation = (option: Option | any): OptionInput | null => {
  if (!option) return null;
  
  return {
    name: option.name || '',
    price: Number(option.price) || 0,
    classification: option.classification || undefined,
    description: option.description || undefined,
    img: option.img || undefined,
    width: option.width ? Number(option.width) : undefined,
    length: option.length ? Number(option.length) : undefined,
    svgPath: option.svgPath || undefined,
    supportsColorSchemes: Boolean(option.supportsColorSchemes)
  };
};

/**
 * Type-safe interior package cleaner
 */
export const cleanInteriorPackageForMutation = (interiorPackage: InteriorPackage | any): InteriorPackageInput | null => {
  if (!interiorPackage) return null;
  
  // Helper function to clean option arrays
  const cleanOptionArray = (options: any[]): OptionInput[] => {
    if (!Array.isArray(options)) return [];
    return options.map(opt => cleanOptionForMutation(opt)).filter(Boolean) as OptionInput[];
  };
  
  return {
    name: interiorPackage.name || '',
    totalPrice: Number(interiorPackage.totalPrice) || 0,
    fixtures: cleanOptionArray(interiorPackage.fixtures || []),
    lvp: cleanOptionArray(interiorPackage.lvp || []),
    carpet: cleanOptionArray(interiorPackage.carpet || []),
    backsplash: cleanOptionArray(interiorPackage.backsplash || []),
    masterBathTile: cleanOptionArray(interiorPackage.masterBathTile || []),
    countertop: cleanOptionArray(interiorPackage.countertop || []),
    primaryCabinets: cleanOptionArray(interiorPackage.primaryCabinets || []),
    secondaryCabinets: cleanOptionArray(interiorPackage.secondaryCabinets || []),
    upgrade: Boolean(interiorPackage.upgrade)
  };
};

/**
 * Type-safe lot premium cleaner
 */
export const cleanLotPremiumForMutation = (lotPremium: LotPremium | any): LotPremiumInput | null => {
  if (!lotPremium) return null;
  
  return {
    filing: Number(lotPremium.filing) || 0,
    lot: Number(lotPremium.lot) || 0,
    width: Number(lotPremium.width) || 0,
    length: Number(lotPremium.length) || 0,
    price: Number(lotPremium.price) || 0
  };
};

/**
 * Type-safe user home cleaner for mutations - This is the key fix for saving floor plans
 */
export const cleanUserHomeForMutation = (userHome: UserHome | any): UserHomeInput | null => {
  if (!userHome) return null;
  
  // Helper function to clean option arrays
  const cleanOptionArray = (options: any[]): OptionInput[] => {
    if (!Array.isArray(options)) return [];
    return options.map(opt => cleanOptionForMutation(opt)).filter(Boolean) as OptionInput[];
  };
  
  return {
    planTypeId: String(userHome.planTypeId) || '',
    planTypeName: String(userHome.planTypeName) || '',
    basePrice: Number(userHome.basePrice) || 0,
    elevation: userHome.elevation ? cleanOptionForMutation(userHome.elevation) : undefined,
    colorScheme: userHome.colorScheme ? cleanColorSchemeForMutation(userHome.colorScheme) : undefined,
    interior: userHome.interior ? cleanInteriorPackageForMutation(userHome.interior) : undefined,
    structural: cleanOptionArray(userHome.structural || []),
    additional: cleanOptionArray(userHome.additional || []),
    kitchenAppliance: userHome.kitchenAppliance ? cleanOptionForMutation(userHome.kitchenAppliance) : undefined,
    laundryAppliance: userHome.laundryAppliance ? cleanOptionForMutation(userHome.laundryAppliance) : undefined,
    lotPremium: userHome.lotPremium ? cleanLotPremiumForMutation(userHome.lotPremium) : undefined,
    totalPrice: userHome.totalPrice ? Number(userHome.totalPrice) : undefined,
    isComplete: Boolean(userHome.isComplete)
  };
};

/**
 * Validation helper to ensure required fields are present
 */
export const validateUserHomeForSave = (userHome: UserHomeInput): string[] => {
  const errors: string[] = [];
  
  if (!userHome.planTypeId) errors.push('Plan Type ID is required');
  if (!userHome.planTypeName) errors.push('Plan Type Name is required');
  if (!userHome.basePrice || userHome.basePrice <= 0) errors.push('Valid base price is required');
  if (!userHome.elevation) errors.push('Elevation selection is required');
  if (!userHome.colorScheme) errors.push('Color scheme selection is required');
  if (!userHome.interior) errors.push('Interior selection is required');
  if (!userHome.kitchenAppliance) errors.push('Kitchen appliance selection is required');
  if (!userHome.laundryAppliance) errors.push('Laundry appliance selection is required');
  if (!userHome.lotPremium) errors.push('Lot selection is required');
  
  return errors;
};