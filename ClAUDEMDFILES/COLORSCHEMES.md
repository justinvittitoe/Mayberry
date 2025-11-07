
## Color Scheme Breakdown

##Context
Users - When a user customizes their home they can select a color scheme for the home. A component will display the image of the color scheme so they can see the picture.There should be a drop down or see more details which shows the colorValues for the color scheme.

Admins - An admin should be able to create a color scheme through the plan manager. When they create a color scheme they should be prompted to submit all required feilds and their should be a way to upload an image.

##Data Structure

There are 20 color schemes each contain the below data structure:

interface ColorScheme {
    number: number
    elevation: "Farmhouse" | "Craftsman" | "Ranch" | "Prairie" | "Modern"
    garage: "STD" | "5 Car" | "RV"
    structural: "STD" | "MG"
    colorValues: [
        primary: string 
        secondary!: string
        accent: string
        roof: string
        stone?: string
        door: string
    ]
    image?: string
    isActive: boolean
}

## Claude Analysis

    After analyzing the COLORSCHEMES.md file and 
    comparing it with the current implementation, I've 
    identified significant discrepancies that need to 
    be addressed.

    COLORSCHEMES.md Requirements vs Current 
    Implementation

    COLORSCHEMES.md Specification:
    interface ColorScheme {
        number: number // ❌ update
        elevation: "Farmhouse" | "Craftsman" | "Ranch" | "Prairie" | "Modern"  // ❌ Missing
        garage: "STD" | "5 Car" | "RV"  // ❌ Missing
        structural: "STD" | "MG"  // ❌ Missing
        colorValues: {
            primary: string 
            secondary: string
            accent: string
            roof: string
            stone?: string, 
            door: string   // ❌ Missing entirely
        }
        image?: string 
        isActive: boolean  // ✅ Matches
    }

    Current Implementation:
    interface ColorScheme {
        _id?: string;
        name: string;  // ✅ Correct type
        description?: string;  // ❌ Not in spec
        price: number;  // ❌ Not in spec
        colorValues: {
            primary: string;
            secondary: string;
            roof: string;
            accent: string;
            stone?: string;  // ❌ Should be required
            foundation?: string;  // ❌ Not in spec 
    (should be door)
        };
        isActive: boolean;  // ✅ Matches
        sortOrder?: number;  // ❌ Not in spec
        createdAt?: string;  // ❌ Not in spec
        updatedAt?: string;  // ❌ Not in spec
    }

    Files That Need Updates

    Backend Files

    1. /server/src/models/OptionSchemas/ColorScheme.ts
      - Add elevation, garage, structural fields
      - Add door to colorValues, make stone required, 
    remove foundation
      - Add image field
      - Remove description, price, sortOrder fields
    2. /server/src/schemas/typeDefs.ts
      - Update ColorValues type to include door and 
    make stone required
      - Update ColorScheme type to match new schema
      - Update ColorSchemeInput type accordingly
      - Remove price-related fields from mutations
    3. /server/src/schemas/resolvers.ts
      - Update color scheme resolvers to handle new 
    fields
      - Remove price calculations for color schemes

    Frontend Files

    4. /client/src/models/graphql.ts
      - Update ColorValues interface to include door, 
    make stone required, remove foundation
      - Update ColorScheme interface to match spec
      - Remove price, description, sortOrder fields
    5. 
    /client/src/components/AdminColorSchemeManager.tsx
      - Update form fields to include elevation, 
    garage, structural dropdowns
      - Add image upload functionality
      - Update color value fields (add door, remove 
    foundation)
      - Remove price and description fields
    6. /client/src/components/wizard-steps/ColorSchemeS
    tep.tsx
      - Update to display image instead of color 
    swatches
      - Add details dropdown/modal showing colorValues
      - Remove price display
    7. /client/src/utils/mutations.ts
      - Update CREATE_COLOR_SCHEME, UPDATE_COLOR_SCHEME
     mutations
      - Remove price-related fields from responses
    8. /client/src/utils/queries.ts
      - Update GET_COLOR_SCHEMES query to match new 
    schema
    9. /client/src/utils/colorService.ts
      - Update to handle door color instead of 
    foundation
      - Update color mapping logic
    10. /client/src/utils/colorZoneMappings.ts
      - Add door color mapping
      - Remove foundation mapping
    11. /client/src/components/ColorableSVG.tsx
      - Update to use door color for door elements
      - Remove foundation color usage
    12. Update COLORSCHEMES.md
      - Fix name type from number to string
      - Add implementation status section
      - Add file update checklist

    Key Changes Required

    1. Schema Breaking Changes: Complete restructure of
     ColorScheme model
    2. Remove Pricing: Color schemes no longer have 
    individual prices
    3. Add Constraint Fields: elevation, garage, 
    structural selection constraints  
    4. Image Support: Replace color swatches with 
    actual images
    5. Update Color Mapping: door replaces foundation 
    in color system

    Migration Considerations

    - This is a breaking change requiring database 
    migration
    - Existing color schemes will need data 
    transformation
    - Frontend components need complete refactor
    - Image upload/storage system needs implementation

    Implementation Priority

    1. Update backend schema and types first
    2. Create database migration script
    3. Update frontend interfaces and queries
    4. Refactor admin management component
    5. Update user-facing color selection component
    6. Implement image upload functionality
    7. Update documentation
