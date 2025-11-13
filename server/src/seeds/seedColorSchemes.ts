// import connectToDatabase from '../config/connection.js';
// import { ColorScheme } from '../models/index.js';
// import { colorSchemeSeedData } from './colorSchemeData.js';

// const seedColorSchemes = async () => {
//   try {
//     console.log('🎨 Seeding color schemes...');
    
//     // Clear existing color schemes
//     await ColorScheme.deleteMany({});
//     console.log('✅ Cleared existing color schemes');

//     // Insert new color schemes
//     const createdColorSchemes = await ColorScheme.insertMany(colorSchemeSeedData);
//     console.log(`✅ Created ${createdColorSchemes.length} color schemes:`);
    
//     createdColorSchemes.forEach(scheme => {
//       console.log(`   - ${scheme.name} (${scheme.price > 0 ? `+$${scheme.price}` : 'Included'})`);
//     });

//     console.log('🎨 Color scheme seeding completed successfully!');
//     return createdColorSchemes;
//   } catch (error: any) {
//     console.error('❌ Error seeding color schemes:', error);
//     throw error;
//   }
// };

// // Run if called directly
// if (import.meta.url === new URL(process.argv[1], 'file://').href) {
//   connectToDatabase()
//     .then(() => seedColorSchemes())
//     .then(() => {
//       console.log('🏁 Seeding process completed');
//       process.exit(0);
//     })
//     .catch((error: any) => {
//       console.error('💥 Seeding failed:', error);
//       process.exit(1);
//     });
// }

// export default seedColorSchemes;