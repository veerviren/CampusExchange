# Demo Products Seeding Script

This script seeds all demo products from `demoProducts.json` into your database using an authenticated user token.

## Usage

```bash
node seed-demo-products.js <YOUR_AUTH_TOKEN>
```

## Example

```bash
node seed-demo-products.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMDRiMjdiMi03YTk3LTQ2MzUtODczNi0xMTNmODVhNTI0MDEiLCJpYXQiOjE3NjM2NTAyNTJ9.W4P9mJ0hZiG4qADAispWMYhc9BDzx8PwgNJ125ebtT8
```

## What it does

1. Reads all products from `../campus_exchange_frontend/src/data/demoProducts.json`
2. Creates each product in the database via the `/products` API endpoint
3. Uses your authentication token to associate products with your user account
4. Shows progress and summary of created products

## Output

The script will show:
- ✅ Successfully created products
- ❌ Failed products (with error messages)
- 📊 Final summary with counts

## Notes

- All products will be created under the authenticated user's account
- Products marked with `isFeatured: true` will appear in the Featured section
- Products are categorized by the `category` field
- The script includes a small delay between requests to avoid overwhelming the server
