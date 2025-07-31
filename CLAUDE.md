# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mayberry Home Builder is a full-stack React/GraphQL application for home customization and pricing. The application allows users to browse home plans, customize options, and save personalized home configurations. It features role-based authentication with admin and user roles.

## Architecture

This is a monorepo with two main applications:
- **Client**: React + TypeScript frontend with Vite bundler
- **Server**: Node.js + TypeScript GraphQL API with MongoDB

### Technology Stack
- **Frontend**: React 18, TypeScript, Apollo Client, React Router, Bootstrap, Vite
- **Backend**: GraphQL (Apollo Server), Express, MongoDB (Mongoose), JWT authentication
- **Development**: TypeScript, ESLint, Nodemon

## Common Commands

### Root Level Development
```bash
# Install all dependencies (both client and server)
npm run install

# Start both client and server in development mode
npm run develop

# Build both applications for production
npm run build

# Start production server only
npm start
```

### Client Development (from /client)
```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### Server Development (from /server)
```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Watch mode for development (requires build first)
npm run watch
```

## Application Structure

### Client Architecture
- **Apollo Client**: GraphQL client with authentication context
- **React Router**: Client-side routing with protected routes
- **Authentication**: JWT tokens stored in localStorage
- **Components**: Reusable UI components (Navbar, LoginForm, SignupForm, ProtectedRoute)
- **Pages**: Route-specific pages (Home, CustomizeHome, SavedHomes)
- **Models**: TypeScript interfaces for data structures

### Server Architecture
- **GraphQL Schema**: Type definitions and resolvers for all operations
- **MongoDB Models**: User, Plan, Option, InteriorPackage, LotPremium, UserHome
- **Authentication**: JWT-based with role-based access control
- **Role System**: Admin users can manage plans/options, regular users can save homes

### Key Data Models
- **Plan**: Home plans with base pricing and available options
- **Option**: Customizable features (elevations, appliances, structural)
- **InteriorPackage**: Pre-configured interior upgrade bundles
- **LotPremium**: Location-based pricing adjustments
- **UserHome**: User's saved home customizations with calculated pricing

## Development Notes

### API Configuration
- Server runs on port 3001 (or PORT environment variable)
- GraphQL endpoint: `/graphql`
- Client development server proxies `/graphql` and `/api` to port 3001
- Production serves client from server's static files

### Authentication Flow
- Users authenticate via GraphQL mutations (login/createUser)
- JWT tokens passed in Authorization header as Bearer tokens
- Apollo Client automatically includes tokens in requests
- Server extracts user context from JWT for authorization

### Database Connection
- MongoDB connection configured in `server/src/config/connection.ts`
- Requires `MONGODB_URI` environment variable
- JWT requires `JWT_SECRET` environment variable

### Build Process
- Server: TypeScript compiled to `dist/` directory
- Client: Vite builds to `dist/` directory
- Production deployment serves client files from server

## Role-Based Access

### Admin Users
- Full CRUD operations on plans, options, interior packages, lot premiums
- Can view all user data
- Access all GraphQL mutations

### Regular Users
- View available plans and options (read-only)
- Save, update, and delete their own home customizations
- Cannot modify plan data or view other users' information