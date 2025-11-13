# GraphQL Testing Guide - Mayberry Pricing Model

This guide shows you how to manually test the GraphQL mutations and queries using GraphQL Playground or any GraphQL client.

## Table of Contents
1. [Setup](#setup)
2. [Authentication](#authentication)
3. [Testing Plan CRUD](#testing-plan-crud)
4. [Testing Option Creation](#testing-option-creation)
5. [Testing Plan-Option Relationships](#testing-plan-option-relationships)
6. [Common Issues](#common-issues)

---

## Setup

### Starting the Server
```bash
cd server
npm run watch
```

Server runs on: **http://localhost:3001**
GraphQL endpoint: **http://localhost:3001/graphql**

### Accessing GraphQL Playground
Open your browser and navigate to:
```
http://localhost:3001/graphql
```

---

## Authentication

Most admin mutations require authentication. You'll need to login first and use the token.

### Step 1: Create an Admin User (First Time Only)

```graphql
mutation CreateAdminUser {
  createAdminUser(
    username: "admin"
    email: "admin@mayberry.com"
    password: "password123"
  ) {
    token
    user {
      _id
      username
      email
      role
    }
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "createAdminUser": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "64abc123...",
        "username": "admin",
        "email": "admin@mayberry.com",
        "role": "admin"
      }
    }
  }
}
```

### Step 2: Login (Subsequent Times)

```graphql
mutation Login {
  login(
    email: "admin@mayberry.com"
    password: "password123"
  ) {
    token
    user {
      _id
      username
      email
      role
    }
  }
}
```

### Step 3: Set Authorization Header

In GraphQL Playground, click "HTTP HEADERS" at the bottom and add:

```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

Replace `YOUR_TOKEN_HERE` with the token from the login response.

---

## Testing Plan CRUD

### 1. Create a Base Plan

```graphql
mutation CreatePlan {
  createPlan(plan: {
    planType: 1
    name: "The Aspen"
    bedrooms: 3
    bathrooms: 2
    totalSqft: 1800
    resSqft: 1500
    garage: 2
    basePrice: 350000
    description: "Beautiful 3 bedroom ranch style home"
    width: 40
    length: 45
    elevations: []
    colorScheme: []
    interiors: []
    structural: []
    additional: []
    kitchenAppliance: []
    laundryAppliance: []
    lot: []
    isActive: true
  }) {
    _id
    planType
    name
    bedrooms
    bathrooms
    totalSqft
    resSqft
    garage
    basePrice
    description
    width
    length
    isActive
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "createPlan": {
      "_id": "64abc123def456...",
      "planType": 1,
      "name": "The Aspen",
      "bedrooms": 3,
      "bathrooms": 2,
      "totalSqft": 1800,
      "resSqft": 1500,
      "garage": 2,
      "basePrice": 350000,
      "description": "Beautiful 3 bedroom ranch style home",
      "width": 40,
      "length": 45,
      "isActive": true
    }
  }
}
```

**Save the `_id` value - you'll need it for associating options!**

### 2. Query Plans

```graphql
query GetPlans {
  plans {
    _id
    planType
    name
    bedrooms
    bathrooms
    totalSqft
    basePrice
    elevations {
      _id
      name
      clientPrice
    }
    colorScheme {
      _id
      name
      price
    }
    interiors {
      _id
      name
      clientPrice
    }
  }
}
```

### 3. Update a Plan

```graphql
mutation UpdatePlan {
  updatePlan(
    id: "64abc123def456..."  # Replace with your plan ID
    plan: {
      planType: 1
      name: "The Aspen Updated"
      bedrooms: 4
      bathrooms: 2.5
      totalSqft: 2000
      resSqft: 1650
      garage: 2
      basePrice: 375000
      description: "Updated beautiful 4 bedroom ranch style home"
      width: 42
      length: 48
    }
  ) {
    _id
    name
    bedrooms
    bathrooms
    totalSqft
    basePrice
  }
}
```

### 4. Delete a Plan

```graphql
mutation DeletePlan {
  deletePlan(id: "64abc123def456...")  # Replace with your plan ID
}
```

**Expected Response:**
```json
{
  "data": {
    "deletePlan": true
  }
}
```

---

## Testing Option Creation

Options must be created BEFORE associating them with plans.

### 1. Create an Elevation

```graphql
mutation CreateElevation {
  createElevation(elevation: {
    name: "Modern Farmhouse"
    totalCost: 5000
    clientPrice: 7500
    markup: 50
    minMarkup: 30
    description: "Beautiful modern farmhouse elevation with board and batten siding"
    planId: "64abc123def456..."  # Your plan ID
    isActive: true
    sortOrder: 1
  }) {
    _id
    name
    totalCost
    clientPrice
    markup
    description
    planId
    isActive
    sortOrder
  }
}
```

**Save the elevation `_id` for the next step!**

### 2. Create a Color Scheme

```graphql
mutation CreateColorScheme {
  createColorScheme(colorScheme: {
    name: "Classic Gray & White"
    planId: "64abc123def456..."  # Your plan ID
    description: "Timeless gray and white combination"
    price: 0
    primaryName: "Gauntlet Gray"
    primaryCode: "SW7019"
    secondaryName: "Pure White"
    secondaryCode: "SW7005"
    trimName: "Pure White"
    trimCode: "SW7005"
    doorName: "Tricorn Black"
    doorCode: "SW6258"
    shingleBrand: "Owens Corning"
    shingleColor: "Estate Gray"
    stone: true
    stoneColor: "Ledgestone Gray"
    isActive: true
    sortOrder: 1
  }) {
    _id
    name
    price
    description
    primaryName
    trimName
    doorName
    shingleBrand
    isActive
  }
}
```

### 3. Create an Interior Package

```graphql
mutation CreateInteriorPackage {
  createInteriorPackage(input: {
    name: "Designer Package"
    totalCost: 15000
    clientPrice: 22500
    markup: 50
    minMarkup: 30
    description: "Upgraded interior finishes throughout"
    planId: "64abc123def456..."  # Your plan ID
    basePackage: false
    softClose: true
    isActive: true
    sortOrder: 1
  }) {
    _id
    name
    totalCost
    clientPrice
    markup
    description
    basePackage
    softClose
    isActive
  }
}
```

### 4. Create a Structural Option

```graphql
mutation CreateStructural {
  createStructural(structural: {
    name: "Covered Patio"
    totalCost: 8000
    clientPrice: 12000
    markup: 50
    minMarkup: 30
    description: "16x12 covered patio extension"
    planId: "64abc123def456..."  # Your plan ID
    width: 16
    length: 12
    totalSqft: 192
    resSqft: 0
    isActive: true
    sortOrder: 1
  }) {
    _id
    name
    totalCost
    clientPrice
    description
    width
    length
    totalSqft
    isActive
  }
}
```

### 5. Create an Appliance

```graphql
mutation CreateAppliance {
  createAppliance(appliance: {
    name: "Premium Stainless Steel Package"
    baseCost: 3000
    totalCost: 3500
    clientPrice: 5250
    markup: 50
    minMarkup: 30
    type: "kitchen"
    brand: "Samsung"
    planId: ["64abc123def456..."]  # Array of plan IDs
    isActive: true
    sortOrder: 1
  }) {
    _id
    name
    baseCost
    totalCost
    clientPrice
    type
    brand
    isActive
  }
}
```

### 6. Create an Additional Option

```graphql
mutation CreateAdditional {
  createAdditional(additional: {
    name: "Smart Home Package"
    totalCost: 2500
    clientPrice: 3750
    markup: 50
    minMarkup: 30
    description: "Complete smart home automation system"
    planId: "64abc123def456..."  # Your plan ID
    isActive: true
    sortOrder: 1
  }) {
    _id
    name
    totalCost
    clientPrice
    description
    isActive
  }
}
```

### 7. Create Lot Pricing

First, create a Lot:
```graphql
mutation CreateLot {
  createLot(lot: {
    filing: 1
    lot: 15
    width: 60
    length: 120
    lotSqft: 7200
    streetNumber: "123"
    streetName: "Main Street"
    garageDir: "front"
    parcelNumber: "123-456-789"
    notes: "Corner lot with great views"
    isActive: true
  }) {
    _id
    filing
    lot
    width
    length
    lotSqft
    streetNumber
    streetName
  }
}
```

Then create LotPricing:
```graphql
mutation CreateLotPricing {
  createLotPricing(lotPricing: {
    lot: "64lot123..."  # Lot ID from above
    plan: "64abc123def456..."  # Your plan ID
    lotPremium: 15000
    isActive: true
  }) {
    _id
    lotPremium
    isActive
    lot {
      _id
      streetNumber
      streetName
    }
    plan {
      _id
      name
    }
  }
}
```

---

## Testing Plan-Option Relationships

Now associate the options you created with your plan.

### 1. Add Elevation to Plan

```graphql
mutation AddElevationToPlan {
  addElevationToPlan(
    planId: "64abc123def456..."  # Your plan ID
    elevationId: "64elev123..."  # Your elevation ID
  ) {
    _id
    name
    elevations {
      _id
      name
      clientPrice
    }
  }
}
```

### 2. Add Color Scheme to Plan

```graphql
mutation AddColorSchemeToPlan {
  addColorSchemeToPlan(
    planId: "64abc123def456..."
    colorSchemeId: "64color123..."
  ) {
    _id
    name
    colorScheme {
      _id
      name
      price
      primaryName
      trimName
    }
  }
}
```

### 3. Add Interior Package to Plan

```graphql
mutation AddInteriorPackageToPlan {
  addInteriorPackageToPlan(
    planId: "64abc123def456..."
    interiorPackageId: "64interior123..."
  ) {
    _id
    name
    interiors {
      _id
      name
      clientPrice
    }
  }
}
```

### 4. Add Structural Option to Plan

```graphql
mutation AddStructuralToPlan {
  addStructuralToPlan(
    planId: "64abc123def456..."
    structuralId: "64struct123..."
  ) {
    _id
    name
    structural {
      _id
      name
      clientPrice
    }
  }
}
```

### 5. Add Appliance to Plan

```graphql
mutation AddApplianceToPlan {
  addApplianceToPlan(
    planId: "64abc123def456..."
    applianceId: "64appl123..."
  ) {
    _id
    name
    kitchenAppliance {
      _id
      name
      clientPrice
      type
    }
    laundryAppliance {
      _id
      name
      clientPrice
      type
    }
  }
}
```

### 6. Add Additional Option to Plan

```graphql
mutation AddAdditionalToPlan {
  addAdditionalToPlan(
    planId: "64abc123def456..."
    additionalId: "64add123..."
  ) {
    _id
    name
    additional {
      _id
      name
      clientPrice
    }
  }
}
```

### 7. Add Lot Pricing to Plan

```graphql
mutation AddLotPricingToPlan {
  addLotPricingToPlan(
    planId: "64abc123def456..."
    lotPricingId: "64lotprice123..."
  ) {
    _id
    name
    lot {
      _id
      lotPremium
      lot {
        streetNumber
        streetName
      }
    }
  }
}
```

### 8. Remove Options from Plan

Same pattern for all options - just use the `remove` mutation:

```graphql
mutation RemoveElevationFromPlan {
  removeElevationFromPlan(
    planId: "64abc123def456..."
    elevationId: "64elev123..."
  ) {
    _id
    name
    elevations {
      _id
      name
    }
  }
}
```

Replace `removeElevationFromPlan` with:
- `removeStructuralFromPlan`
- `removeInteriorPackageFromPlan`
- `removeApplianceFromPlan`
- `removeAdditionalFromPlan`
- `removeColorSchemeFromPlan`
- `removeLotPricingFromPlan`

---

## Complete Workflow Example

Here's a complete test workflow from start to finish:

```graphql
# 1. Login
mutation Login {
  login(email: "admin@mayberry.com", password: "password123") {
    token
  }
}

# 2. Create a plan
mutation {
  createPlan(plan: {
    planType: 2
    name: "The Willow"
    bedrooms: 4
    bathrooms: 2.5
    totalSqft: 2200
    resSqft: 1850
    garage: 3
    basePrice: 425000
    width: 45
    length: 50
  }) {
    _id
    name
  }
}
# Result: _id = "PLAN_ID_HERE"

# 3. Create an elevation
mutation {
  createElevation(elevation: {
    name: "Craftsman"
    totalCost: 6000
    clientPrice: 9000
    markup: 50
    minMarkup: 30
    planId: "PLAN_ID_HERE"
    isActive: true
    sortOrder: 1
  }) {
    _id
    name
  }
}
# Result: _id = "ELEVATION_ID_HERE"

# 4. Associate elevation with plan
mutation {
  addElevationToPlan(
    planId: "PLAN_ID_HERE"
    elevationId: "ELEVATION_ID_HERE"
  ) {
    _id
    name
    elevations {
      _id
      name
      clientPrice
    }
  }
}

# 5. Query the plan with all options
query {
  plan(id: "PLAN_ID_HERE") {
    _id
    name
    basePrice
    elevations {
      _id
      name
      clientPrice
    }
  }
}
```

---

## Common Issues

### Issue 1: "Not authorized" error
**Solution:** Make sure you've set the Authorization header with a valid admin token.

### Issue 2: "Plan not found" error when adding options
**Solution:** Verify the plan ID exists by running the `plans` query first.

### Issue 3: "This lot pricing belongs to a different plan"
**Solution:** LotPricing has a `plan` field that must match the plan you're adding it to. Create separate LotPricing documents for each plan.

### Issue 4: "planType already exists"
**Solution:** Each plan must have a unique planType number. Check existing plans and increment.

### Issue 5: Backend validation errors
Common validations:
- `bedrooms` must be >= 3
- `bathrooms` must be >= 2
- `garage` must be 2 or 3
- `resSqft` must be <= `totalSqft`
- `width` and `length` must be between 10 and 120

### Issue 6: "Cannot read property '_id' of null"
**Solution:** The option you're trying to add doesn't exist. Create it first using the corresponding `create` mutation.

---

## Testing Frontend Integration

After testing in GraphQL Playground, test the frontend:

1. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

2. Navigate to `http://localhost:3000/admin`

3. Login with your admin credentials

4. Test the Plan Manager:
   - Create a new plan
   - Click "Options" on a plan
   - Try adding existing options to the plan

5. Verify that:
   - Options appear in dropdown/list
   - Adding options updates the plan
   - Removing options works correctly
   - Options show as "selected" when already associated

---

## Quick Reference: All Relationship Mutations

```graphql
# Add
addElevationToPlan(planId: ObjectId!, elevationId: ID!)
addStructuralToPlan(planId: ObjectId!, structuralId: ID!)
addInteriorOptionToPlan(planId: ObjectId!, interiorOptionId: ID!)
addInteriorPackageToPlan(planId: ObjectId!, interiorPackageId: ObjectId!)
addApplianceToPlan(planId: ObjectId!, applianceId: ObjectId!)
addAdditionalToPlan(planId: ObjectId!, additionalId: ObjectId!)
addColorSchemeToPlan(planId: ObjectId!, colorSchemeId: ObjectId!)
addLotPricingToPlan(planId: ObjectId!, lotPricingId: ObjectId!)

# Remove
removeElevationFromPlan(planId: ObjectId!, elevationId: ID!)
removeStructuralFromPlan(planId: ObjectId!, structuralId: ID!)
removeInteriorOptionFromPlan(planId: ObjectId!, interiorOptionId: ID!)
removeInteriorPackageFromPlan(planId: ObjectId!, interiorPackageId: ObjectId!)
removeApplianceFromPlan(planId: ObjectId!, applianceId: ObjectId!)
removeAdditionalFromPlan(planId: ObjectId!, additionalId: ObjectId!)
removeColorSchemeFromPlan(planId: ObjectId!, colorSchemeId: ObjectId!)
removeLotPricingFromPlan(planId: ObjectId!, lotPricingId: ObjectId!)
```

---

## Next Steps

1. Test creating all option types
2. Test associating options with plans
3. Test removing options from plans
4. Test the frontend admin interface
5. Test the user-facing customization flow

For more information, see the main project README and backend schema documentation.
