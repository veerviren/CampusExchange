const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read demo products from frontend
const demoProductsPath = path.join(__dirname, '../campus_exchange_frontend/src/data/demoProducts.json');
const demoProducts = JSON.parse(fs.readFileSync(demoProductsPath, 'utf8'));

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:8080';
const AUTH_TOKEN = process.argv[2]; // Get token from command line argument

if (!AUTH_TOKEN) {
    console.error('❌ Error: Please provide an authentication token');
    console.log('\nUsage: node seed-demo-products.js <YOUR_AUTH_TOKEN>');
    console.log('\nExample:');
    console.log('node seed-demo-products.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    process.exit(1);
}

// Collect all products from the JSON file
function getAllProducts() {
    // demoProducts is now a simple array
    return demoProducts;
}

// Create a product via API
async function createProduct(product) {
    try {
        const response = await axios.post(
            `${API_URL}/products`,
            {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                images: product.images || [],
                isFeatured: product.isFeatured || false,
                discount: product.discount || null,
                tags: product.tags || []
            },
            {
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Created: ${product.name} (${product.category})`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to create ${product.name}:`, error.response?.data?.message || error.message);
        return null;
    }
}

// Main function
async function seedDemoProducts() {
    console.log('🌱 Starting demo products seeding...\n');
    console.log(`📡 API URL: ${API_URL}`);
    console.log(`🔑 Using provided authentication token\n`);

    const products = getAllProducts();
    console.log(`📦 Found ${products.length} unique products to seed\n`);

    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
        const result = await createProduct(product);
        if (result) {
            successCount++;
        } else {
            failCount++;
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Seeding Summary:');
    console.log(`✅ Successfully created: ${successCount} products`);
    console.log(`❌ Failed: ${failCount} products`);
    console.log('='.repeat(50));

    if (successCount > 0) {
        console.log('\n🎉 Demo products have been seeded to the database!');
        console.log('You can now view them in the Explore page.');
    }
}

// Run the seeding
seedDemoProducts().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
});
