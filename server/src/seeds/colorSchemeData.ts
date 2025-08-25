// Sample color scheme data for seeding the database
// These replace the previous hardcoded color schemes with proper ColorScheme documents

export const colorSchemeSeedData = [
  {
    name: "Classic White",
    description: "Timeless white exterior with contrasting trim",
    price: 0,
    colorValues: {
      primary: "#f8f9fa",     // Main siding - Classic white
      secondary: "#343a40",   // Trim - Dark gray
      roof: "#6c757d",        // Roof - Medium gray
      accent: "#28a745",      // Door/shutters - Forest green
      foundation: "#495057"   // Foundation - Dark gray
    },
    isActive: true,
    sortOrder: 1
  },
  {
    name: "Warm Beige",
    description: "Cozy beige tones with natural accents",
    price: 0,
    colorValues: {
      primary: "#f5f1eb",     // Main siding - Warm beige
      secondary: "#8b7355",   // Trim - Warm brown
      roof: "#6b5b47",        // Roof - Dark brown
      accent: "#d2691e",      // Door/shutters - Saddle brown
      foundation: "#654321"   // Foundation - Dark brown
    },
    isActive: true,
    sortOrder: 2
  },
  {
    name: "Natural Stone",
    description: "Stone-inspired neutral palette",
    price: 1500,
    colorValues: {
      primary: "#e9ecef",     // Main siding - Light stone
      secondary: "#6c757d",   // Trim - Medium gray
      roof: "#495057",        // Roof - Dark gray
      accent: "#8b4513",      // Door/shutters - Saddle brown
      foundation: "#343a40"   // Foundation - Very dark gray
    },
    isActive: true,
    sortOrder: 3
  },
  {
    name: "Modern Gray",
    description: "Contemporary gray with bold accents",
    price: 2000,
    colorValues: {
      primary: "#6c757d",     // Main siding - Medium gray
      secondary: "#f8f9fa",   // Trim - White
      roof: "#343a40",        // Roof - Dark gray
      accent: "#dc3545",      // Door/shutters - Bold red
      foundation: "#212529"   // Foundation - Very dark
    },
    isActive: true,
    sortOrder: 4
  },
  {
    name: "Charcoal",
    description: "Sophisticated dark exterior with light trim",
    price: 2500,
    colorValues: {
      primary: "#495057",     // Main siding - Charcoal
      secondary: "#f8f9fa",   // Trim - White
      roof: "#212529",        // Roof - Almost black
      accent: "#ffc107",      // Door/shutters - Golden yellow
      foundation: "#343a40"   // Foundation - Dark gray
    },
    isActive: true,
    sortOrder: 5
  },
  {
    name: "Sage Green",
    description: "Calming green exterior with natural tones",
    price: 2200,
    colorValues: {
      primary: "#8fbc8f",     // Main siding - Sage green
      secondary: "#f5f5dc",   // Trim - Beige
      roof: "#556b2f",        // Roof - Dark olive green
      accent: "#8b4513",      // Door/shutters - Saddle brown
      foundation: "#2f4f4f"   // Foundation - Dark slate gray
    },
    isActive: true,
    sortOrder: 6
  },
  {
    name: "Navy Blue",
    description: "Classic navy with crisp white trim",
    price: 2800,
    colorValues: {
      primary: "#1e3a8a",     // Main siding - Navy blue
      secondary: "#ffffff",   // Trim - Pure white
      roof: "#1f2937",        // Roof - Very dark gray
      accent: "#dc2626",      // Door/shutters - Red
      foundation: "#374151"   // Foundation - Dark gray
    },
    isActive: true,
    sortOrder: 7
  },
  {
    name: "Forest Green",
    description: "Deep forest green with natural accents",
    price: 2600,
    colorValues: {
      primary: "#2d5016",     // Main siding - Forest green
      secondary: "#f5f1eb",   // Trim - Cream
      roof: "#1a3009",        // Roof - Very dark green
      accent: "#8b4513",      // Door/shutters - Saddle brown
      foundation: "#2f4f4f"   // Foundation - Dark slate gray
    },
    isActive: true,
    sortOrder: 8
  },
  {
    name: "Desert Sand",
    description: "Warm desert tones with earthy accents",
    price: 1800,
    colorValues: {
      primary: "#ddbf85",     // Main siding - Desert sand
      secondary: "#8b7355",   // Trim - Warm brown
      roof: "#a0522d",        // Roof - Sienna
      accent: "#228b22",      // Door/shutters - Forest green
      foundation: "#654321"   // Foundation - Dark brown
    },
    isActive: true,
    sortOrder: 9
  }
];