// Utility functions for plan pricing calculations

interface Option {
  _id: string;
  name: string;
  price: number;
  classification?: string;
  description?: string;
}

interface InteriorPackage {
  _id: string;
  name: string;
  totalPrice: number;
}

interface LotPremium {
  _id: string;
  filing: number;
  lot: number;
  price: number;
}

interface PlanPricing {
  basePrice: number;
  elevationsTotal: number;
  interiorsTotal: number;
  structuralTotal: number;
  additionalTotal: number;
  kitchenApplianceTotal: number;
  laundryApplianceTotal: number;
  lotPremiumTotal: number;
  grandTotal: number;
}

export const calculateOptionTotal = (
  selectedIds: string[],
  availableOptions: Option[]
): number => {
  return selectedIds.reduce((total, id) => {
    const option = availableOptions.find(opt => opt._id === id);
    return total + (option?.price || 0);
  }, 0);
};

// New function for calculating totals from actual option objects
export const calculateDirectOptionTotal = (options: any[]): number => {
  return options.reduce((total, option) => {
    return total + (option?.price || 0);
  }, 0);
};

export const calculateInteriorTotal = (
  selectedIds: string[],
  availableInteriors: InteriorPackage[]
): number => {
  return selectedIds.reduce((total, id) => {
    const interior = availableInteriors.find(int => int._id === id);
    return total + (interior?.totalPrice || 0);
  }, 0);
};

// New function for calculating totals from actual interior objects
export const calculateDirectInteriorTotal = (interiors: any[]): number => {
  return interiors.reduce((total, interior) => {
    return total + (interior?.totalPrice || 0);
  }, 0);
};

export const calculateLotPremiumTotal = (
  selectedIds: string[],
  availableLots: LotPremium[]
): number => {
  return selectedIds.reduce((total, id) => {
    const lot = availableLots.find(lot => lot._id === id);
    return total + (lot?.price || 0);
  }, 0);
};

// New function for calculating totals from actual lot premium objects
export const calculateDirectLotPremiumTotal = (lots: any[]): number => {
  return lots.reduce((total, lot) => {
    return total + (lot?.price || 0);
  }, 0);
};

export const calculatePlanTotalPricing = (
  basePrice: number,
  selectedOptions: {
    elevations: string[];
    interiors: string[];
    structural: string[];
    additional: string[];
    kitchenAppliance: string[];
    laundryAppliance: string[];
    lotPremiums: string[];
  },
  availableData: {
    options: Option[];
    interiors: InteriorPackage[];
    lotPremiums: LotPremium[];
  }
): PlanPricing => {
  const elevationsTotal = calculateOptionTotal(selectedOptions.elevations, availableData.options);
  const interiorsTotal = calculateInteriorTotal(selectedOptions.interiors, availableData.interiors);
  const structuralTotal = calculateOptionTotal(selectedOptions.structural, availableData.options);
  const additionalTotal = calculateOptionTotal(selectedOptions.additional, availableData.options);
  const kitchenApplianceTotal = calculateOptionTotal(selectedOptions.kitchenAppliance, availableData.options);
  const laundryApplianceTotal = calculateOptionTotal(selectedOptions.laundryAppliance, availableData.options);
  const lotPremiumTotal = calculateLotPremiumTotal(selectedOptions.lotPremiums, availableData.lotPremiums);

  const grandTotal = basePrice + 
    elevationsTotal + 
    interiorsTotal + 
    structuralTotal + 
    additionalTotal + 
    kitchenApplianceTotal + 
    laundryApplianceTotal + 
    lotPremiumTotal;

  return {
    basePrice,
    elevationsTotal,
    interiorsTotal,
    structuralTotal,
    additionalTotal,
    kitchenApplianceTotal,
    laundryApplianceTotal,
    lotPremiumTotal,
    grandTotal
  };
};

// New function for direct option objects
export const calculatePlanDirectPricing = (
  basePrice: number,
  selectedOptions: {
    elevations: any[];
    interiors: any[];
    structural: any[];
    additional: any[];
    kitchenAppliance: any[];
    laundryAppliance: any[];
    lotPremiums: any[];
  }
): PlanPricing => {
  const elevationsTotal = calculateDirectOptionTotal(selectedOptions.elevations);
  const interiorsTotal = calculateDirectInteriorTotal(selectedOptions.interiors);
  const structuralTotal = calculateDirectOptionTotal(selectedOptions.structural);
  const additionalTotal = calculateDirectOptionTotal(selectedOptions.additional);
  const kitchenApplianceTotal = calculateDirectOptionTotal(selectedOptions.kitchenAppliance);
  const laundryApplianceTotal = calculateDirectOptionTotal(selectedOptions.laundryAppliance);
  const lotPremiumTotal = calculateDirectLotPremiumTotal(selectedOptions.lotPremiums);

  const grandTotal = basePrice + 
    elevationsTotal + 
    interiorsTotal + 
    structuralTotal + 
    additionalTotal + 
    kitchenApplianceTotal + 
    laundryApplianceTotal + 
    lotPremiumTotal;

  return {
    basePrice,
    elevationsTotal,
    interiorsTotal,
    structuralTotal,
    additionalTotal,
    kitchenApplianceTotal,
    laundryApplianceTotal,
    lotPremiumTotal,
    grandTotal
  };
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getPriceBreakdown = (pricing: PlanPricing) => {
  const breakdown = [
    { label: 'Base Price', amount: pricing.basePrice, isBase: true },
    { label: 'Elevations', amount: pricing.elevationsTotal },
    { label: 'Interior Packages', amount: pricing.interiorsTotal },
    { label: 'Structural Options', amount: pricing.structuralTotal },
    { label: 'Additional Options', amount: pricing.additionalTotal },
    { label: 'Kitchen Appliances', amount: pricing.kitchenApplianceTotal },
    { label: 'Laundry Appliances', amount: pricing.laundryApplianceTotal },
    { label: 'Lot Premiums', amount: pricing.lotPremiumTotal },
  ].filter(item => item.isBase || item.amount > 0);

  return breakdown;
};

export const getSelectedOptionsCount = (selectedOptions: {
  elevations: string[];
  interiors: string[];
  structural: string[];
  additional: string[];
  kitchenAppliance: string[];
  laundryAppliance: string[];
  lotPremiums: string[];
}): number => {
  return Object.values(selectedOptions).reduce((total, arr) => total + arr.length, 0);
};

// New function for direct option objects
export const getDirectOptionsCount = (selectedOptions: {
  elevations: any[];
  interiors: any[];
  structural: any[];
  additional: any[];
  kitchenAppliance: any[];
  laundryAppliance: any[];
  lotPremiums: any[];
}): number => {
  return Object.values(selectedOptions).reduce((total, arr) => total + arr.length, 0);
};