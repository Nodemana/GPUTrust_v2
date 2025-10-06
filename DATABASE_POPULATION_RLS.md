# Database Population with Row Level Security (RLS)

This guide explains how to populate your database when Row Level Security (RLS) is enabled and your `users` table has a foreign key relationship with `auth.users`.

## The Problem

Your database has the following setup:
- **Row Level Security (RLS)** enabled on all tables
- **`users` table** has a foreign key to `auth.users(id)`
- **RLS policies** prevent anonymous users from inserting data
- **Authentication required** for most operations

This means the standard approach of inserting data directly into the `users` table will fail with RLS policy violations.

## Solutions

### 1. Service Role Approach (Recommended for Development)

**Best for:** Development, testing, and data seeding

This approach uses the Supabase service role key to bypass RLS policies.

#### Setup

1. **Get your service role key** from your Supabase dashboard:
   - Go to Settings → API
   - Copy the `service_role` key (not the `anon` key)

2. **Add to your `.env` file**:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Run the service role population script**:
   ```bash
   # Basic population
   npm run populate-db:service
   
   # Clear and repopulate
   npm run populate-db:service:clear
   
   # Large dataset
   npm run populate-db:service:large
   ```

#### How it works

- Uses the service role key to create a Supabase client that bypasses RLS
- Generates UUIDs for user IDs (simulating `auth.users.id`)
- Inserts data directly into tables without authentication
- Perfect for development and testing

### 2. Auth-Aware Approach (Production-like)

**Best for:** Testing authentication flows and production-like scenarios

This approach creates actual `auth.users` entries and then populates the public tables.

#### Usage

```typescript
import { populateDatabaseWithAuth } from '@/app/lib/db/auth-aware-data';

const result = await populateDatabaseWithAuth({
  userCount: 5,
  benchmarkCount: 10,
  listingCount: 15
});
```

#### How it works

- Creates users in `auth.users` using Supabase Auth Admin API
- Creates corresponding entries in `public.users`
- Respects all RLS policies and foreign key constraints
- More realistic for testing authentication flows

### 3. Manual Auth User Creation

**Best for:** When you want to test with specific users

1. **Create auth users manually** in your Supabase dashboard
2. **Use the service role approach** to populate data for those users
3. **Test your application** with real authentication

## Environment Variables

Make sure you have these in your `.env` file:

```bash
# Required for basic connection
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Required for service role approach (recommended)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: For auth-aware approach
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Same as above
```

## Scripts Available

### Service Role Scripts (Recommended)
```bash
# Basic population (5 users, 10 benchmarks, 15 listings)
npm run populate-db:service

# Clear existing data and repopulate
npm run populate-db:service:clear

# Large dataset (20 users, 50 benchmarks, 100 listings)
npm run populate-db:service:large

# Custom counts
npx tsx src/app/lib/db/populate-db-service-role.ts --users=10 --benchmarks=25 --listings=50
```

### Original Scripts (May fail with RLS)
```bash
# These may fail if RLS is enabled
npm run populate-db
npm run populate-db:clear
npm run populate-db:large
```

## Data Structure

The service role approach generates data that works with your schema:

### Users
- **ID**: UUID (compatible with `auth.users.id`)
- **Email**: Unique email addresses
- **Username**: Realistic usernames
- **Phone**: Unique phone numbers

### GPU Benchmarks
- **User ID**: References the generated user IDs
- **Performance Data**: Realistic FLOPS, memory bandwidth, temperatures
- **GPU Models**: RTX 4090, RTX 4080, RTX 4070, RX 7900 XTX, RX 7900 XT

### GPU Listings
- **User ID**: References the generated user IDs
- **Benchmark ID**: References the generated benchmark IDs
- **Pricing**: Multiple currencies (SOL, USD, ETH)
- **Locations**: Major US cities
- **Conditions**: excellent, good, fair, like_new

## Troubleshooting

### "Service role key not available"
- **Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file
- **Get the key**: Supabase Dashboard → Settings → API → service_role key

### "RLS policy violation"
- **Solution**: Use the service role approach (`npm run populate-db:service`)
- **Alternative**: Temporarily disable RLS for development

### "Foreign key constraint violation"
- **Solution**: The service role approach generates compatible UUIDs
- **Check**: Ensure your foreign key constraints are properly set up

### "Auth user creation failed"
- **Solution**: Use the service role approach instead of auth-aware approach
- **Alternative**: Create auth users manually in the Supabase dashboard

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit service role keys** to version control
2. **Use service role only in development** and testing
3. **In production**, use proper authentication flows
4. **Service role bypasses all RLS policies** - use with caution

## Production Considerations

For production environments:

1. **Use proper authentication flows** (sign up, sign in)
2. **Let users create their own profiles** through your app
3. **Use the auth-aware approach** for testing authentication
4. **Never use service role** in production for user data

## Example Usage in Code

```typescript
// Service role approach (development)
import { populateDatabaseWithServiceRole } from '@/app/lib/db/service-role-data';

const result = await populateDatabaseWithServiceRole({
  userCount: 10,
  benchmarkCount: 25,
  listingCount: 50
});

// Auth-aware approach (production-like)
import { populateDatabaseWithAuth } from '@/app/lib/db/auth-aware-data';

const result = await populateDatabaseWithAuth({
  userCount: 5,
  benchmarkCount: 10,
  listingCount: 15
});
```

This approach ensures your database population works correctly with RLS and maintains the integrity of your authentication system.
