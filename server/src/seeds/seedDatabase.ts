import mongoose from 'mongoose';
import db from '../config/connection.js';
import Plan from '../models/Plan.js';
import Option from '../models/Option.js';
import InteriorPackage from '../models/InteriorPackage.js';
import LotPremium from '../models/LotPremium.js';
import { floorPlanSeedData, floorPlanOptions, floorPlanInteriorPackages, floorPlanLotPremiums } from './floorPlanData.js';

async function seedDatabase() {
  try {
    // Connect to database
    await db();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await Plan.deleteMany({});
    await Option.deleteMany({});
    await InteriorPackage.deleteMany({});
    await LotPremium.deleteMany({});
    console.log('Existing data cleared');

    // Seed Options
    console.log('Seeding Options...');
    const createdOptions = await Option.insertMany(floorPlanOptions);
    console.log(`Created ${createdOptions.length} options`);

    // Seed Interior Packages
    console.log('Seeding Interior Packages...');
    const createdInteriorPackages = await InteriorPackage.insertMany(floorPlanInteriorPackages);
    console.log(`Created ${createdInteriorPackages.length} interior packages`);

    // Seed Lot Premiums
    console.log('Seeding Lot Premiums...');
    const createdLotPremiums = await LotPremium.insertMany(floorPlanLotPremiums);
    console.log(`Created ${createdLotPremiums.length} lot premiums`);

    // Organize options by classification for easier assignment
    const optionsByClass = {
      elevation: createdOptions.filter(opt => opt.classification === 'elevation'),
      'kitchen-appliance': createdOptions.filter(opt => opt.classification === 'kitchen-appliance'),
      'laundry-appliance': createdOptions.filter(opt => opt.classification === 'laundry-appliance'),
      structural: createdOptions.filter(opt => opt.classification === 'structural'),
      additional: createdOptions.filter(opt => opt.classification === 'additional')
    };

    // Seed Plans with proper references
    console.log('Seeding Plans...');
    const planPromises = floorPlanSeedData.map(async (planData) => {
      // Assign some options to each plan
      const elevationOptions = optionsByClass.elevation.slice(0, 2); // 2 elevation options per plan
      const kitchenOptions = optionsByClass['kitchen-appliance'].slice(0, 2); // 2 kitchen options per plan
      const laundryOptions = optionsByClass['laundry-appliance'].slice(0, 1); // 1 laundry option per plan
      const structuralOptions = optionsByClass.structural.slice(0, 3); // 3 structural options per plan
      const additionalOptions = optionsByClass.additional.slice(0, 4); // 4 additional options per plan

      // Assign some interior packages to each plan
      const interiorPackages = createdInteriorPackages.slice(0, 3); // 3 interior packages per plan

      // Assign some lot premiums to each plan  
      const lotPremiums = createdLotPremiums.slice(0, 3); // 3 lot premiums per plan

      const plan = new Plan({
        ...planData,
        elevations: elevationOptions.map(opt => opt._id),
        interiors: interiorPackages.map(pkg => pkg._id),  
        structural: structuralOptions.map(opt => opt._id),
        additional: additionalOptions.map(opt => opt._id),
        kitchenAppliance: kitchenOptions.map(opt => opt._id),
        laundryAppliance: laundryOptions.map(opt => opt._id),
        lotPremium: lotPremiums.map(premium => premium._id)
      });

      return await plan.save();
    });

    const createdPlans = await Promise.all(planPromises);
    console.log(`Created ${createdPlans.length} plans`);

    // Display summary
    console.log('\n=== SEEDING COMPLETE ===');
    console.log(`✅ Options: ${createdOptions.length}`);
    console.log(`✅ Interior Packages: ${createdInteriorPackages.length}`);
    console.log(`✅ Lot Premiums: ${createdLotPremiums.length}`);
    console.log(`✅ Plans: ${createdPlans.length}`);
    console.log('\nFloor Plans Created:');
    createdPlans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} - ${plan.bedrooms}BR/${plan.bathrooms}BA - ${plan.squareFootage} sq ft - $${plan.basePrice.toLocaleString()}`);
    });

    console.log('\nDatabase seeding completed successfully! 🎉');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;