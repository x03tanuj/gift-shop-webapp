import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * Ensures the administrator / owner account configured via environment variables
 * exists and has up-to-date credentials in the database.
 */
export const ensureOwnerAccount = async () => {
  const email = (process.env.OWNER_EMAIL || 'enterprisesdheeraj2@gmail.com').toLowerCase().trim();
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME || 'Shive Shakti Admin';

  if (!password) {
    return;
  }

  try {
    const existing = await User.findOne({ email });
    if (!existing) {
      const passwordHash = await User.hashPassword(password);
      await User.create({
        name,
        email,
        passwordHash,
        role: 'OWNER',
        isActive: true,
      });
      console.log(`🔐 Auto-provisioned OWNER account for '${email}'.`);
    } else {
      const isMatch = await existing.comparePassword(password);
      if (!isMatch) {
        existing.passwordHash = await User.hashPassword(password);
        existing.name = name;
        existing.role = 'OWNER';
        existing.isActive = true;
        await existing.save();
        console.log(`🔐 Synchronized OWNER credentials for '${email}' from environment.`);
      }
    }
  } catch (err) {
    console.warn('⚠️  Could not auto-verify OWNER account:', err.message);
  }
};

/**
 * Connect to MongoDB database.
 * If connection fails, logs a clear warning and allows the server to continue running.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  Warning: MONGODB_URI is not defined in environment variables. MongoDB connection skipped.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await ensureOwnerAccount();
  } catch (error) {
    console.warn(`⚠️  Warning: Could not connect to MongoDB (${error.message}). The server will keep running without database.`);
  }
};
