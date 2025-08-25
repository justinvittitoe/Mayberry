import { ColorZoneMapping } from '../components/ColorableSVG';

// Color zone mappings for different elevation SVGs
// Each mapping defines which SVG elements correspond to different house color zones

export const beaconModernColorZones: ColorZoneMapping = {
  // Primary color zone: Main house structure/siding (red elements in original SVG)
  primary: [
    'g[fill="#f05a5a"]',           // Main red group
    'path[fill="#f05a5a"]',        // Individual red paths
    '*[fill="#f05a5a"]'            // Any element with this fill
  ],
  
  // Secondary color zone: Trim, window frames, architectural details (yellow/gold elements)
  secondary: [
    'g[fill="#f0bf5a"]',           // Gold/yellow groups
    'path[fill="#f0bf5a"]',        // Individual gold/yellow paths
    '*[fill="#f0bf5a"]'            // Any element with this fill
  ],
  
  // Roof color zone: Roof elements (blue elements)
  roof: [
    'g[fill="#5a9df0"]',           // Blue groups (roof)
    'path[fill="#5a9df0"]',        // Individual blue paths
    '*[fill="#5a9df0"]'            // Any element with this fill
  ],
  
  // Accent color zone: Doors, shutters, special features (green elements)
  accent: [
    'g[fill="#5af05d"]',           // Light green groups
    'path[fill="#5af05d"]',        // Individual light green paths
    '*[fill="#5af05d"]',           // Any element with this fill
    'g[fill="#82f05a"]',           // Different green shade
    'path[fill="#82f05a"]',        // Individual paths
    '*[fill="#82f05a"]'            // Any element with this fill
  ],
  
  // Foundation color zone: Foundation elements (pink/purple elements)
  foundation: [
    'g[fill="#f05ace"]',           // Pink/purple groups
    'path[fill="#f05ace"]',        // Individual pink/purple paths
    '*[fill="#f05ace"]'            // Any element with this fill
  ]
};

// Default fallback mapping for SVGs without specific configuration
export const defaultColorZones: ColorZoneMapping = {
  primary: ['g:first-child', 'path:first-child'],
  secondary: ['g:nth-child(2)', 'path:nth-child(2)'],
  roof: ['g:nth-child(3)', 'path:nth-child(3)'],
  accent: ['g:nth-child(4)', 'path:nth-child(4)'],
  foundation: ['g:last-child', 'path:last-child']
};

// Registry of color zone mappings by elevation name/ID
export const colorZoneMappingRegistry: Record<string, ColorZoneMapping> = {
  'beacon-modern': beaconModernColorZones,
  'plan-0-modern': beaconModernColorZones,  // Alternative naming
  'default': defaultColorZones
};

/**
 * Get color zone mapping for a specific elevation
 * @param elevationKey - Key to identify the elevation (e.g., 'beacon-modern')
 * @returns ColorZoneMapping configuration
 */
export const getColorZoneMapping = (elevationKey: string): ColorZoneMapping => {
  return colorZoneMappingRegistry[elevationKey] || defaultColorZones;
};

/**
 * Generate elevation key from plan and elevation data
 * @param planType - Plan type number or name
 * @param elevationName - Elevation name
 * @returns String key for color zone mapping lookup
 */
export const generateElevationKey = (planType: number | string, elevationName: string): string => {
  const planKey = typeof planType === 'number' ? `plan-${planType}` : planType.toLowerCase();
  const elevationKey = elevationName.toLowerCase().replace(/\s+/g, '-');
  return `${planKey}-${elevationKey}`;
};