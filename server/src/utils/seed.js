import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';

// Setup __dirname and load environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import mock data from client
const clientDataPath = path.resolve(__dirname, '../../../client/src/data');

async function loadData() {
  const { mockCategories } = await import(`file://${path.join(clientDataPath, 'mockCategories.js')}`);
  const { mockProducts } = await import(`file://${path.join(clientDataPath, 'mockProducts.js')}`);
  const { mockSettings } = await import(`file://${path.join(clientDataPath, 'mockSettings.js')}`);
  return { mockCategories, mockProducts, mockSettings };
}

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gift_shop';
  console.log(`🌱 Connecting to MongoDB at ${uri}...`);

  try {
    await mongoose.connect(uri);
    console.log(' Connected to database.');

    const { mockCategories, mockProducts, mockSettings } = await loadData();

    // 1. Clear existing collections
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Settings.deleteMany({}),
    ]);

    // 2. Insert Categories
    console.log(`📁 Seeding ${mockCategories.length} categories...`);
    const categoryDocs = await Category.insertMany(
      mockCategories.map((c) => ({
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        image: c.image || '',
        count: c.count || '',
      }))
    );

    // Create category slug -> _id lookup map
    const categoryMap = {};
    categoryDocs.forEach((doc) => {
      categoryMap[doc.slug] = doc._id;
    });

    // 3. Insert Products
    console.log(`📦 Seeding ${mockProducts.length} products...`);
    const productData = mockProducts.map((p) => {
      const categoryId = categoryMap[p.category];
      if (!categoryId) {
        throw new Error(`Category '${p.category}' not found for product '${p.name}'`);
      }

      const images =
        p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []);

      return {
        name: p.name,
        slug: p.slug,
        price: p.price,
        category: categoryId,
        images,
        image: p.image || (images[0] || ''),
        description: p.description,
        details: p.specs || {},
        available: p.available !== undefined ? p.available : true,
        featured: Boolean(p.featured),
        badge: p.badge || null,
        occasion: p.occasion || null,
        personalizable: Boolean(p.personalizable),
        personalizationNote: p.personalizationNote || null,
      };
    });

    const productDocs = await Product.insertMany(productData);

    // 4. Seed Settings
    console.log('⚙️  Seeding boutique settings...');
    await Settings.create({
      storeName: mockSettings.shopName || 'Shive Shakti Enterprises',
      tagline: mockSettings.tagline || 'Artisanal Indian Luxury Gifts',
      phone: mockSettings.phone || '+91 63770 27248',
      whatsappNumber: mockSettings.whatsapp || '916377027248',
      email: mockSettings.email || 'contact@shiveshakti.in',
      address: mockSettings.address || 'Chaman Gali, Ramsar, Ajmer - 305402',
      salons: mockSettings.salons || [],
      openingHours: mockSettings.openingHours || 'Mon–Sat: 10:00 AM – 8:00 PM (IST)',
      socialLinks: {
        instagram: mockSettings.socialLinks?.instagram || 'https://instagram.com/mineeee.in',
        whatsapp: mockSettings.socialLinks?.whatsapp || `https://wa.me/${mockSettings.whatsapp || '916377027248'}`,
        pinterest: '',
      },
      mapEmbedUrl: mockSettings.googleMapsUrl || 'https://maps.google.com/?q=Chaman+Gali+Ramsar+Ajmer+305402',
      googleMapsUrl: mockSettings.googleMapsUrl || 'https://maps.google.com/?q=Chaman+Gali+Ramsar+Ajmer+305402',
    });

    console.log('✅ Database seeded successfully:');
    console.log(`   - ${categoryDocs.length} Categories created`);
    console.log(`   - ${productDocs.length} Products created`);
    console.log(`   - 1 Store Settings record created`);

    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
