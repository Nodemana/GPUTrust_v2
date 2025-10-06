# Database Population Guide

This guide explains how to populate your GPU Trust database with sample data using the provided tools and scripts.

## Quick Start

### 1. Basic Population
```bash
npm run populate-db
```
This will populate your database with:
- 5 users
- 10 GPU benchmarks  
- 15 GPU listings

### 2. Clear and Repopulate
```bash
npm run populate-db:clear
```
This clears existing data and repopulates with fresh sample data.

### 3. Large Dataset
```bash
npm run populate-db:large
```
This populates with a larger dataset:
- 20 users
- 50 GPU benchmarks
- 100 GPU listings

## Custom Population

### Command Line Options
```bash
# Custom counts
node scripts/populate-db.js --users=10 --benchmarks=25 --listings=50

# Clear existing data first
node scripts/populate-db.js --clear --users=5 --benchmarks=10 --listings=15
```

### Programmatic Usage

#### TypeScript/JavaScript
```typescript
import { populateDatabase, clearSampleData } from '@/app/lib/db/insert-sample-data';

// Populate with custom counts
const result = await populateDatabase({
  userCount: 10,
  benchmarkCount: 25,
  listingCount: 50
});

// Clear existing data
await clearSampleData();
```

#### Individual Inserts
```typescript
import { 
  insertUser, 
  insertGPUBenchmark, 
  insertGPUListing 
} from '@/app/lib/db/insert-sample-data';

// Insert a single user
const userResult = await insertUser();

// Insert a GPU benchmark
const benchmarkResult = await insertGPUBenchmark();

// Insert a GPU listing
const listingResult = await insertGPUListing();
```

## Sample Data Details

### Users
- 5 different user profiles with realistic usernames and emails
- Phone numbers and unique IDs
- Examples: "crypto_miner_99", "ai_researcher", "gaming_enthusiast"

### GPU Benchmarks
- 5 different GPU models: RTX 4090, RTX 4080, RTX 4070, RX 7900 XTX, RX 7900 XT
- Realistic performance metrics (FLOPS, memory bandwidth, temperatures, power draw)
- CUDA versions, driver versions, and architectural details
- Randomized but realistic variance in performance numbers

### GPU Listings
- Marketplace listings with titles, descriptions, and pricing
- Multiple currencies: SOL, USD, ETH
- Various conditions: excellent, good, fair, like_new
- Different statuses: active, sold
- Geographic locations across major US cities
- Image URLs (placeholder)

## File Structure

```
src/app/lib/db/
├── placeholder-data.ts      # Data generation functions
├── insert-sample-data.ts    # Database insertion functions  
├── populate-db.ts           # TypeScript population script
├── example-usage.ts         # Usage examples
└── dbclient.ts             # Database connection

scripts/
└── populate-db.js          # JavaScript population script
```

## Environment Requirements

Make sure you have these environment variables set:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Connection Issues
- Verify your Supabase credentials are correct
- Check that your database is accessible
- Ensure your environment variables are loaded

### Data Issues
- If you get foreign key constraint errors, try clearing data first with `--clear`
- Make sure your database schema matches the expected structure
- Check that all required tables exist

### Performance
- For large datasets, consider running the population in smaller batches
- Monitor your Supabase usage limits
- The script includes progress indicators for long-running operations

## Examples

See `src/app/lib/db/example-usage.ts` for comprehensive examples of how to use the population functions in your application code.
