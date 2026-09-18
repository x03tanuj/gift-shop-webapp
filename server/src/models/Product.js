import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category reference is required'],
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    available: {
      type: mongoose.Schema.Types.Mixed,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    badge: {
      type: String,
      default: null,
      trim: true,
    },
    occasion: {
      type: String,
      default: null,
      trim: true,
    },
    personalizable: {
      type: Boolean,
      default: false,
    },
    personalizationNote: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        // Ensure primary image exists
        if (!ret.image && ret.images && ret.images.length > 0) {
          ret.image = ret.images[0];
        }
        // Aliases for compatibility
        ret.gallery = ret.images && ret.images.length > 0 ? ret.images : (ret.image ? [ret.image] : []);
        ret.specs = ret.details || {};
        // Helper category properties if populated
        if (ret.category && typeof ret.category === 'object' && ret.category.name) {
          ret.categoryName = ret.category.name;
          ret.categorySlug = ret.category.slug;
        }
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Virtual alias: specs -> details
productSchema.virtual('specs').get(function () {
  return this.details || {};
});

// Virtual alias: gallery -> images
productSchema.virtual('gallery').get(function () {
  return this.images && this.images.length > 0 ? this.images : (this.image ? [this.image] : []);
});

export const Product = mongoose.model('Product', productSchema);
export default Product;
