# Type Architecture Guide: GraphQL + Mongoose + TypeScript

## Your Current Three-Layer Architecture

### Layer 1: GraphQL Schema (typeDefs.ts)
**Purpose:** Defines the API contract - what clients can query
```graphql
type InteriorPackage {
    fixtures: [InteriorOption]  # Full objects, not IDs
    lvp: InteriorOption
}
```

### Layer 2: Mongoose Documents (Plan.ts, InteriorPackageOption.ts)
**Purpose:** Defines database structure - what's stored in MongoDB
```ts
interface InteriorPackageDocument {
    fixtures?: Types.ObjectId[]  # Just IDs, not full objects
    lvp?: Types.ObjectId
}
```

### Layer 3: TypeScript Interfaces (graphql.ts)
**Purpose:** Type safety for resolvers - what TypeScript expects
```ts
interface InteriorPackageType {
    fixtures: [InteriorOptionType]  # Full objects (after population)
    lvp: InteriorOptionType
}
```

---

## Question 1: Is This Too Much Duplication?

### Answer: **NO, but it can be optimized**

**Industry Standard:** Having three layers is **normal and recommended** for GraphQL + MongoDB projects.

**Why each layer exists:**

1. **GraphQL Schema (typeDefs.ts)**
   - ✅ Single source of truth for API contract
   - ✅ Self-documenting
   - ✅ Validated at runtime
   - ✅ Used by GraphQL tools (Playground, codegen)

2. **Mongoose Documents**
   - ✅ Database schema validation
   - ✅ Business logic (pre-save hooks, methods)
   - ✅ Relationships (refs, populate)
   - ✅ Type safety for database operations

3. **TypeScript Interfaces**
   - ✅ Type safety in resolvers
   - ✅ IDE autocomplete
   - ✅ Compile-time error checking
   - ✅ Can differ from GraphQL schema (e.g., optional fields)

**However:** You can reduce duplication with:
- Code generation (GraphQL Code Generator)
- Shared type utilities
- Better organization

---

## Question 2: Do I Need Embedded Types in Interfaces?

### Answer: **YES, but with a pattern**

**The Problem:**
- Mongoose stores: `fixtures: ObjectId[]` (just IDs)
- GraphQL returns: `fixtures: [InteriorOption]` (full objects after `.populate()`)
- TypeScript needs: Match what GraphQL returns

**The Solution: Use Populated Types**

### Pattern 1: Separate Populated vs Unpopulated Types (Recommended)

```ts
// Unpopulated (what Mongoose stores)
interface InteriorPackageDocument {
    fixtures?: Types.ObjectId[];
    lvp?: Types.ObjectId;
}

// Populated (what GraphQL returns)
interface InteriorPackageType {
    fixtures?: InteriorOptionType[];  // ✅ Embedded
    lvp?: InteriorOptionType;         // ✅ Embedded
}
```

### Pattern 2: Union Types for Flexibility

```ts
// Handle both states
type InteriorPackagePopulated = {
    fixtures: InteriorOptionType[];
    lvp: InteriorOptionType;
}

type InteriorPackageUnpopulated = {
    fixtures: Types.ObjectId[];
    lvp: Types.ObjectId;
}

type InteriorPackage = InteriorPackagePopulated | InteriorPackageUnpopulated;
```

### Pattern 3: Conditional Types (Advanced)

```ts
type Populated<T, K extends keyof T> = Omit<T, K> & {
    [P in K]: InteriorOptionType[];  // Replace ObjectId[] with full types
}

type InteriorPackageType = Populated<InteriorPackageDocument, 'fixtures' | 'lvp'>;
```

---

## Industry Best Practices

### ✅ DO: Match GraphQL Schema in TypeScript Interfaces

```ts
// GraphQL Schema
type InteriorPackage {
    fixtures: [InteriorOption]  # Full objects
}

// TypeScript Interface (matches GraphQL)
interface InteriorPackageType {
    fixtures: InteriorOptionType[];  // ✅ Matches GraphQL
}
```

**Why:** Your resolvers return populated documents, so TypeScript should reflect that.

### ✅ DO: Keep Mongoose Documents Separate

```ts
// Mongoose Document (database layer)
interface InteriorPackageDocument {
    fixtures?: Types.ObjectId[];  // ✅ What's stored
}

// TypeScript Interface (GraphQL layer)
interface InteriorPackageType {
    fixtures?: InteriorOptionType[];  // ✅ What's returned
}
```

**Why:** They serve different purposes - storage vs. API contract.

### ✅ DO: Use Type Guards for Safety

```ts
function isPopulated(pkg: InteriorPackageType): pkg is InteriorPackagePopulated {
    return Array.isArray(pkg.fixtures) && 
           pkg.fixtures.length > 0 && 
           typeof pkg.fixtures[0] === 'object' &&
           'name' in pkg.fixtures[0];
}
```

### ❌ DON'T: Mix Layers

```ts
// ❌ BAD: Don't use Mongoose types in GraphQL resolvers
me: async (): Promise<InteriorPackageDocument> => {
    // This exposes Mongoose internals
}

// ✅ GOOD: Use GraphQL types
me: async (): Promise<InteriorPackageType> => {
    // This matches GraphQL schema
}
```

### ❌ DON'T: Duplicate Field Definitions

```ts
// ❌ BAD: Repeating field definitions
interface InteriorPackageType {
    name: string;
    baseCost: number;
    // ... 20 more fields
}

// In GraphQL schema, you'd repeat all 20 fields
// In Mongoose schema, you'd repeat all 20 fields

// ✅ GOOD: Use code generation or shared utilities
```

---

## Recommended Architecture

### Option A: Current Approach (Good for Small-Medium Projects)

```
typeDefs.ts          → GraphQL Schema (API contract)
models/*.ts          → Mongoose Documents (database)
types/graphql.ts     → TypeScript Interfaces (type safety)
```

**Pros:**
- Clear separation of concerns
- Easy to understand
- Works well for teams

**Cons:**
- Some duplication
- Manual sync required

### Option B: Code Generation (Best for Large Projects)

```
typeDefs.ts          → GraphQL Schema (single source of truth)
models/*.ts          → Mongoose Documents
codegen.yml          → Generates TypeScript types from GraphQL
```

**Setup:**
```yaml
# codegen.yml
generates:
  server/src/types/graphql.ts:
    plugins:
      - typescript
      - typescript-resolvers
    config:
      mappers:
        InteriorPackage: '../models/OptionSchemas/InteriorPackageOption#InteriorPackageDocument'
```

**Pros:**
- Zero duplication
- Always in sync
- Type-safe end-to-end

**Cons:**
- Setup complexity
- Build step required

---

## Specific Recommendations for Your Code

### 1. Fix InteriorPackageType

**Current (Line 73-98 in graphql.ts):**
```ts
interface InteriorPackageType {
    fixtures: [InteriorOptionType];  // ❌ Tuple, should be array
    lvp: InteriorOptionType;
    // ...
}
```

**Recommended:**
```ts
interface InteriorPackageType {
    _id: string;  // ✅ Add _id
    fixtures?: InteriorOptionType[];  // ✅ Array, optional (matches GraphQL)
    lvp?: InteriorOptionType;         // ✅ Optional (matches GraphQL)
    carpet?: InteriorOptionType;
    backsplash?: InteriorOptionType;
    masterBathTile?: InteriorOptionType;
    countertop?: InteriorOptionType;
    primaryCabinets?: InteriorOptionType;
    secondaryCabinets?: InteriorOptionType;
    cabinetHardware?: InteriorOptionType;
    // ... rest of fields
}
```

**Why:** 
- Matches GraphQL schema (line 88-96 in typeDefs.ts)
- Handles unpopulated state (optional)
- Type-safe for resolvers

### 2. Add Resolver Type Safety

```ts
// In resolvers.ts
interiorPackages: async (): Promise<InteriorPackageType[]> => {
    const packages = await InteriorPackage.find({})
        .populate('fixtures')    // ✅ Populate to match interface
        .populate('lvp')
        .populate('carpet')
        // ... populate all fields
        .sort({ totalPrice: 1, name: 1 });
    
    return packages.map(toInteriorPackageType);
}
```

### 3. Create Helper Types

```ts
// types/graphql.ts

// Base type (what Mongoose stores)
type InteriorPackageBase = Omit<InteriorPackageDocument, 'fixtures' | 'lvp' | 'carpet' | ...>;

// Populated type (what GraphQL returns)
export interface InteriorPackageType extends InteriorPackageBase {
    fixtures?: InteriorOptionType[];
    lvp?: InteriorOptionType;
    carpet?: InteriorOptionType;
    // ... all populated fields
}
```

---

## Summary

### ✅ Your Architecture is Correct

Having three layers is **industry standard** and **necessary** because:
1. GraphQL schema = API contract
2. Mongoose documents = Database structure
3. TypeScript interfaces = Type safety

### ✅ You DO Need Embedded Types

Your `InteriorPackageType` should have:
```ts
fixtures?: InteriorOptionType[];  // ✅ Full objects, not IDs
```

Because:
- GraphQL returns populated objects
- Resolvers use `.populate()`
- TypeScript should match what's returned

### ✅ Recommendations

1. **Fix InteriorPackageType** - Use arrays, not tuples
2. **Add _id fields** - Match GraphQL schema
3. **Make populated fields optional** - Handle unpopulated state
4. **Consider code generation** - For large projects
5. **Keep layers separate** - Don't mix concerns

---

## Example: Complete Type Flow

```ts
// 1. Mongoose Document (Database)
const pkgDoc: InteriorPackageDocument = {
    _id: ObjectId("..."),
    fixtures: [ObjectId("..."), ObjectId("...")],  // IDs
    lvp: ObjectId("...")
}

// 2. After .populate() (Still Mongoose Document)
const populated = await InteriorPackage.findById(id)
    .populate('fixtures')
    .populate('lvp');
// populated.fixtures is now InteriorOptionDocument[]

// 3. After toInteriorPackageType() (GraphQL Type)
const graphqlType: InteriorPackageType = {
    _id: "507f...",
    fixtures: [
        { _id: "507f...", name: "Fixture 1", ... }  // Full objects
    ],
    lvp: { _id: "507f...", name: "LVP Option", ... }
}

// 4. GraphQL Returns (JSON)
{
    "fixtures": [
        { "_id": "507f...", "name": "Fixture 1", ... }
    ],
    "lvp": { "_id": "507f...", "name": "LVP Option", ... }
}
```

Each layer serves a purpose, and embedded types in interfaces are **necessary** for type safety.

