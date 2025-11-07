# Mayberry Home Builder - User & Admin Journey Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Data Structure Architecture](#data-structure-architecture)
3. [User Journey](#user-journey)
4. [Admin Journey](#admin-journey)
5. [Technical Implementation](#technical-implementation)
6. [Authentication & Authorization](#authentication--authorization)

---

## System Overview

Mayberry Home Builder is a comprehensive home customization platform that allows users to select floor plans and customize them with various options including elevations, colors, interiors, appliances, and lot selections. The system operates on a dual architecture supporting both legacy global options and new plan-specific options.

### Key Components
- **Frontend**: React 18 + TypeScript with Apollo Client for GraphQL
- **Backend**: Node.js + GraphQL with MongoDB (Mongoose ODM)
- **Authentication**: JWT-based with role-based access control
- **Architecture**: Hybrid system supporting both global and plan-specific options

---

## Data Structure Architecture

### Current Plan Model
```typescript
interface Plan {
  _id: string;
  planType: number;           // Unique plan identifier
  name: string;               // Plan name (e.g., "The Beacon")
  bedrooms: number;           // Number of bedrooms
  bathrooms: number;          // Number of bathrooms
  totalSqft: number;          // Total square footage
  resSqft: number;            // Residential square footage
  garage: number;             // Number of car garage
  basePrice: number;          // Starting price
  description?: string;       // Plan description
  width: number;              // Plan width in feet
  length: number;             // Plan depth in feet
  
  // Plan-Specific Options (New Architecture)
  elevations: PlanElevationOption[];      // Unique elevations per plan
  interiors: PlanInteriorOption[];        // Unique interior packages per plan
  structural: PlanStructuralOption[];     // Unique structural options per plan
  additional: PlanAdditionalOption[];     // Unique additional features per plan
  kitchenAppliance: PlanApplianceOption[]; // Unique kitchen appliances per plan
  laundryAppliance: PlanApplianceOption[]; // Unique laundry appliances per plan
  lotPremium: PlanLotPremium[];           // Unique lot options per plan
  
  // Global Options (Legacy Architecture)
  colorScheme?: ColorScheme[];            // Global color schemes
}
```

### User Selection Model
```typescript
interface CustomizationSelections {
  elevation: string;          // Selected elevation ID
  colorScheme: string;        // Selected color scheme ID
  interior: string;           // Selected interior package ID
  structural: string[];       // Array of structural option IDs
  additional: string[];       // Array of additional option IDs
  kitchenAppliance: string;   // Selected kitchen appliance ID
  laundryAppliance: string;   // Selected laundry appliance ID
  lotPremium: string;         // Selected lot premium ID
}
```

### Saved User Home Model
```typescript
interface UserHome {
  _id: string;
  userId: string;
  plan: string;               // Plan ID reference
  configurationName: string;  // User-defined name
  elevation: string;          // Selected elevation ID
  colorScheme: string;        // Selected color scheme ID
  interiorPackage: string;    // Selected interior package ID
  kitchenAppliance: string;   // Selected kitchen appliance ID
  laundryAppliance?: string;  // Optional laundry appliance ID
  lotPremium?: string;        // Optional lot premium ID
  structuralOptions: string[]; // Array of structural option IDs
  additionalOptions: string[]; // Array of additional option IDs
  basePlanPrice?: number;     // Base plan price
  optionsTotalPrice?: number; // Total options price
  totalPrice?: number;        // Grand total price
  status: string;             // Home status (draft, submitted, contracted)
  isActive: boolean;          // Active status
  notes?: string;             // Admin notes
  customerNotes?: string;     // Customer notes
}
```

---

## User Journey

### 1. Home Page - Plan Selection
**Location**: `/` (Home.tsx)
**Purpose**: Browse and select a floor plan to customize

#### Flow:
1. **Plan Discovery**
   - User arrives at home page
   - `EnhancedFloorPlanSelector` displays available plans
   - Plans loaded via `GET_PLANS` query from `planOptionQueries.ts`
   - Each plan shows: name, bedrooms, bathrooms, square footage, garage, base price

2. **Plan Selection**
   - User clicks on desired plan
   - Plan details are highlighted
   - "Customize This Plan" button becomes active

3. **Authentication Check**
   - If user is not authenticated: redirect to login with return path
   - If authenticated: proceed to customization wizard

4. **Navigation to Customization**
   - Route: `/customize/{planId}`
   - Loads `CustomizeHome.tsx` component

### 2. Customization Wizard - 8-Step Process
**Location**: `/customize/{planId}` (CustomizeHome.tsx → CustomizationWizard.tsx)
**Purpose**: Guide users through step-by-step home customization

#### Data Loading:
```typescript
// Current data queries (being migrated to plan-specific)
const { data: planData } = useQuery(GET_PLAN, { variables: { id: planId } });
const { data: optionsData } = useQuery(GET_OPTIONS);
const { data: interiorData } = useQuery(GET_INTERIOR_PACKAGES);
const { data: lotData } = useQuery(GET_LOT_PREMIUMS);
const { data: colorSchemesData } = useQuery(GET_COLOR_SCHEMES);
```

#### Step 1: Elevation Selection
**Component**: `ElevationStep.tsx`
**Purpose**: Choose exterior elevation style

**Process**:
1. Display available elevations for the selected plan
2. Show elevation previews (images or ColorableSVG)
3. User selects one elevation (required)
4. Selection updates `customization.elevation`

**Data Structure**:
```typescript
// Plan-specific elevations (new architecture)
interface PlanElevationOption {
  _id: string;
  name: string;           // e.g., "Farmhouse", "Modern", "Craftsman"
  price: number;          // Additional cost for this elevation
  description?: string;   // Elevation description
  img?: string;           // Image URL
  isActive: boolean;      // Available for selection
  sortOrder: number;      // Display order
}
```

#### Step 2: Color Scheme Selection
**Component**: `ColorSchemeStep.tsx`  
**Purpose**: Choose exterior color palette

**Process**:
1. Display available color schemes (global options)
2. Show color swatches/previews
3. User selects one color scheme (required)
4. Selection updates `customization.colorScheme`

**Data Structure**:
```typescript
interface ColorScheme {
  _id: string;
  name: string;           // e.g., "Classic White", "Mountain Gray"
  price: number;          // Additional cost
  colorValues: {
    primary: string;      // Main siding color
    secondary: string;    // Secondary siding color
    roof: string;         // Roof color
    accent: string;       // Trim color
    stone?: string;       // Stone accent color
    foundation?: string;  // Foundation color
  };
  isActive: boolean;
}
```

#### Step 3: Interior Package Selection
**Component**: `InteriorStep.tsx`
**Purpose**: Choose interior finishes and materials

**Process**:
1. Display available interior packages for the plan
2. Show package details (fixtures, flooring, cabinets, etc.)
3. User selects one package (required)
4. Selection updates `customization.interior`

**Data Structure**:
```typescript
// Plan-specific interiors (new architecture)
interface PlanInteriorOption {
  _id: string;
  name: string;             // e.g., "Builder Standard", "Premium Package"
  totalPrice: number;       // Total package price
  clientPrice?: number;     // Client-facing price
  description?: string;     // Package description
  fixtures: string[];       // Fixture selections
  lvp: string[];           // Luxury Vinyl Plank options
  carpet: string[];        // Carpet selections
  backsplash: string[];    // Backsplash options
  masterBathTile: string[]; // Master bath tile options
  countertop: string[];    // Countertop selections
  primaryCabinets: string[]; // Primary cabinet options
  secondaryCabinets: string[]; // Secondary cabinet options
  upgrade: boolean;        // Is this an upgrade package
  basePackage: boolean;    // Is this the base package
  isActive: boolean;
  sortOrder: number;
}
```

#### Step 4: Structural Options
**Component**: `StructuralStep.tsx`
**Purpose**: Select structural modifications

**Process**:
1. Display available structural options for the plan
2. Show options like room additions, garage upgrades, etc.
3. User can select multiple options (optional)
4. Selections update `customization.structural[]`

**Data Structure**:
```typescript
interface PlanStructuralOption {
  _id: string;
  name: string;           // e.g., "3rd Car Garage", "Bonus Room"
  price: number;          // Additional cost
  description?: string;   // Option description
  garage?: number;        // Garage size change
  bedrooms?: number;      // Bedroom count change
  bathrooms?: number;     // Bathroom count change
  width?: number;         // Width modification
  length?: number;        // Length modification
  totalSqft?: number;     // Square footage change
  resSqft?: number;       // Residential sq ft change
  isActive: boolean;
  sortOrder: number;
}
```

#### Step 5: Additional Options
**Component**: `AdditionalStep.tsx`
**Purpose**: Select additional features and upgrades

**Process**:
1. Display available additional options for the plan
2. Show options like smart home features, security systems, etc.
3. User can select multiple options (optional)
4. Selections update `customization.additional[]`

**Data Structure**:
```typescript
interface PlanAdditionalOption {
  _id: string;
  name: string;           // e.g., "Smart Home Package", "Security System"
  price: number;          // Additional cost
  description?: string;   // Option description
  category?: string;      // Option category
  isActive: boolean;
  sortOrder: number;
}
```

#### Step 6: Kitchen Appliances
**Component**: `ApplianceStep.tsx`
**Purpose**: Choose kitchen appliance package

**Process**:
1. Display available kitchen appliance packages for the plan
2. Show appliance details (brand, model, included items)
3. User selects one package (required)
4. Selection updates `customization.kitchenAppliance`

#### Step 7: Laundry Appliances  
**Component**: `ApplianceStep.tsx`
**Purpose**: Choose laundry appliance package

**Process**:
1. Display available laundry appliance packages for the plan
2. Show appliance details (washer/dryer specifications)
3. User selects one package (optional)
4. Selection updates `customization.laundryAppliance`

**Data Structure** (for both Kitchen & Laundry):
```typescript
interface PlanApplianceOption {
  _id: string;
  name: string;           // e.g., "GE Cafe Series", "Whirlpool Standard"
  price: number;          // Additional cost
  type: string;           // "kitchen" or "laundry"
  description?: string;   // Package description
  brand?: string;         // Appliance brand
  model?: string;         // Model information
  appliances: string[];   // List of included appliances
  isActive: boolean;
  sortOrder: number;
}
```

#### Step 8: Lot Selection
**Component**: `LotSelectionStep.tsx`
**Purpose**: Choose building lot with premium pricing

**Process**:
1. Display available lots compatible with plan dimensions
2. Show lot details (size, location, premium cost)
3. User selects one lot (optional)
4. Selection updates `customization.lotPremium`

**Data Structure**:
```typescript
interface PlanLotPremium {
  _id: string;
  filing: number;         // Filing/subdivision number
  lot: number;            // Lot number
  width: number;          // Lot width in feet
  length: number;         // Lot length in feet
  lotSqft: number;        // Total lot square footage
  premium: number;        // Premium cost for this lot
  address: string;        // Lot address
  parcelNumber: string;   // Tax parcel number
  description?: string;   // Lot description
  features: string[];     // Lot features (view, corner lot, etc.)
  isActive: boolean;
  sortOrder: number;
}
```

#### Step 9: Pricing & Summary
**Component**: `PricingStep.tsx`
**Purpose**: Review selections and finalize home configuration

**Process**:
1. **Price Calculation**:
   ```typescript
   const totalPrice = basePrice + 
                     elevation.price + 
                     colorScheme.price + 
                     interior.totalPrice + 
                     structural.reduce((sum, opt) => sum + opt.price, 0) +
                     additional.reduce((sum, opt) => sum + opt.price, 0) +
                     kitchenAppliance.price +
                     (laundryAppliance?.price || 0) +
                     (lotPremium?.premium || 0);
   ```

2. **Summary Display**:
   - Itemized pricing breakdown
   - Total cost calculation
   - Financing estimates
   - Configuration summary

3. **Save Options**:
   - Save as draft (progress saving)
   - Save as final configuration
   - Print pricing sheet
   - Email pricing to user

4. **Final Save**:
   ```typescript
   const userHomeInput = {
     plan: planId,
     configurationName: userProvidedName,
     elevation: customization.elevation,
     colorScheme: customization.colorScheme,
     interiorPackage: customization.interior,
     kitchenAppliance: customization.kitchenAppliance,
     laundryAppliance: customization.laundryAppliance,
     lotPremium: customization.lotPremium,
     structuralOptions: customization.structural,
     additionalOptions: customization.additional,
     status: 'saved'
   };
   ```

### 3. Saved Homes Management
**Location**: `/saved-homes` (SavedHomes.tsx)
**Purpose**: View and manage saved home configurations

#### Features:
- View all saved configurations
- Edit existing configurations
- Delete configurations
- Submit configurations for review
- Track configuration status

---

## Admin Journey

### 1. Admin Dashboard Access
**Location**: `/admin` (AdminDashboard.tsx)
**Purpose**: Central admin management hub
**Authentication**: Requires admin role

#### Dashboard Structure:
- **Tab-based interface** with 6 main sections:
  1. Floor Plans
  2. Options (Legacy)
  3. Interior Packages (Legacy)
  4. Interior Options (Legacy)
  5. Color Schemes (Global)
  6. Lot Premiums (Global)

### 2. Floor Plan Management
**Component**: `AdminPlanManager.tsx`
**Purpose**: Create and manage floor plans

#### Plan Creation Flow:
1. **Basic Plan Information**:
   ```typescript
   const planInput = {
     planType: uniqueNumber,     // Auto-incremented plan identifier
     name: "The Beacon",         // Plan name
     bedrooms: 4,                // Number of bedrooms
     bathrooms: 3.5,             // Number of bathrooms
     totalSqft: 2500,            // Total square footage
     resSqft: 2000,              // Residential square footage
     garage: 3,                  // Number of car garage
     basePrice: 450000,          // Starting price
     description: "Modern family home...", // Plan description
     width: 60,                  // Plan width in feet
     length: 40,                 // Plan depth in feet
   };
   ```

2. **Plan Creation Process**:
   - Fill out basic plan form
   - Set pricing and dimensions
   - Save plan to database
   - Plan gets empty arrays for all option types

3. **Plan Management Actions**:
   - **Edit Plan**: Modify basic plan information
   - **Manage Options**: Open plan-specific option manager
   - **Delete Plan**: Remove plan and all associated options

#### Plan-Specific Option Management
**Component**: `PlanOptionManager.tsx` (New Architecture)
**Purpose**: Manage options unique to each plan

##### Option Management Flow:
1. **Access Plan Options**:
   - Click "Options" button next to any plan
   - Opens `PlanOptionManager` modal
   - Loads plan with all current options

2. **Tab-Based Option Management**:
   - **Elevations Tab**: Manage plan-specific elevations
   - **Structural Tab**: Manage structural modifications
   - **Interiors Tab**: Manage interior packages
   - **Kitchen Appliances Tab**: Manage kitchen appliance options
   - **Laundry Appliances Tab**: Manage laundry appliance options
   - **Additional Tab**: Manage additional features
   - **Lot Premiums Tab**: Manage lot associations

3. **Option CRUD Operations**:
   ```typescript
   // Add new option to plan
   const addOptionToPlan = async (planId, optionType, optionData) => {
     const result = await addMutation({
       variables: {
         planId: planId,
         [optionType]: optionData
       }
     });
   };

   // Update existing option
   const updatePlanOption = async (planId, optionId, optionData) => {
     const result = await updateMutation({
       variables: {
         planId: planId,
         optionId: optionId,
         [optionType]: optionData
       }
     });
   };

   // Remove option from plan
   const removePlanOption = async (planId, optionId) => {
     const result = await removeMutation({
       variables: {
         planId: planId,
         optionId: optionId
       }
     });
   };
   ```

##### Elevation Option Creation Example:
```typescript
const elevationData = {
  name: "Modern Farmhouse",
  price: 15000,
  description: "Clean lines with rustic charm",
  img: "https://example.com/elevation.jpg",
  isActive: true,
  sortOrder: 1
};
```

##### Interior Package Creation Example:
```typescript
const interiorData = {
  name: "Premium Designer Package",
  totalPrice: 45000,
  clientPrice: 42000,
  description: "High-end finishes throughout",
  fixtures: ["Kohler Artifacts", "Delta Trinsic"],
  lvp: ["Shaw Floorte Pro"],
  carpet: ["Mohawk SmartStrand"],
  backsplash: ["Subway Tile", "Natural Stone"],
  masterBathTile: ["Porcelain 12x24"],
  countertop: ["Quartz Caesarstone"],
  primaryCabinets: ["Shaker White"],
  secondaryCabinets: ["Shaker Gray"],
  upgrade: true,
  basePackage: false,
  isActive: true,
  sortOrder: 2
};
```

##### Structural Option Creation Example:
```typescript
const structuralData = {
  name: "3rd Car Garage Addition",
  price: 25000,
  description: "Add third bay to existing garage",
  garage: 3,              // New garage count
  width: 70,              // New plan width
  length: 40,             // Plan length stays same
  totalSqft: 2800,        // New total square footage
  resSqft: 2000,          // Residential stays same
  isActive: true,
  sortOrder: 1
};
```

### 3. Legacy Global Option Management

#### Options Manager (Legacy)
**Component**: `AdminOptionsManager.tsx`
**Purpose**: Manage global options (elevation, structural, additional)

#### Interior Packages Manager (Legacy)
**Component**: `AdminInteriorPackagesManager.tsx`
**Purpose**: Manage global interior package templates

#### Color Scheme Manager (Global)
**Component**: `AdminColorSchemeManager.tsx`
**Purpose**: Manage global color schemes available to all plans

#### Lot Premiums Manager (Global)
**Component**: `AdminLotPremiumsManager.tsx`
**Purpose**: Manage available building lots

### 4. Admin Workflow for Plan Creation

#### Complete Plan Setup Process:
1. **Create Base Plan**:
   - Use `AdminPlanManager` to create plan with basic info
   - Set plan type, name, dimensions, pricing

2. **Add Plan-Specific Options**:
   - Click "Options" button for the new plan
   - Add elevations specific to this plan
   - Add interior packages specific to this plan
   - Add structural options available for this plan
   - Add appliance packages for this plan
   - Add additional features for this plan
   - Associate compatible lots with this plan

3. **Configure Pricing**:
   - Set base plan price
   - Set individual option prices
   - Configure any upgrade/downgrade pricing

4. **Activate Plan**:
   - Ensure all required options are configured
   - Test plan customization flow
   - Make plan available to users

#### Plan Option Strategy:
- **Plan-Specific Options**: Unique to each plan, stored as embedded documents
- **Global Options**: Shared across plans (color schemes, lot premiums)
- **Hybrid Approach**: Allows flexibility while maintaining data integrity

---

## Technical Implementation

### GraphQL Schema Structure

#### Queries:
```graphql
# Get plans with all plan-specific options
query getPlansWithOptions {
  plans {
    _id
    planType
    name
    # ... basic plan fields
    elevations { _id name price description isActive sortOrder }
    interiors { _id name totalPrice clientPrice description ... }
    structural { _id name price description garage bedrooms ... }
    additional { _id name price description category ... }
    kitchenAppliance { _id name price type brand model appliances ... }
    laundryAppliance { _id name price type brand model appliances ... }
    lotPremium { _id filing lot premium address features ... }
  }
}

# Get single plan with options
query getPlanWithOptions($id: ID!) {
  plan(id: $id) {
    # Same structure as above
  }
}
```

#### Mutations:
```graphql
# Plan CRUD
mutation createPlan($plan: PlanInput!) {
  createPlan(plan: $plan) { _id planType name ... }
}

# Plan-specific option management
mutation addElevationToPlan($planId: ID!, $elevation: PlanElevationOptionInput!) {
  addElevationToPlan(planId: $planId, elevation: $elevation) {
    _id
    elevations { _id name price description }
  }
}

# User home saving
mutation saveUserHome($userHome: UserHomeInput!) {
  saveUserHome(userHome: $userHome) {
    _id
    username
    homeCount
    savedHomes { _id configurationName totalPrice }
  }
}
```

### Frontend State Management

#### Customization State:
```typescript
const [customization, setCustomization] = useState<CustomizationSelections>({
  elevation: '',
  colorScheme: '',
  interior: '',
  structural: [],
  additional: [],
  kitchenAppliance: '',
  laundryAppliance: '',
  lotPremium: ''
});
```

#### Progress Tracking:
```typescript
const [currentStep, setCurrentStep] = useState(0);
const totalSteps = 8;
const progressPercentage = (currentStep / totalSteps) * 100;
```

#### Price Calculation:
```typescript
const calculateTotalPrice = (plan, selections) => {
  let total = plan.basePrice;
  
  // Add selected option prices
  if (selections.elevation) {
    const elevation = plan.elevations.find(e => e._id === selections.elevation);
    total += elevation?.price || 0;
  }
  
  // ... repeat for all option types
  
  return total;
};
```

### Database Schema (MongoDB)

#### Plan Document Structure:
```javascript
{
  _id: ObjectId,
  planType: Number,
  name: String,
  bedrooms: Number,
  bathrooms: Number,
  totalSqft: Number,
  resSqft: Number,
  garage: Number,
  basePrice: Number,
  description: String,
  width: Number,
  length: Number,
  
  // Embedded plan-specific options
  elevations: [PlanElevationOptionSchema],
  interiors: [PlanInteriorOptionSchema],
  structural: [PlanStructuralOptionSchema],
  additional: [PlanAdditionalOptionSchema],
  kitchenAppliance: [PlanApplianceOptionSchema],
  laundryAppliance: [PlanApplianceOptionSchema],
  lotPremium: [PlanLotPremiumSchema],
  
  // References to global options
  colorScheme: [ObjectId], // References to ColorScheme collection
  
  createdAt: Date,
  updatedAt: Date
}
```

#### UserHome Document Structure:
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  plan: ObjectId,              // Reference to Plan
  configurationName: String,
  elevation: ObjectId,         // Reference to specific elevation option
  colorScheme: ObjectId,       // Reference to ColorScheme
  interiorPackage: ObjectId,   // Reference to specific interior option
  kitchenAppliance: ObjectId,  // Reference to specific appliance option
  laundryAppliance: ObjectId,  // Reference to specific appliance option
  lotPremium: ObjectId,        // Reference to specific lot option
  structuralOptions: [ObjectId], // Array of structural option references
  additionalOptions: [ObjectId], // Array of additional option references
  basePlanPrice: Number,
  optionsTotalPrice: Number,
  totalPrice: Number,
  status: String,              // 'draft', 'saved', 'submitted', 'contracted'
  isActive: Boolean,
  submittedAt: Date,
  contractedAt: Date,
  notes: String,
  customerNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication & Authorization

### User Roles:
- **User**: Can browse plans, customize homes, save configurations
- **Admin**: Full access to all management functions

### Authentication Flow:
1. **Login/Register**: JWT token generation
2. **Token Storage**: LocalStorage on client
3. **Request Headers**: Bearer token in GraphQL requests
4. **Server Validation**: JWT verification and role extraction

### Protected Routes:
```typescript
// User-protected routes
<ProtectedRoute>
  <Route path="/customize/:planId" component={CustomizeHome} />
  <Route path="/saved-homes" component={SavedHomes} />
</ProtectedRoute>

// Admin-protected routes
<RoleBasedRoute requiredRole="admin">
  <Route path="/admin" component={AdminDashboard} />
</RoleBasedRoute>
```

### GraphQL Authorization:
```typescript
// Server-side resolver protection
const resolvers = {
  Mutation: {
    createPlan: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { plan }, { user }) => {
        // Only admins can create plans
        return await Plan.create(plan);
      }
    ),
    
    saveUserHome: combineResolvers(
      isAuthenticated,
      async (parent, { userHome }, { user }) => {
        // Users can only save their own homes
        userHome.userId = user._id;
        return await UserHome.create(userHome);
      }
    )
  }
};
```

---

## Summary

The Mayberry Home Builder system provides a comprehensive platform for home customization with clear separation between user and admin workflows:

### User Experience:
- Intuitive 8-step customization wizard
- Real-time pricing updates
- Visual plan and option previews
- Configuration saving and management

### Admin Experience:  
- Powerful plan management tools
- Plan-specific option configuration
- Flexible pricing controls
- Legacy and modern option management

### Technical Architecture:
- Hybrid option system (global + plan-specific)
- GraphQL API with type safety
- Role-based access control
- Scalable MongoDB schema

This documentation provides the foundation for understanding both user and admin journeys through the system, enabling effective development, training, and system maintenance.