// Sample data for the home builder app
// Run this to populate your database with initial data

const sampleOptions = [
    {
        name: "Standard Elevation",
        price: 0,
        classification: "elevation",
        description: "Standard home elevation",
        img: "standard-elevation.jpg"
    },
    {
        name: "Premium Elevation",
        price: 15000,
        classification: "elevation",
        description: "Premium home elevation with stone accents",
        img: "premium-elevation.jpg"
    },
    {
        name: "Granite Countertops",
        price: 8000,
        classification: "kitchen",
        description: "Premium granite countertops",
        img: "granite-countertops.jpg"
    },
    {
        name: "Stainless Steel Appliances",
        price: 5000,
        classification: "appliances",
        description: "Complete stainless steel appliance package",
        img: "stainless-appliances.jpg"
    },
    {
        name: "Hardwood Floors",
        price: 12000,
        classification: "flooring",
        description: "Premium hardwood flooring throughout",
        img: "hardwood-floors.jpg"
    }
];

const sampleInteriorPackages = [
    {
        name: "Standard Package",
        totalPrice: 25000,
        fitures: "Standard fixtures",
        lvp: "Standard LVP",
        carpet: "Standard carpet",
        kitchenBackspash: "Standard backsplash",
        masterBathTile: "Standard tile",
        countertop: "Laminate countertops",
        primaryCabinets: "Standard cabinets",
        secondaryCabinets: "Standard cabinets",
        upgrade: "None"
    },
    {
        name: "Premium Package",
        totalPrice: 45000,
        fitures: "Premium fixtures",
        lvp: "Premium LVP",
        carpet: "Premium carpet",
        kitchenBackspash: "Premium backsplash",
        masterBathTile: "Premium tile",
        countertop: "Granite countertops",
        primaryCabinets: "Premium cabinets",
        secondaryCabinets: "Premium cabinets",
        upgrade: "All upgrades included"
    }
];

const sampleLotPremiums = [
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
        width: 60,
        length: 120,
        price: 5000
    },
    {
        filing: 1,
        lot: 3,
        width: 70,
        length: 140,
        price: 10000
    }
];

const samplePlans = [
    {
        planType: 1,
        name: "The Aspen",
        basePrice: 350000,
        colorScheme: [1, 2, 3],
        structural: [],
        additional: [],
        kitchenAppliance: [],
        laundryAppliance: []
    },
    {
        planType: 2,
        name: "The Birch",
        basePrice: 425000,
        colorScheme: [1, 2, 3, 4],
        structural: [],
        additional: [],
        kitchenAppliance: [],
        laundryAppliance: []
    },
    {
        planType: 3,
        name: "The Cedar",
        basePrice: 500000,
        colorScheme: [1, 2, 3, 4, 5],
        structural: [],
        additional: [],
        kitchenAppliance: [],
        laundryAppliance: []
    }
];

module.exports = {
    sampleOptions,
    sampleInteriorPackages,
    sampleLotPremiums,
    samplePlans
}; 