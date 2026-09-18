import mongoose from 'mongoose';

const salonSchema = new mongoose.Schema(
  {
    city: { type: String, default: '' },
    title: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Shive Shakti Enterprises',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Artisanal Indian Luxury Gifts',
      trim: true,
    },
    phone: {
      type: String,
      default: '+91 63770 27248',
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: '916377027248',
      trim: true,
    },
    email: {
      type: String,
      default: 'contact@shiveshakti.in',
      trim: true,
    },
    address: {
      type: String,
      default: 'Chaman Gali, Ramsar, Ajmer - 305402',
      trim: true,
    },
    salons: {
      type: [salonSchema],
      default: [
        {
          city: 'Ajmer',
          title: 'Shive Shakti Enterprises Store',
          address: 'Chaman Gali, Ramsar, Ajmer - 305402',
        },
      ],
    },
    openingHours: {
      type: String,
      default: 'Mon–Sat: 10:00 AM – 8:00 PM (IST)',
      trim: true,
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/mineeee.in' },
      whatsapp: { type: String, default: 'https://wa.me/916377027248' },
      pinterest: { type: String, default: '' },
    },
    mapEmbedUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Chaman+Gali+Ramsar+Ajmer+305402',
      trim: true,
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Chaman+Gali+Ramsar+Ajmer+305402',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        // Aliases for compatibility
        ret.whatsapp = ret.whatsappNumber;
        ret.shopName = ret.storeName;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

/**
 * Singleton getter: retrieves existing settings or seeds a default document
 */
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
