import { describe, it, expect } from 'vitest';
import {
  calculateOptionTotal,
  calculateDirectOptionTotal,
  calculateInteriorTotal,
  calculateDirectInteriorTotal,
  calculateLotPremiumTotal,
  calculateDirectLotPremiumTotal,
  calculatePlanTotalPricing,
  calculatePlanDirectPricing,
  formatPrice,
  getPriceBreakdown,
  getSelectedOptionsCount,
  getDirectOptionsCount
} from '../../utils/priceCalculator';

describe('priceCalculator', () => {
  const mockOptions = [
    { _id: '1', name: 'Option 1', price: 1000, classification: 'structural', description: 'Test option 1' },
    { _id: '2', name: 'Option 2', price: 2000, classification: 'additional', description: 'Test option 2' },
    { _id: '3', name: 'Option 3', price: 1500, classification: 'structural', description: 'Test option 3' },
  ];

  const mockInteriors = [
    { _id: 'int1', name: 'Basic Interior', totalPrice: 5000 },
    { _id: 'int2', name: 'Premium Interior', totalPrice: 12000 },
  ];

  const mockLotPremiums = [
    { _id: 'lot1', filing: 1, lot: 101, price: 3000 },
    { _id: 'lot2', filing: 1, lot: 102, price: 5000 },
  ];

  describe('calculateOptionTotal', () => {
    it('should calculate total for selected options', () => {
      const selectedIds = ['1', '3'];
      const result = calculateOptionTotal(selectedIds, mockOptions);
      expect(result).toBe(2500); // 1000 + 1500
    });

    it('should return 0 for empty selection', () => {
      const result = calculateOptionTotal([], mockOptions);
      expect(result).toBe(0);
    });

    it('should handle non-existent option IDs', () => {
      const selectedIds = ['1', 'non-existent', '3'];
      const result = calculateOptionTotal(selectedIds, mockOptions);
      expect(result).toBe(2500); // 1000 + 0 + 1500
    });

    it('should handle options with undefined price', () => {
      const optionsWithUndefined = [
        ...mockOptions,
        { _id: '4', name: 'Option 4', price: undefined as any, classification: 'test', description: 'Test' }
      ];
      const selectedIds = ['1', '4'];
      const result = calculateOptionTotal(selectedIds, optionsWithUndefined);
      expect(result).toBe(1000); // 1000 + 0
    });
  });

  describe('calculateDirectOptionTotal', () => {
    it('should calculate total for direct option objects', () => {
      const options = [mockOptions[0], mockOptions[2]];
      const result = calculateDirectOptionTotal(options);
      expect(result).toBe(2500); // 1000 + 1500
    });

    it('should return 0 for empty array', () => {
      const result = calculateDirectOptionTotal([]);
      expect(result).toBe(0);
    });

    it('should handle options without price', () => {
      const options = [mockOptions[0], { ...mockOptions[1], price: undefined }];
      const result = calculateDirectOptionTotal(options);
      expect(result).toBe(1000); // 1000 + 0
    });
  });

  describe('calculateInteriorTotal', () => {
    it('should calculate total for selected interiors', () => {
      const selectedIds = ['int2'];
      const result = calculateInteriorTotal(selectedIds, mockInteriors);
      expect(result).toBe(12000);
    });

    it('should return 0 for empty selection', () => {
      const result = calculateInteriorTotal([], mockInteriors);
      expect(result).toBe(0);
    });
  });

  describe('calculateDirectInteriorTotal', () => {
    it('should calculate total for direct interior objects', () => {
      const interiors = [mockInteriors[1]];
      const result = calculateDirectInteriorTotal(interiors);
      expect(result).toBe(12000);
    });
  });

  describe('calculateLotPremiumTotal', () => {
    it('should calculate total for selected lot premiums', () => {
      const selectedIds = ['lot2'];
      const result = calculateLotPremiumTotal(selectedIds, mockLotPremiums);
      expect(result).toBe(5000);
    });

    it('should return 0 for empty selection', () => {
      const result = calculateLotPremiumTotal([], mockLotPremiums);
      expect(result).toBe(0);
    });
  });

  describe('calculateDirectLotPremiumTotal', () => {
    it('should calculate total for direct lot premium objects', () => {
      const lots = [mockLotPremiums[1]];
      const result = calculateDirectLotPremiumTotal(lots);
      expect(result).toBe(5000);
    });
  });

  describe('calculatePlanTotalPricing', () => {
    const basePrice = 300000;
    const selectedOptions = {
      elevations: ['1'],
      interiors: ['int1'],
      structural: ['1', '3'],
      additional: ['2'],
      kitchenAppliance: [],
      laundryAppliance: [],
      lotPremiums: ['lot1']
    };
    const availableData = {
      options: mockOptions,
      interiors: mockInteriors,
      lotPremiums: mockLotPremiums
    };

    it('should calculate complete plan pricing', () => {
      const result = calculatePlanTotalPricing(basePrice, selectedOptions, availableData);
      
      expect(result.basePrice).toBe(300000);
      expect(result.elevationsTotal).toBe(1000);
      expect(result.interiorsTotal).toBe(5000);
      expect(result.structuralTotal).toBe(2500); // 1000 + 1500
      expect(result.additionalTotal).toBe(2000);
      expect(result.kitchenApplianceTotal).toBe(0);
      expect(result.laundryApplianceTotal).toBe(0);
      expect(result.lotPremiumTotal).toBe(3000);
      expect(result.grandTotal).toBe(313500); // 300000 + 1000 + 5000 + 2500 + 2000 + 0 + 0 + 3000
    });

    it('should handle empty selections', () => {
      const emptySelections = {
        elevations: [],
        interiors: [],
        structural: [],
        additional: [],
        kitchenAppliance: [],
        laundryAppliance: [],
        lotPremiums: []
      };
      
      const result = calculatePlanTotalPricing(basePrice, emptySelections, availableData);
      expect(result.grandTotal).toBe(basePrice);
    });
  });

  describe('calculatePlanDirectPricing', () => {
    const basePrice = 300000;
    const selectedOptions = {
      elevations: [mockOptions[0]],
      interiors: [mockInteriors[0]],
      structural: [mockOptions[0], mockOptions[2]],
      additional: [mockOptions[1]],
      kitchenAppliance: [],
      laundryAppliance: [],
      lotPremiums: [mockLotPremiums[0]]
    };

    it('should calculate complete plan pricing with direct objects', () => {
      const result = calculatePlanDirectPricing(basePrice, selectedOptions);
      
      expect(result.basePrice).toBe(300000);
      expect(result.elevationsTotal).toBe(1000);
      expect(result.interiorsTotal).toBe(5000);
      expect(result.structuralTotal).toBe(2500); // 1000 + 1500
      expect(result.additionalTotal).toBe(2000);
      expect(result.lotPremiumTotal).toBe(3000);
      expect(result.grandTotal).toBe(313500);
    });
  });

  describe('formatPrice', () => {
    it('should format price as currency', () => {
      expect(formatPrice(100000)).toBe('$100,000');
      expect(formatPrice(1234.56)).toBe('$1,235'); // Rounds to nearest dollar
      expect(formatPrice(0)).toBe('$0');
    });

    it('should handle negative values', () => {
      expect(formatPrice(-1000)).toBe('-$1,000');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(1500000)).toBe('$1,500,000');
    });
  });

  describe('getPriceBreakdown', () => {
    const pricing = {
      basePrice: 300000,
      elevationsTotal: 1000,
      interiorsTotal: 5000,
      structuralTotal: 2500,
      additionalTotal: 2000,
      kitchenApplianceTotal: 1500,
      laundryApplianceTotal: 0,
      lotPremiumTotal: 3000,
      grandTotal: 315000
    };

    it('should return breakdown with non-zero items', () => {
      const breakdown = getPriceBreakdown(pricing);
      
      // Should include base price and all non-zero items
      expect(breakdown).toHaveLength(7); // All except laundryApplianceTotal (0)
      expect(breakdown[0]).toEqual({ label: 'Base Price', amount: 300000, isBase: true });
      expect(breakdown.find(item => item.label === 'Laundry Appliances')).toBeUndefined();
    });

    it('should always include base price even if zero', () => {
      const pricingWithZeroBase = { ...pricing, basePrice: 0 };
      const breakdown = getPriceBreakdown(pricingWithZeroBase);
      
      expect(breakdown[0]).toEqual({ label: 'Base Price', amount: 0, isBase: true });
    });
  });

  describe('getSelectedOptionsCount', () => {
    it('should count total selected options', () => {
      const selectedOptions = {
        elevations: ['1'],
        interiors: ['int1', 'int2'],
        structural: ['1', '2', '3'],
        additional: [],
        kitchenAppliance: ['kit1'],
        laundryAppliance: [],
        lotPremiums: ['lot1']
      };

      const count = getSelectedOptionsCount(selectedOptions);
      expect(count).toBe(8); // 1 + 2 + 3 + 0 + 1 + 0 + 1
    });

    it('should return 0 for empty selections', () => {
      const emptyOptions = {
        elevations: [],
        interiors: [],
        structural: [],
        additional: [],
        kitchenAppliance: [],
        laundryAppliance: [],
        lotPremiums: []
      };

      const count = getSelectedOptionsCount(emptyOptions);
      expect(count).toBe(0);
    });
  });

  describe('getDirectOptionsCount', () => {
    it('should count total direct options', () => {
      const selectedOptions = {
        elevations: [mockOptions[0]],
        interiors: [mockInteriors[0], mockInteriors[1]],
        structural: [mockOptions[0], mockOptions[1]],
        additional: [],
        kitchenAppliance: [mockOptions[2]],
        laundryAppliance: [],
        lotPremiums: [mockLotPremiums[0]]
      };

      const count = getDirectOptionsCount(selectedOptions);
      expect(count).toBe(7); // 1 + 2 + 2 + 0 + 1 + 0 + 1
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined values gracefully', () => {
      const result = calculateDirectOptionTotal([
        { price: null as any },
        { price: undefined as any },
        { price: 1000 }
      ]);
      expect(result).toBe(1000);
    });

    it('should handle malformed objects', () => {
      const result = calculateDirectOptionTotal([
        {} as any,
        { price: 'not a number' as any },
        { price: 1000 }
      ]);
      expect(result).toBe(1000);
    });

    it('should handle very large numbers', () => {
      const largePrice = Number.MAX_SAFE_INTEGER;
      const result = calculateDirectOptionTotal([{ price: largePrice }]);
      expect(result).toBe(largePrice);
    });
  });
});