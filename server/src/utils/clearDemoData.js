import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Setup __dirname and load environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function clearDemoData() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gift_shop';
  console.log(`Connecting to MongoDB to clear demo data...`);

  try {
    await mongoose.connect(uri);
    console.log(' Connected to database.');

    const deletedProducts = await Product.deleteMany({});
    const deletedCategories = await Category.deleteMany({});

    console.log(`🧹 Cleared demo data:`);
    console.log(`   - Deleted ${deletedProducts.deletedCount} demo products`);
    console.log(`   - Deleted ${deletedCategories.deletedCount} demo categories`);
    console.log(` Store settings and admin accounts are preserved.`);
    console.log(` Client can now add their own categories and products via the Admin Portal.`);

    await mongoose.connection.close();
    console.log('👋 Database connection closed.');
  } catch (error) {
    console.error('❌ Error clearing demo data:', error);
    process.exit(1);
  }
}

clearDemoData();
