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
    colorScheme: [5, 7, 8, 14, 16],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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
    colorScheme: [2, 8, 9, 13, 16],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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
    colorScheme: [1, 2, 5, 10, 16],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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
    colorScheme: [5, 7, 11, 14, 19],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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
    colorScheme: [6, 7, 13, 17, 20],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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
    colorScheme: [9, 11, 12, 16, 18],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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
    colorScheme: [10, 14, 16, 17, 19],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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
    colorScheme: [1, 6, 12, 14, 16],
    structural: [],
    additional: [],
    kitchenAppliance: [],
    laundryAppliance: []
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

// Interior packages for the plans
export const floorPlanInteriorPackages = [
  {
    name: "Casual",
    totalPrice: 15000,
    fitures: "Standard fixtures",
    lvp: "Standard LVP flooring",
    carpet: "Standard carpet",
    kitchenBackspash: "Subway tile backsplash",
    masterBathTile: "Standard ceramic tile",
    countertop: "Laminate countertops",
    primaryCabinets: "White shaker cabinets",
    secondaryCabinets: "Matching white cabinets",
    upgrade: "Basic upgrade package"
  },
  {
    name: "Casual Upgrade", 
    totalPrice: 25000,
    fitures: "Upgraded fixtures",
    lvp: "Upgraded LVP flooring",
    carpet: "Premium carpet",
    kitchenBackspash: "Designer tile backsplash",
    masterBathTile: "Porcelain tile",
    countertop: "Quartz countertops",
    primaryCabinets: "Upgraded shaker cabinets",
    secondaryCabinets: "Matching upgraded cabinets",
    upgrade: "Enhanced upgrade package"
  },
  {
    name: "Farmhouse",
    totalPrice: 30000,
    fitures: "Farmhouse style fixtures",
    lvp: "Wide plank LVP",
    carpet: "Textured carpet",
    kitchenBackspash: "Farmhouse tile",
    masterBathTile: "Natural stone tile",
    countertop: "Butcher block counters",
    primaryCabinets: "Farmhouse style cabinets",
    secondaryCabinets: "Open shelving",
    upgrade: "Farmhouse styling package"
  },
  {
    name: "Farmhouse Upgrade",
    totalPrice: 40000,
    fitures: "Premium farmhouse fixtures",
    lvp: "Premium wide plank LVP",
    carpet: "Premium textured carpet",
    kitchenBackspash: "Custom farmhouse tile",
    masterBathTile: "Premium natural stone",
    countertop: "Premium butcher block",
    primaryCabinets: "Custom farmhouse cabinets",
    secondaryCabinets: "Custom open shelving",
    upgrade: "Premium farmhouse package"
  },
  {
    name: "Modern",
    totalPrice: 35000,
    fitures: "Modern fixtures",
    lvp: "Contemporary LVP",
    carpet: "Modern carpet",
    kitchenBackspash: "Glass tile backsplash",
    masterBathTile: "Large format tile",
    countertop: "Solid surface counters",
    primaryCabinets: "Flat panel cabinets",
    secondaryCabinets: "Handleless cabinets",
    upgrade: "Modern styling package"
  },
  {
    name: "Modern Upgrade",
    totalPrice: 45000,
    fitures: "Premium modern fixtures",
    lvp: "Designer LVP flooring",
    carpet: "Premium modern carpet",
    kitchenBackspash: "Designer glass tile",
    masterBathTile: "Premium large format tile",
    countertop: "Premium solid surface",
    primaryCabinets: "Custom flat panel cabinets",
    secondaryCabinets: "Premium handleless design",
    upgrade: "Premium modern package"
  },
  {
    name: "Modern Eclectic",
    totalPrice: 38000,
    fitures: "Eclectic modern fixtures",
    lvp: "Mixed texture LVP",
    carpet: "Designer carpet",
    kitchenBackspash: "Mixed material backsplash",
    masterBathTile: "Mixed tile design",
    countertop: "Mixed material counters",
    primaryCabinets: "Two-tone cabinets",
    secondaryCabinets: "Contrasting cabinets",
    upgrade: "Eclectic design package"
  },
  {
    name: "Modern Eclectic Upgrade",
    totalPrice: 50000,
    fitures: "Premium eclectic fixtures",
    lvp: "Premium mixed texture LVP",
    carpet: "Premium designer carpet",
    kitchenBackspash: "Custom mixed materials",
    masterBathTile: "Premium mixed tile",
    countertop: "Premium mixed materials",
    primaryCabinets: "Custom two-tone design",
    secondaryCabinets: "Premium contrasting finish",
    upgrade: "Premium eclectic package"
  },
  {
    name: "Prairie",
    totalPrice: 32000,
    fitures: "Prairie style fixtures",
    lvp: "Natural wood look LVP",
    carpet: "Earth tone carpet",
    kitchenBackspash: "Natural stone backsplash",
    masterBathTile: "Earth tone tile",
    countertop: "Natural stone counters",
    primaryCabinets: "Natural wood cabinets",
    secondaryCabinets: "Matching wood finish",
    upgrade: "Prairie styling package"
  },
  {
    name: "Prairie Upgrade",
    totalPrice: 42000,
    fitures: "Premium prairie fixtures",
    lvp: "Premium wood look LVP",
    carpet: "Premium earth tone carpet",
    kitchenBackspash: "Premium natural stone",
    masterBathTile: "Premium earth tone tile",
    countertop: "Premium natural stone",
    primaryCabinets: "Premium wood cabinets",
    secondaryCabinets: "Premium matching finish",
    upgrade: "Premium prairie package"
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