// Utility functions for checking lot compatibility with floor plans

export interface PlanDimensions {
  width: number;
  length: number;
}

export interface LotDimensions {
  width: number;
  length: number;
  filing: number;
  lot: number;
}

/**
 * Checks if a floor plan can fit on a lot
 * @param planDimensions - The floor plan dimensions
 * @param lotDimensions - The lot dimensions
 * @param setbackRequirements - Optional setback requirements (defaults to 10ft on all sides)
 * @returns boolean indicating if the plan fits on the lot
 */
export const canPlanFitOnLot = (
  planDimensions: PlanDimensions,
  lotDimensions: LotDimensions,
  setbackRequirements = { front: 10, back: 10, left: 5, right: 5 }
): boolean => {
  // Calculate required lot dimensions including setbacks
  const requiredLotWidth = planDimensions.width + setbackRequirements.left + setbackRequirements.right;
  const requiredLotLength = planDimensions.length + setbackRequirements.front + setbackRequirements.back;

  // Check both orientations of the plan
  const fitsNormalOrientation = 
    lotDimensions.width >= requiredLotWidth && 
    lotDimensions.length >= requiredLotLength;

  const fitsRotatedOrientation = 
    lotDimensions.width >= requiredLotLength && 
    lotDimensions.length >= requiredLotWidth;

  return fitsNormalOrientation || fitsRotatedOrientation;
};

/**
 * Filters lots that can accommodate the given floor plan
 * @param planDimensions - The floor plan dimensions
 * @param availableLots - Array of available lots
 * @param setbackRequirements - Optional setback requirements
 * @returns Array of compatible lots
 */
export const getCompatibleLots = (
  planDimensions: PlanDimensions,
  availableLots: LotDimensions[],
  setbackRequirements = { front: 10, back: 10, left: 5, right: 5 }
): LotDimensions[] => {
  return availableLots.filter(lot => 
    canPlanFitOnLot(planDimensions, lot, setbackRequirements)
  );
};

/**
 * Gets a compatibility message for a specific lot
 * @param planDimensions - The floor plan dimensions
 * @param lotDimensions - The lot dimensions
 * @param setbackRequirements - Optional setback requirements
 * @returns Object with compatibility info and message
 */
export const getLotCompatibilityInfo = (
  planDimensions: PlanDimensions,
  lotDimensions: LotDimensions,
  setbackRequirements = { front: 10, back: 10, left: 5, right: 5 }
) => {
  const canFit = canPlanFitOnLot(planDimensions, lotDimensions, setbackRequirements);
  
  const requiredWidth = planDimensions.width + setbackRequirements.left + setbackRequirements.right;
  const requiredLength = planDimensions.length + setbackRequirements.front + setbackRequirements.back;
  
  const availableWidth = lotDimensions.width;
  const availableLength = lotDimensions.length;
  
  if (canFit) {
    const excessWidth = Math.min(
      availableWidth - requiredWidth,
      availableLength - requiredLength
    );
    const excessLength = Math.max(
      availableWidth - requiredWidth,
      availableLength - requiredLength
    );
    
    return {
      compatible: true,
      message: `Compatible - ${excessWidth}ft × ${excessLength}ft extra space available`,
      excessSpace: { width: excessWidth, length: excessLength }
    };
  } else {
    const shortfallWidth = Math.max(0, requiredWidth - availableWidth);
    const shortfallLength = Math.max(0, requiredLength - availableLength);
    
    if (shortfallWidth > 0 && shortfallLength > 0) {
      return {
        compatible: false,
        message: `Too small - needs ${shortfallWidth}ft more width and ${shortfallLength}ft more length`,
        shortfall: { width: shortfallWidth, length: shortfallLength }
      };
    } else if (shortfallWidth > 0) {
      return {
        compatible: false,
        message: `Too narrow - needs ${shortfallWidth}ft more width`,
        shortfall: { width: shortfallWidth, length: 0 }
      };
    } else {
      return {
        compatible: false,
        message: `Too short - needs ${shortfallLength}ft more length`,
        shortfall: { width: 0, length: shortfallLength }
      };
    }
  }
};