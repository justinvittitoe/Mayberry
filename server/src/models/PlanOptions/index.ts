// Export all plan-specific option schemas and interfaces
export { 
  PlanElevationOption, 
  planElevationOptionSchema 
} from './PlanElevationOption.js';

export { 
  PlanStructuralOption, 
  planStructuralOptionSchema 
} from './PlanStructuralOption.js';

export { 
  PlanInteriorOption, 
  planInteriorOptionSchema 
} from './PlanInteriorOption.js';

export { 
  PlanApplianceOption, 
  planApplianceOptionSchema 
} from './PlanApplianceOption.js';

export { 
  PlanAdditionalOption, 
  planAdditionalOptionSchema 
} from './PlanAdditionalOption.js';

export { 
  PlanLotPremium, 
  planLotPremiumSchema 
} from './PlanLotPremium.js';

// Import types for union type definition
import type { PlanElevationOption } from './PlanElevationOption.js';
import type { PlanStructuralOption } from './PlanStructuralOption.js';
import type { PlanInteriorOption } from './PlanInteriorOption.js';
import type { PlanApplianceOption } from './PlanApplianceOption.js';
import type { PlanAdditionalOption } from './PlanAdditionalOption.js';
import type { PlanLotPremium } from './PlanLotPremium.js';

// Union type for all plan options
export type PlanOption = 
  | PlanElevationOption 
  | PlanStructuralOption 
  | PlanInteriorOption 
  | PlanApplianceOption 
  | PlanAdditionalOption 
  | PlanLotPremium;