import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

// Setup __dirname and load environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seedOwner() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gift_shop';
  console.log(`🔐 Connecting to MongoDB at ${uri}...`);

  const ownerName = process.env.OWNER_NAME || 'Shive Shakti Admin';
  const ownerEmail = (process.env.OWNER_EMAIL || 'enterprisesdheeraj2@gmail.com').toLowerCase().trim();
  const ownerPassword = process.env.OWNER_PASSWORD;

  if (!ownerPassword) {
    console.error('❌ Error: OWNER_PASSWORD must be defined in .env before running seed:owner.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(' Connected to database.');

    const passwordHash = await User.hashPassword(ownerPassword);

    let owner = await User.findOne({ email: ownerEmail });

    if (owner) {
      console.log(`ℹ️  Existing account found for '${ownerEmail}'. Updating credentials & OWNER role...`);
      owner.name = ownerName;
      owner.passwordHash = passwordHash;
      owner.role = 'OWNER';
      owner.isActive = true;
      await owner.save();
    } else {
      console.log(`✨ Creating initial OWNER account for '${ownerEmail}'...`);
      owner = await User.create({
        name: ownerName,
        email: ownerEmail,
        passwordHash,
        role: 'OWNER',
        isActive: true,
      });
    }

    console.log('✅ Initial OWNER account configured successfully:');
    console.log(`   - Name:  ${owner.name}`);
    console.log(`   - Email: ${owner.email}`);
    console.log(`   - Role:  ${owner.role}`);
    console.log(`   - ID:    ${owner._id}`);
    console.log(`   - Password: [CONFIGURED IN ENVIRONMENT]`);

    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed OWNER account:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedOwner();
