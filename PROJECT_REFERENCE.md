# Mayberry Home Builder - Project Reference Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Backend Configuration](#backend-configuration)
3. [Schema Design and Data Structures](#schema-design-and-data-structures)
4. [Frontend Components](#frontend-components)
5. [User Experience](#user-experience)
6. [Admin Experience](#admin-experience)
7. [Plan Creation Workflow](#plan-creation-workflow)
8. [Areas of Improvement](#areas-of-improvement)
9. [Development Guidelines](#development-guidelines)

## Project Overview

Mayberry Home Builder is a comprehensive full-stack application for home customization and pricing. It enables users to browse floor plans, customize options, and save personalized home configurations with real-time pricing calculations.

### Architecture Summary
- **Monorepo Structure**: Root, Client, and Server directories
- **Frontend**: React 18 + TypeScript + Apollo Client + Bootstrap + Vite
- **Backend**: GraphQL (Apollo Server) + Express + MongoDB (Mongoose) + JWT Authentication
- **Database**: MongoDB with comprehensive data validation and relationships

## Backend Configuration

### Server Architecture (`server/src/server.ts`)
```typescript
// Key Components:
- Apollo Server with GraphQL endpoint at /graphql
- Express middleware for static file serving
- JWT-based authentication with user context
- MongoDB connection via Mongoose
- Development and production environment support
```

### Database Connection (`server/src/config/connection.ts`)
- MongoDB Atlas connection with proper error handling
- Database name: 'PricingModel'
- Environment-based connection string
- Secure connection logging without exposing credentials

### Authentication System (`server/src/services/auth.ts`)
- JWT tokens with 1-hour expiration
- Role-based access control (admin/user)
- Middleware integration for GraphQL context
- Custom authentication error handling

### Environment Variables Required
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
PORT=3001 (optional, defaults to 3001)
```

## Schema Design and Data Structures

### Core Data Models

#### User Model (`server/src/models/User.ts`)
```typescript
interface UserDocument {
  username: string;
  email: string;
  password: string; // bcrypt hashed
  role: 'admin' | 'user';
  savedHomes: UserHomeSelection[];
  homeCount: number; // virtual field
}
```

#### Plan Model (`server/src/models/Plan.ts`)
```typescript
interface PlanTypeDocument {
  planType: number; // Unique identifier
  name: string; // e.g., "Beacon"
  bedrooms: number;
  bathrooms: number;
  totalSqft: number;
  resSqft: number;
  garage: number;
  basePrice: number;
  width: number;
  length: number;
  // Associated options (referenced by ObjectId)
  elevations: OptionDocument[];
  colorScheme: ColorSchemeDocument[];
  interiors: InteriorPackageDocument[];
  structural: OptionDocument[];
  additional: OptionDocument[];
  kitchenAppliance: ApplianceDocument[];
  laundryAppliance: ApplianceDocument[];
  lotPremium: LotPremiumDocument[];
}
```

#### User Home Selection (`server/src/models/UserHome.ts`)
```typescript
interface UserHomeSelection {
  userId: ObjectId;
  plan: ObjectId;
  configurationName: string;
  // Required selections
  elevation: ObjectId;
  colorScheme: ObjectId;
  interiorPackage: ObjectId;
  kitchenAppliance: ObjectId;
  // Optional selections
  laundryAppliance?: ObjectId;
  lotPremium?: ObjectId;
  // Multiple selections
  structuralOptions: ObjectId[];
  additionalOptions: ObjectId[];
  // Pricing (auto-calculated)
  basePlanPrice: number;
  optionsTotalPrice: number;
  totalPrice: number;
  // Status tracking
  status: 'draft' | 'submitted' | 'contracted' | 'building' | 'completed';
  isActive: boolean;
}
```

### Option Categories

1. **Options** - Basic customizable features (elevations, additional features)
2. **InteriorOptions** - Interior customization materials
3. **Appliances** - Kitchen and laundry appliance packages
4. **Structural** - Structural modifications (garage, bedrooms, bathrooms)
5. **ColorSchemes** - Exterior color combinations
6. **InteriorPackages** - Pre-configured interior upgrade bundles
7. **LotPremiums** - Location-based pricing adjustments

### GraphQL Schema Features
- Comprehensive type definitions for all models
- Input types for mutations with validation
- Role-based mutation access (admin-only for plan/option management)
- Nested object population for complex relationships
- Real-time pricing calculations

## Frontend Components

### Application Structure (`client/src/`)

#### Core App Components
- **App.tsx** - Apollo Client setup, authentication link, error boundary
- **Navbar.tsx** - Navigation with role-based menu items
- **ErrorBoundary.tsx** - Global error handling

#### Authentication Components
- **LoginForm.tsx** - User authentication
- **SignupForm.tsx** - User registration
- **ProtectedRoute.tsx** - Route protection for authenticated users
- **RoleBasedRoute.tsx** - Admin-only route protection

#### Customization System
- **CustomizationWizard.tsx** - Main home customization interface
  - Multi-step wizard (7 steps)
  - Real-time pricing calculations
  - Auto-save functionality for authenticated users
  - Progress tracking and validation

#### Wizard Steps (`client/src/components/wizard-steps/`)
1. **ElevationStep.tsx** - Exterior elevation and color scheme selection
2. **InteriorStep.tsx** - Interior package selection
3. **StructuralStep.tsx** - Structural modifications (optional)
4. **AdditionalStep.tsx** - Additional features (optional)
5. **ApplianceStep.tsx** - Kitchen and laundry appliance selection
6. **LotSelectionStep.tsx** - Lot premium selection
7. **PricingStep.tsx** - Final review and save functionality

#### Admin Components
- **AdminDashboard.tsx** - Tabbed admin interface
- **AdminPlanManager.tsx** - Floor plan CRUD operations
- **AdminOptionsManager.tsx** - Option management
- **AdminInteriorPackagesManager.tsx** - Interior package management
- **AdminColorSchemeManager.tsx** - Color scheme management
- **AdminLotPremiumsManager.tsx** - Lot premium management

#### Pages
- **Home.tsx** - Floor plan browsing and selection
- **CustomizeHome.tsx** - Customization wizard container
- **SavedHomes.tsx** - User's saved home configurations
- **AdminDashboard.tsx** - Admin panel

### State Management
- Apollo Client for GraphQL state management
- Local React state for UI interactions
- localStorage for authentication tokens
- Custom hooks for data fetching and mutations

## User Experience

### User Journey Flow
1. **Browse Plans** - View available floor plans with basic details
2. **Select Plan** - Choose a floor plan to customize
3. **Customization Wizard** - 7-step guided customization process
4. **Real-time Pricing** - See price updates as options are selected
5. **Save Configuration** - Save completed designs (requires authentication)
6. **Manage Saved Homes** - View and delete saved configurations

### Key User Features
- **Responsive Design** - Bootstrap-based mobile-friendly interface
- **Visual Selection** - Image-based option selection where available
- **Price Transparency** - Real-time total pricing with breakdown
- **Progress Saving** - Auto-save functionality for logged-in users
- **Step Navigation** - Jump between wizard steps with validation
- **Configuration Summary** - Detailed breakdown of selected options

### User Authentication
- JWT-based authentication
- Persistent login sessions
- Role-based access control
- Secure password handling with bcrypt

## Admin Experience

### Admin Dashboard Features
- **Tabbed Interface** - Organized management sections
- **CRUD Operations** - Full create, read, update, delete functionality
- **Relationship Management** - Associate options with floor plans
- **Data Validation** - Form validation and error handling
- **Batch Operations** - Efficient management of multiple items

### Admin Management Areas
1. **Floor Plans** - Create and manage home plans with specifications
2. **Options** - Manage elevation and additional options
3. **Interior Packages** - Create interior upgrade bundles
4. **Interior Options** - Manage individual interior materials
5. **Color Schemes** - Define exterior color combinations
6. **Lot Premiums** - Set location-based pricing

### Admin Capabilities
- **Plan Creation** - Define new floor plans with all specifications
- **Option Assignment** - Associate options with specific plans
- **Pricing Management** - Set and update option pricing
- **Data Relationships** - Manage complex option relationships
- **User Management** - View user data and configurations

## Plan Creation Workflow

### Step 1: Plan Definition
```typescript
// Basic plan information
{
  planType: unique_number,
  name: "Plan Name",
  bedrooms: number,
  bathrooms: number,
  totalSqft: number,
  resSqft: number,
  garage: number,
  basePrice: number,
  width: number,
  length: number
}
```

### Step 2: Option Creation
Create individual options for each category:
- Elevations (exterior styles)
- Color schemes (exterior colors)
- Interior packages (upgrade bundles)
- Structural options (modifications)
- Additional options (features)
- Appliance packages (kitchen/laundry)
- Lot premiums (location-based)

### Step 3: Plan-Option Association
Associate created options with specific plans through the admin interface.

### Step 4: Validation and Testing
- Test plan customization flow
- Verify pricing calculations
- Validate option availability
- Check data relationships

## Areas of Improvement

### Technical Improvements

1. **Performance Optimization**
   - Implement GraphQL query optimization
   - Add client-side caching strategies
   - Optimize image loading and display
   - Add lazy loading for large datasets

2. **Code Quality**
   - Implement comprehensive TypeScript interfaces
   - Add unit and integration tests
   - Improve error handling and logging
   - Add API documentation

3. **Security Enhancements**
   - Implement rate limiting
   - Add input sanitization
   - Enhance JWT security
   - Add audit logging

4. **Database Optimization**
   - Add database indexes for performance
   - Implement data archiving strategies
   - Add backup and recovery procedures
   - Optimize query performance

### Feature Enhancements

1. **User Experience**
   - Add 3D visualization
   - Implement comparison features
   - Add sharing capabilities
   - Enhance mobile experience

2. **Admin Tools**
   - Add bulk import/export functionality
   - Implement analytics dashboard
   - Add user management features
   - Create reporting tools

3. **Business Logic**
   - Add financing calculations
   - Implement approval workflows
   - Add contract generation
   - Create notification system

### UI/UX Improvements

1. **Visual Design**
   - Add image galleries for options
   - Implement virtual tours
   - Create interactive floor plans
   - Add progress animations

2. **Accessibility**
   - Implement WCAG compliance
   - Add keyboard navigation
   - Improve screen reader support
   - Add high contrast mode

3. **Performance**
   - Implement progressive loading
   - Add offline capabilities
   - Optimize bundle size
   - Add service worker

## Development Guidelines

### Code Standards
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error boundaries
- Use meaningful variable names
- Add JSDoc comments for complex functions

### Testing Strategy
- Unit tests for utility functions
- Integration tests for GraphQL resolvers
- Component tests for React components
- End-to-end tests for critical user flows

### Deployment Process
1. Build TypeScript server code
2. Build React client application
3. Deploy to production environment
4. Configure environment variables
5. Run database migrations if needed

### Security Considerations
- Never commit secrets to version control
- Use environment variables for configuration
- Implement proper authentication checks
- Validate all user inputs
- Use HTTPS in production

This reference guide serves as the foundation for understanding and maintaining the Mayberry Home Builder application. Regular updates to this document ensure it remains current with the codebase evolution.