# Home Builder Backend API

This is the GraphQL backend for the home builder application, providing CRUD operations for home plans, options, and user customizations.

## Features

- **Role-based Access Control**: Admin and user roles with different permissions
- **Home Plans**: Manage different home models with base pricing
- **Options**: Customizable features like elevations, appliances, flooring
- **Interior Packages**: Pre-configured interior upgrade packages
- **Lot Premiums**: Location-based pricing adjustments
- **User Homes**: Save and manage user home customizations

## User Roles

### Admin Users
- Can create, update, and delete plans, options, interior packages, and lot premiums
- Can view all user data
- Full CRUD access to all resources

### Regular Users
- Can view available plans and options
- Can customize and save their home selections
- Can update and delete their own saved homes
- Read-only access to plans and options

## GraphQL Schema

### Queries

#### Public Queries (No authentication required)
- `plans`: Get all available home plans
- `plan(id: ID!)`: Get a specific plan by ID
- `planByType(planType: Int!)`: Get a plan by plan type number
- `options`: Get all available options
- `interiorPackages`: Get all interior packages
- `lotPremiums`: Get all lot premiums

#### Authenticated Queries
- `me`: Get current user information
- `user(id: ID, username: String)`: Get user by ID or username
- `userHomes`: Get current user's saved homes
- `userHome(id: ID!)`: Get a specific saved home

### Mutations

#### Authentication
- `createUser(username: String!, email: String!, password: String!)`: Register a new user
- `login(email: String!, password: String!)`: Login user

#### Admin Only Mutations
- `createPlan(plan: PlanInput!)`: Create a new home plan
- `updatePlan(id: ID!, plan: PlanInput!)`: Update an existing plan
- `deletePlan(id: ID!)`: Delete a plan
- `createOption(option: OptionInput!)`: Create a new option
- `updateOption(id: ID!, option: OptionInput!)`: Update an option
- `deleteOption(id: ID!)`: Delete an option
- `createInteriorPackage(interiorPackage: InteriorPackageInput!)`: Create interior package
- `updateInteriorPackage(id: ID!, interiorPackage: InteriorPackageInput!)`: Update interior package
- `deleteInteriorPackage(id: ID!)`: Delete interior package
- `createLotPremium(lotPremium: LotPremiumInput!)`: Create lot premium
- `updateLotPremium(id: ID!, lotPremium: LotPremiumInput!)`: Update lot premium
- `deleteLotPremium(id: ID!)`: Delete lot premium

#### User Mutations
- `saveUserHome(userHome: UserHomeInput!)`: Save a home customization
- `updateUserHome(id: ID!, userHome: UserHomeInput!)`: Update a saved home
- `deleteUserHome(id: ID!)`: Delete a saved home

## Data Models

### Plan
- `planType`: Unique plan number
- `name`: Plan name (e.g., "The Aspen")
- `basePrice`: Starting price for the plan
- `elevations`: Available elevation options
- `colorScheme`: Available color schemes
- `interiors`: Available interior packages
- `structural`: Available structural options
- `additional`: Additional upgrade options
- `kitchenAppliance`: Kitchen appliance options
- `laundryAppliance`: Laundry appliance options
- `lotPremium`: Available lot premium options

### Option
- `name`: Option name
- `price`: Additional cost
- `classification`: Category (elevation, kitchen, appliances, etc.)
- `description`: Detailed description
- `img`: Image URL

### InteriorPackage
- `name`: Package name
- `totalPrice`: Total package price
- `fixtures`: Fixture specifications
- `lvp`: Luxury vinyl plank details
- `carpet`: Carpet specifications
- `kitchenBacksplash`: Kitchen backsplash details
- `masterBathTile`: Master bathroom tile
- `countertop`: Countertop material
- `primaryCabinets`: Primary cabinet specifications
- `secondaryCabinets`: Secondary cabinet specifications
- `upgrade`: Upgrade details

### LotPremium
- `filing`: Filing number
- `lot`: Lot number
- `width`: Lot width
- `length`: Lot length
- `price`: Premium price

### UserHome
- `userId`: User who owns this home
- `planTypeId`: Reference to the base plan
- `planTypeName`: Plan name for display
- `basePrice`: Base plan price
- `elevation`: Selected elevation option
- `colorScheme`: Selected color scheme
- `interior`: Selected interior package
- `structural`: Selected structural options
- `additional`: Selected additional options
- `kitchenAppliance`: Selected kitchen appliances
- `laundryAppliance`: Selected laundry appliances
- `lotPremium`: Selected lot premium
- `totalPrice`: Calculated total price

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

4. **Access GraphQL Playground**:
   Navigate to `http://localhost:4000/graphql`

## Sample Queries

### Get All Plans
```graphql
query {
  plans {
    _id
    planType
    name
    basePrice
    elevations {
      name
      price
    }
  }
}
```

### Create a User Home
```graphql
mutation {
  saveUserHome(userHome: {
    planTypeId: "plan_id_here"
    planTypeName: "The Aspen"
    basePrice: 350000
    elevation: {
      name: "Standard Elevation"
      price: 0
    }
    colorScheme: 1
    interior: {
      name: "Standard Package"
      totalPrice: 25000
    }
    structural: []
    additional: []
    kitchenAppliance: {
      name: "Stainless Steel Appliances"
      price: 5000
    }
    laundryAppliance: {
      name: "Standard Laundry"
      price: 0
    }
    lotPremium: {
      filing: 1
      lot: 1
      price: 0
    }
  }) {
    _id
    username
    homeCount
  }
}
```

### Admin: Create a New Option
```graphql
mutation {
  createOption(option: {
    name: "Premium Hardwood Floors"
    price: 15000
    classification: "flooring"
    description: "Premium hardwood flooring throughout the home"
    img: "premium-hardwood.jpg"
  }) {
    _id
    name
    price
  }
}
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

The API includes comprehensive error handling:
- `AuthenticationError`: When user is not authenticated
- `Admin access required`: When non-admin users try to access admin-only operations
- Validation errors for invalid input data

## Database Schema

The application uses MongoDB with Mongoose ODM. All models include:
- Automatic timestamps (`createdAt`, `updatedAt`)
- Proper indexing for performance
- Virtual fields for calculated values
- Population support for related data 