// Comprehensive seed data for 8 Mayberry floor plans
// This data includes all required fields matching the updated Plan schema

export const floorPlanSeedData = [
  {
    planType: 0,
    name: "The Beacon",
    bedrooms: 4,
    bathrooms: 2.5,
    squareFootage: 1620,
    garageType: "2-Car Garage",
    basePrice: 399207,
    description: "Cozy two story home perfect for first-time buyers. Features an open-concept living area, spacious master suite, and efficient use of space throughout.",
    elevations: [
      { name: "Farmhouse", price: 0, classification: "elevation", description: "Classic brick and siding exterior with traditional styling", img: "standard-elevation-a.jpg" },
      { name: "Prairie", price: 0, classification: "elevation", description: "Stone and siding exterior with craftsman details", img: "standard-elevation-b.jpg" }
    ],
    colorScheme: [5, 7, 8, 14, 16],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b1",
        name: "Casual",
        totalPrice: 15000,
        fixtures: [{ name: "Standard fixtures", price: 1000, classification: "fixture", description: "Basic bathroom and kitchen fixtures" }],
        lvp: [{ name: "Standard LVP flooring", price: 2000, classification: "flooring", description: "Standard vinyl plank flooring" }],
        carpet: [{ name: "Standard carpet", price: 1500, classification: "flooring", description: "Basic carpet flooring" }],
        backsplash: [{ name: "Subway tile backsplash", price: 800, classification: "tile", description: "Classic subway tile" }],
        masterBathTile: [{ name: "Standard ceramic tile", price: 1200, classification: "tile", description: "Basic ceramic bathroom tile" }],
        countertop: [{ name: "Laminate countertops", price: 1500, classification: "countertop", description: "Standard laminate countertops" }],
        primaryCabinets: [{ name: "White shaker cabinets", price: 4000, classification: "cabinet", description: "White painted shaker style cabinets" }],
        secondaryCabinets: [{ name: "Matching white cabinets", price: 2000, classification: "cabinet", description: "Matching secondary cabinets" }],
        upgrade: false
      }
    ],
    structural: [
      { name: "Covered Patio", price: 0, classification: "structural", description: "Covered outdoor living space", img: "coveredPatio.jpg", width: 12, length: 20 }
    ],
    additional: [
      { name: "Air-conditioning", price: 0, classification: "additional", description: "Air conditioning", img: "screened-porch.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 0", price: 0, classification: "kitchen-appliance", description: "Basic appliance package with all essentials", img: "standard-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance A", price: 0, classification: "laundry-appliance", description: "Basic washer and dryer connections", img: "standard-laundry.jpg" }
    ],
    width: 35,
    length: 41,
  },
  {
    planType: 1,
    name: "The Aster",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1710,
    garageType: "3-Car Garage",
    basePrice: 433465,
    description: "Open-concept ranch style living with modern amenities. Includes a powder room for guests, and large kitchen island.",
    elevations: [
      { name: "Modern", price: 0, classification: "elevation", description: "Full stone exterior with premium architectural details", img: "premium-stone-elevation.jpg" },
      { name: "Ranch", price: 0, classification: "elevation", description: "Premium materials with custom architectural features", img: "luxury-elevation.jpg" }
    ],
    colorScheme: [2, 8, 9, 13, 16],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b2",
        name: "Casual Upgrade",
        totalPrice: 25000,
        fixtures: [{ name: "Upgraded fixtures", price: 1800, classification: "fixture", description: "Premium bathroom and kitchen fixtures" }],
        lvp: [{ name: "Upgraded LVP flooring", price: 3000, classification: "flooring", description: "Premium vinyl plank flooring" }],
        carpet: [{ name: "Premium carpet", price: 2200, classification: "flooring", description: "High-quality carpet flooring" }],
        backsplash: [{ name: "Designer tile backsplash", price: 1200, classification: "tile", description: "Premium designer tile" }],
        masterBathTile: [{ name: "Porcelain tile", price: 1800, classification: "tile", description: "Premium porcelain bathroom tile" }],
        countertop: [{ name: "Quartz countertops", price: 3500, classification: "countertop", description: "Engineered quartz countertops" }],
        primaryCabinets: [{ name: "Upgraded shaker cabinets", price: 6000, classification: "cabinet", description: "Premium shaker style cabinets" }],
        secondaryCabinets: [{ name: "Matching upgraded cabinets", price: 3000, classification: "cabinet", description: "Matching premium secondary cabinets" }],
        upgrade: true
      }
    ],
    structural: [
      { name: "4-Car Garage", price: 0, classification: "structural", description: "Large 4-car garage option for our car enthusiasts", img: "4-CarGarage.jpg", width: 40, length: 24 }
    ],
    additional: [
      { name: "Faux Wood Window Coverings", price: 0, classification: "additional", description: "Window coverings", img: "windowCoverings1.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 1", price: 0, classification: "kitchen-appliance", description: "Upgraded stainless steel appliances throughout", img: "stainless-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance B", price: 0, classification: "laundry-appliance", description: "Premium washer/dryer with utility sink", img: "upgraded-laundry.jpg" }
    ],
    width: 40,
    length: 62
  },
  {
    planType: 2,
    name: "The Floresta",
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 2001,
    garageType: "3-Car Garage",
    basePrice: 451485,
    description: "Spacious family home with bonus room down stairs. Features formal dining room, large family room, and generous walk-in closets.",
    elevations: [
      { name: "Farmhouse", price: 0, classification: "elevation", description: "Classic brick and siding exterior with traditional styling", img: "standard-elevation-a.jpg" },
      { name: "Modern", price: 0, classification: "elevation", description: "Full stone exterior with premium architectural details", img: "premium-stone-elevation.jpg" }
    ],
    colorScheme: [1, 2, 5, 10, 16],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b3",
        name: "Farmhouse",
        totalPrice: 30000,
        fixtures: [{ name: "Farmhouse style fixtures", price: 2200, classification: "fixture", description: "Rustic farmhouse style fixtures" }],
        lvp: [{ name: "Wide plank LVP", price: 3500, classification: "flooring", description: "Wide plank luxury vinyl flooring" }],
        carpet: [{ name: "Textured carpet", price: 2500, classification: "flooring", description: "Textured premium carpet" }],
        backsplash: [{ name: "Farmhouse tile", price: 1500, classification: "tile", description: "Farmhouse style backsplash tile" }],
        masterBathTile: [{ name: "Natural stone tile", price: 2500, classification: "tile", description: "Natural stone bathroom tile" }],
        countertop: [{ name: "Butcher block counters", price: 2800, classification: "countertop", description: "Solid wood butcher block countertops" }],
        primaryCabinets: [{ name: "Farmhouse style cabinets", price: 7000, classification: "cabinet", description: "Rustic farmhouse style cabinets" }],
        secondaryCabinets: [{ name: "Open shelving", price: 1500, classification: "cabinet", description: "Rustic open shelving" }],
        upgrade: true
      }
    ],
    structural: [
      { name: "Loft Option", price: 0, classification: "structural", description: "Convert a bedroom to a loft", img: "loft.jpg", width: 14, length: 16 }
    ],
    additional: [
      { name: "Roller Window Coverings", price: 0, classification: "additional", description: "Window coverings", img: "windowCoverings2.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 2", price: 0, classification: "kitchen-appliance", description: "High-end appliances with smart home integration", img: "premium-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance A", price: 0, classification: "laundry-appliance", description: "Basic washer and dryer connections", img: "standard-laundry.jpg" }
    ],
    width: 35,
    length: 56
  },
  {
    planType: 3,
    name: "The Terramar",
    bedrooms: 5,
    bathrooms: 3,
    squareFootage: 2388,
    garageType: "3-Car Garage",
    basePrice: 583973,
    description: "Luxury living with premium finishes throughout. Master suite with sitting area, gourmet kitchen with butler's pantry, and covered outdoor living space.",
    elevations: [
      { name: "Prairie", price: 0, classification: "elevation", description: "Stone and siding exterior with craftsman details", img: "standard-elevation-b.jpg" },
      { name: "Ranch", price: 0, classification: "elevation", description: "Premium materials with custom architectural features", img: "luxury-elevation.jpg" }
    ],
    colorScheme: [5, 7, 11, 14, 19],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b4",
        name: "Farmhouse Upgrade",
        totalPrice: 40000,
        fixtures: [{ name: "Premium farmhouse fixtures", price: 3000, classification: "fixture", description: "High-end farmhouse style fixtures" }],
        lvp: [{ name: "Premium wide plank LVP", price: 4000, classification: "flooring", description: "Premium wide plank luxury vinyl" }],
        carpet: [{ name: "Premium textured carpet", price: 3000, classification: "flooring", description: "Luxury textured carpet" }],
        backsplash: [{ name: "Custom farmhouse tile", price: 2000, classification: "tile", description: "Custom designed farmhouse tile" }],
        masterBathTile: [{ name: "Premium natural stone", price: 3500, classification: "tile", description: "Premium natural stone tile" }],
        countertop: [{ name: "Premium butcher block", price: 4000, classification: "countertop", description: "Premium hardwood butcher block" }],
        primaryCabinets: [{ name: "Custom farmhouse cabinets", price: 9000, classification: "cabinet", description: "Custom farmhouse style cabinets" }],
        secondaryCabinets: [{ name: "Custom open shelving", price: 2500, classification: "cabinet", description: "Custom rustic open shelving" }],
        upgrade: true
      }
    ],
    structural: [
      { name: "5-Car Garage", price: 0, classification: "structural", description: "Large 5-car garage option for our car enthusiasts", img: "5-CarGarage.jpg", width: 60, length: 24 }
    ],
    additional: [
      { name: "Laundry Upgrade", price: 0, classification: "additional", description: "Additional cabinets and sink in the laundry room.", img: "laundryUpgrade.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 2", price: 0, classification: "kitchen-appliance", description: "High-end appliances with smart home integration", img: "premium-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance B", price: 0, classification: "laundry-appliance", description: "Premium washer/dryer with utility sink", img: "upgraded-laundry.jpg" }
    ],
    width: 40,
    length: 73
  },
  {
    planType: 4,
    name: "The Woodlyn",
    bedrooms: 5,
    bathrooms: 3,
    squareFootage: 2864,
    garageType: "3-Car Garage",
    basePrice: 503954,
    description: "Executive home with home office and guest suite. Features coffered ceilings, mudroom with built-ins, and screened porch.",
    elevations: [
      { name: "Farmhouse", price: 0, classification: "elevation", description: "Classic brick and siding exterior with traditional styling", img: "standard-elevation-a.jpg" },
      { name: "Prairie", price: 0, classification: "elevation", description: "Stone and siding exterior with craftsman details", img: "standard-elevation-b.jpg" }
    ],
    colorScheme: [6, 7, 13, 17, 20],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b5",
        name: "Casual",
        totalPrice: 15000,
        fixtures: [{ name: "Standard fixtures", price: 1000, classification: "fixture", description: "Basic bathroom and kitchen fixtures" }],
        lvp: [{ name: "Standard LVP flooring", price: 2000, classification: "flooring", description: "Standard vinyl plank flooring" }],
        carpet: [{ name: "Standard carpet", price: 1500, classification: "flooring", description: "Basic carpet flooring" }],
        backsplash: [{ name: "Subway tile backsplash", price: 800, classification: "tile", description: "Classic subway tile" }],
        masterBathTile: [{ name: "Standard ceramic tile", price: 1200, classification: "tile", description: "Basic ceramic bathroom tile" }],
        countertop: [{ name: "Laminate countertops", price: 1500, classification: "countertop", description: "Standard laminate countertops" }],
        primaryCabinets: [{ name: "White shaker cabinets", price: 4000, classification: "cabinet", description: "White painted shaker style cabinets" }],
        secondaryCabinets: [{ name: "Matching white cabinets", price: 2000, classification: "cabinet", description: "Matching secondary cabinets" }],
        upgrade: false
      }
    ],
    structural: [
      { name: "RV Garage", price: 0, classification: "structural", description: "RV garage for our adventure enthusiasts", img: "RVGarage.jpg", width: 14, length: 50 }
    ],
    additional: [
      { name: "Finish Upgrade", price: 0, classification: "additional", description: "Additional finishes including wood window sills.", img: "finishUpgrade.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 1", price: 0, classification: "kitchen-appliance", description: "Upgraded stainless steel appliances throughout", img: "stainless-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance A", price: 0, classification: "laundry-appliance", description: "Basic washer and dryer connections", img: "standard-laundry.jpg" }
    ],
    width: 40,
    length: 73
  },
  {
    planType: 5,
    name: "The Roseland",
    bedrooms: 5,
    bathrooms: 3.5,
    squareFootage: 3247,
    garageType: "3-Car Garage",
    basePrice: 573641,
    description: "Grand two-story with formal dining and study. Impressive two-story foyer, curved staircase, and master suite with luxury bathroom and walk-in closet.",
    elevations: [
      { name: "Modern", price: 0, classification: "elevation", description: "Full stone exterior with premium architectural details", img: "premium-stone-elevation.jpg" },
      { name: "Ranch", price: 0, classification: "elevation", description: "Premium materials with custom architectural features", img: "luxury-elevation.jpg" }
    ],
    colorScheme: [9, 11, 12, 16, 18],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b6",
        name: "Casual Upgrade",
        totalPrice: 25000,
        fixtures: [{ name: "Upgraded fixtures", price: 1800, classification: "fixture", description: "Premium bathroom and kitchen fixtures" }],
        lvp: [{ name: "Upgraded LVP flooring", price: 3000, classification: "flooring", description: "Premium vinyl plank flooring" }],
        carpet: [{ name: "Premium carpet", price: 2200, classification: "flooring", description: "High-quality carpet flooring" }],
        backsplash: [{ name: "Designer tile backsplash", price: 1200, classification: "tile", description: "Premium designer tile" }],
        masterBathTile: [{ name: "Porcelain tile", price: 1800, classification: "tile", description: "Premium porcelain bathroom tile" }],
        countertop: [{ name: "Quartz countertops", price: 3500, classification: "countertop", description: "Engineered quartz countertops" }],
        primaryCabinets: [{ name: "Upgraded shaker cabinets", price: 6000, classification: "cabinet", description: "Premium shaker style cabinets" }],
        secondaryCabinets: [{ name: "Matching upgraded cabinets", price: 3000, classification: "cabinet", description: "Matching premium secondary cabinets" }],
        upgrade: true
      }
    ],
    structural: [
      { name: "Multi-Generational Unit", price: 0, classification: "structural", description: "ADU attachment for our multi-generational buyers", img: "Multigenerational.jpg", width: 24, length: 32 }
    ],
    additional: [
      { name: "BBQ Stub-out", price: 0, classification: "additional", description: "BBQ gas stub out in the rear yard.", img: "BBQStub.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 0", price: 0, classification: "kitchen-appliance", description: "Basic appliance package with all essentials", img: "standard-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance B", price: 0, classification: "laundry-appliance", description: "Premium washer/dryer with utility sink", img: "upgraded-laundry.jpg" }
    ],
    width: 60,
    length: 72
  },
  {
    planType: 6,
    name: "The Bristol",
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 2227,
    garageType: "3-Car Garage",
    basePrice: 477503,
    description: "Stunning home with master suite retreat on main floor. Features keeping an open concept, media room, and guest suite with private bath.",
    elevations: [
      { name: "Prairie", price: 0, classification: "elevation", description: "Stone and siding exterior with craftsman details", img: "standard-elevation-b.jpg" },
      { name: "Modern", price: 0, classification: "elevation", description: "Full stone exterior with premium architectural details", img: "premium-stone-elevation.jpg" }
    ],
    colorScheme: [10, 14, 16, 17, 19],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b7",
        name: "Farmhouse",
        totalPrice: 30000,
        fixtures: [{ name: "Farmhouse style fixtures", price: 2200, classification: "fixture", description: "Rustic farmhouse style fixtures" }],
        lvp: [{ name: "Wide plank LVP", price: 3500, classification: "flooring", description: "Wide plank luxury vinyl flooring" }],
        carpet: [{ name: "Textured carpet", price: 2500, classification: "flooring", description: "Textured premium carpet" }],
        backsplash: [{ name: "Farmhouse tile", price: 1500, classification: "tile", description: "Farmhouse style backsplash tile" }],
        masterBathTile: [{ name: "Natural stone tile", price: 2500, classification: "tile", description: "Natural stone bathroom tile" }],
        countertop: [{ name: "Butcher block counters", price: 2800, classification: "countertop", description: "Solid wood butcher block countertops" }],
        primaryCabinets: [{ name: "Farmhouse style cabinets", price: 7000, classification: "cabinet", description: "Rustic farmhouse style cabinets" }],
        secondaryCabinets: [{ name: "Open shelving", price: 1500, classification: "cabinet", description: "Rustic open shelving" }],
        upgrade: true
      }
    ],
    structural: [
      { name: "Covered Patio", price: 0, classification: "structural", description: "Covered outdoor living space", img: "coveredPatio.jpg", width: 16, length: 24 }
    ],
    additional: [
      { name: "Rear Deck 12 x 20", price: 0, classification: "additional", description: "Additional cabinets and sink in the laundry room.", img: "RearDeck.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 2", price: 0, classification: "kitchen-appliance", description: "High-end appliances with smart home integration", img: "premium-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance A", price: 0, classification: "laundry-appliance", description: "Basic washer and dryer connections", img: "standard-laundry.jpg" }
    ],
    width: 50,
    length: 65
  },
  {
    planType: 7,
    name: "The Havenwood",
    bedrooms: 4,
    bathrooms: 2.5,
    squareFootage: 2208,
    garageType: "3-Car Garage",
    basePrice: 461968,
    description: "Premier floor plan with luxury throughout. Grand foyer, formal living and dining rooms, gourmet kitchen with double islands, and expansive master suite with sitting room.",
    elevations: [
      { name: "Ranch", price: 0, classification: "elevation", description: "Premium materials with custom architectural features", img: "luxury-elevation.jpg" },
      { name: "Farmhouse", price: 0, classification: "elevation", description: "Classic brick and siding exterior with traditional styling", img: "standard-elevation-a.jpg" }
    ],
    colorScheme: [1, 6, 12, 14, 16],
    interiors: [
      {
        _id: "60f7b3b3b3b3b3b3b3b3b3b8",
        name: "Farmhouse Upgrade",
        totalPrice: 40000,
        fixtures: [{ name: "Premium farmhouse fixtures", price: 3000, classification: "fixture", description: "High-end farmhouse style fixtures" }],
        lvp: [{ name: "Premium wide plank LVP", price: 4000, classification: "flooring", description: "Premium wide plank luxury vinyl" }],
        carpet: [{ name: "Premium textured carpet", price: 3000, classification: "flooring", description: "Luxury textured carpet" }],
        backsplash: [{ name: "Custom farmhouse tile", price: 2000, classification: "tile", description: "Custom designed farmhouse tile" }],
        masterBathTile: [{ name: "Premium natural stone", price: 3500, classification: "tile", description: "Premium natural stone tile" }],
        countertop: [{ name: "Premium butcher block", price: 4000, classification: "countertop", description: "Premium hardwood butcher block" }],
        primaryCabinets: [{ name: "Custom farmhouse cabinets", price: 9000, classification: "cabinet", description: "Custom farmhouse style cabinets" }],
        secondaryCabinets: [{ name: "Custom open shelving", price: 2500, classification: "cabinet", description: "Custom rustic open shelving" }],
        upgrade: true
      }
    ],
    structural: [
      { name: "Loft Option", price: 0, classification: "structural", description: "Convert a bedroom to a loft", img: "loft.jpg", width: 20, length: 16 }
    ],
    additional: [
      { name: "Electric Upgrade 2", price: 0, classification: "additional", description: "Solor Conduit to roof, 50Amp EV outlet, under cabinet lights, additional bedrooms ceiling fan pre-wire, 2 under eave light switches.", img: "ElectricUpgrade1.jpg" }
    ],
    kitchenAppliance: [
      { name: "Appliance Package 1", price: 0, classification: "kitchen-appliance", description: "Upgraded stainless steel appliances throughout", img: "stainless-appliances.jpg" }
    ],
    laundryAppliance: [
      { name: "Laundry Appliance B", price: 0, classification: "laundry-appliance", description: "Premium washer/dryer with utility sink", img: "upgraded-laundry.jpg" }
    ],
    width: 40,
    length: 51
  }
];

// Sample options that can be associated with plans
export const floorPlanOptions = [
  // Elevation Options
  {
    name: "Farmhouse",
    price: 0,
    classification: "elevation",
    description: "Classic brick and siding exterior with traditional styling",
    img: "standard-elevation-a.jpg"
  },
  {
    name: "Prairie", 
    price: 0,
    classification: "elevation",
    description: "Stone and siding exterior with craftsman details",
    img: "standard-elevation-b.jpg"
  },
  {
    name: "Modern",
    price: 0,
    classification: "elevation", 
    description: "Full stone exterior with premium architectural details",
    img: "premium-stone-elevation.jpg"
  },
  {
    name: "Ranch",
    price: 0,
    classification: "elevation",
    description: "Premium materials with custom architectural features",
    img: "luxury-elevation.jpg"
  },

  // Kitchen Appliances
  {
    name: "Appliance Package 0",
    price: 0,
    classification: "kitchen-appliance",
    description: "Basic appliance package with all essentials",
    img: "standard-appliances.jpg"
  },
  {
    name: "Appliance Package 1",
    price: 0,
    classification: "kitchen-appliance", 
    description: "Upgraded stainless steel appliances throughout",
    img: "stainless-appliances.jpg"
  },
  {
    name: "Appliance Package 2",
    price: 0,
    classification: "kitchen-appliance",
    description: "High-end appliances with smart home integration",
    img: "premium-appliances.jpg"
  },

  // Laundry Appliances
  {
    name: "Laundry Appliance A",
    price: 0,
    classification: "laundry-appliance",
    description: "Basic washer and dryer connections",
    img: "standard-laundry.jpg"
  },
  {
    name: "Laundry Appliance B",
    price: 0,
    classification: "laundry-appliance",
    description: "Premium washer/dryer with utility sink",
    img: "upgraded-laundry.jpg"
  },

  // Structural Options
  {
    name: "5-Car Garage",
    price: 0,
    classification: "structural",
    description: "Large 5-car garage option for our car enthusiasts",
    img: "5-CarGarage.jpg"
  },
  {
    name: "4-Car Garage",
    price: 0,
    classification: "structural",
    description: "Large 5-car garage option for our car enthusiasts",
    img: "4-CarGarage.jpg"
  },
  {
    name: "RV Garage",
    price: 0,
    classification: "structural", 
    description: "RV garage for our adventure enthusiasts",
    img: "RVGarage.jpg"
  },
  {
    name: "Multi-Generational Unit",
    price: 0,
    classification: "structural",
    description: "ADU attachment for our multi-generational buyers",
    img: "Multigenerational.jpg"
  },
  {
    name: "Covered Patio",
    price: 0,
    classification: "structural",
    description: "Covered outdoor living space",
    img: "coveredPatio.jpg"
  },
  {
    name: "Loft Option",
    price: 0,
    classification: "structural",
    description: "Convert a bedroom to a loft",
    img: "loft.jpg"
  },

  // Additional Options
  {
    name: "Air-conditioning",
    price: 0,
    classification: "additional",
    description: "Air conditioning",
    img: "screened-porch.jpg"
  },
  {
    name: "Faux Wood Window Coverings",
    price: 0,
    classification: "additional",
    description: "Window coverings",
    img: "windowCoverings1.jpg"
  },
  {
    name: "Roller Window Coverings",
    price: 0,
    classification: "additional",
    description: "Window coverings",
    img: "windowCoverings2.jpg"
  },
  {
    name: "Laundry Upgrade",
    price: 0,
    classification: "additional",
    description: "Additional cabinets and sink in the laundry room.",
    img: "laundryUpgrade.jpg"
  },
  {
    name: "Finish Upgrade",
    price: 0,
    classification: "additional",
    description: "Additional finishes including wood window sills.",
    img: "finishUpgrade.jpg"
  },
  {
    name: "BBQ Stub-out",
    price: 0,
    classification: "additional",
    description: "BBQ gas stub out in the rear yard.",
    img: "BBQStub.jpg"
  },
  {
    name: "Rear Deck 12 x 20",
    price: 0,
    classification: "additional",
    description: "Additional cabinets and sink in the laundry room.",
    img: "RearDeck.jpg"
  },
  {
    name: "Electric Upgrade 1",
    price: 0,
    classification: "additional",
    description: "Solor Conduit to roof and 50Amp EV outlet.",
    img: "ElectricUpgrade1.jpg"
  },
  {
    name: "Electric Upgrade 2",
    price: 0,
    classification: "additional",
    description: "Solor Conduit to roof, 50Amp EV outlet, under cabinet lights, additional bedrooms ceiling fan pre-wire, 2 under eave light switches.",
    img: "ElectricUpgrade1.jpg"
  }

];

export const floorPlanInteriorPackages = [
  {
    name: "Casual",
    totalPrice: 15000,
    fixtures: [
      { name: "Standard fixtures", price: 1000, classification: "fixture", description: "Basic bathroom and kitchen fixtures" }
    ],
    lvp: [
      { name: "Standard LVP flooring", price: 2000, classification: "flooring", description: "Standard vinyl plank flooring" }
    ],
    carpet: [
      { name: "Standard carpet", price: 1500, classification: "flooring", description: "Basic carpet flooring" }
    ],
    backsplash: [
      { name: "Subway tile backsplash", price: 800, classification: "tile", description: "Classic subway tile" }
    ],
    masterBathTile: [
      { name: "Standard ceramic tile", price: 1200, classification: "tile", description: "Basic ceramic bathroom tile" }
    ],
    countertop: [
      { name: "Laminate countertops", price: 1500, classification: "countertop", description: "Standard laminate countertops" }
    ],
    primaryCabinets: [
      { name: "White shaker cabinets", price: 4000, classification: "cabinet", description: "White painted shaker style cabinets" }
    ],
    secondaryCabinets: [
      { name: "Matching white cabinets", price: 2000, classification: "cabinet", description: "Matching secondary cabinets" }
    ],
    upgrade: false
  },
  {
    name: "Casual Upgrade", 
    totalPrice: 25000,
    fixtures: [
      { name: "Upgraded fixtures", price: 1800, classification: "fixture", description: "Premium bathroom and kitchen fixtures" }
    ],
    lvp: [
      { name: "Upgraded LVP flooring", price: 3000, classification: "flooring", description: "Premium vinyl plank flooring" }
    ],
    carpet: [
      { name: "Premium carpet", price: 2200, classification: "flooring", description: "High-quality carpet flooring" }
    ],
    backsplash: [
      { name: "Designer tile backsplash", price: 1200, classification: "tile", description: "Premium designer tile" }
    ],
    masterBathTile: [
      { name: "Porcelain tile", price: 1800, classification: "tile", description: "Premium porcelain bathroom tile" }
    ],
    countertop: [
      { name: "Quartz countertops", price: 3500, classification: "countertop", description: "Engineered quartz countertops" }
    ],
    primaryCabinets: [
      { name: "Upgraded shaker cabinets", price: 6000, classification: "cabinet", description: "Premium shaker style cabinets" }
    ],
    secondaryCabinets: [
      { name: "Matching upgraded cabinets", price: 3000, classification: "cabinet", description: "Matching premium secondary cabinets" }
    ],
    upgrade: true
  },
  {
    name: "Farmhouse",
    totalPrice: 30000,
    fixtures: [
      { name: "Farmhouse style fixtures", price: 2200, classification: "fixture", description: "Rustic farmhouse style fixtures" }
    ],
    lvp: [
      { name: "Wide plank LVP", price: 3500, classification: "flooring", description: "Wide plank luxury vinyl flooring" }
    ],
    carpet: [
      { name: "Textured carpet", price: 2500, classification: "flooring", description: "Textured premium carpet" }
    ],
    backsplash: [
      { name: "Farmhouse tile", price: 1500, classification: "tile", description: "Farmhouse style backsplash tile" }
    ],
    masterBathTile: [
      { name: "Natural stone tile", price: 2500, classification: "tile", description: "Natural stone bathroom tile" }
    ],
    countertop: [
      { name: "Butcher block counters", price: 2800, classification: "countertop", description: "Solid wood butcher block countertops" }
    ],
    primaryCabinets: [
      { name: "Farmhouse style cabinets", price: 7000, classification: "cabinet", description: "Rustic farmhouse style cabinets" }
    ],
    secondaryCabinets: [
      { name: "Open shelving", price: 1500, classification: "cabinet", description: "Rustic open shelving" }
    ],
    upgrade: true
  },
  {
    name: "Farmhouse Upgrade",
    totalPrice: 40000,
    fixtures: [
      { name: "Premium farmhouse fixtures", price: 3000, classification: "fixture", description: "High-end farmhouse style fixtures" }
    ],
    lvp: [
      { name: "Premium wide plank LVP", price: 4000, classification: "flooring", description: "Premium wide plank luxury vinyl" }
    ],
    carpet: [
      { name: "Premium textured carpet", price: 3000, classification: "flooring", description: "Luxury textured carpet" }
    ],
    backsplash: [
      { name: "Custom farmhouse tile", price: 2000, classification: "tile", description: "Custom designed farmhouse tile" }
    ],
    masterBathTile: [
      { name: "Premium natural stone", price: 3500, classification: "tile", description: "Premium natural stone tile" }
    ],
    countertop: [
      { name: "Premium butcher block", price: 4000, classification: "countertop", description: "Premium hardwood butcher block" }
    ],
    primaryCabinets: [
      { name: "Custom farmhouse cabinets", price: 9000, classification: "cabinet", description: "Custom farmhouse style cabinets" }
    ],
    secondaryCabinets: [
      { name: "Custom open shelving", price: 2500, classification: "cabinet", description: "Custom rustic open shelving" }
    ],
    upgrade: true
  }
];

// Lot premiums for different locations
export const floorPlanLotPremiums = [
  {
    filing: 1,
    lot: 1,
    width: 50,
    length: 100,
    price: 0
  },
  {
    filing: 1,
    lot: 2,
    width: 55,
    length: 105,
    price: 5000
  },
  {
    filing: 1,
    lot: 3,
    width: 60,
    length: 110,
    price: 8000
  },
  {
    filing: 1,
    lot: 4,
    width: 65,
    length: 115,
    price: 15000
  },
  {
    filing: 2,
    lot: 1,
    width: 70,
    length: 120,
    price: 25000
  }
];