import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * Escapes regex special characters to prevent ReDoS and invalid regex errors.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * GET /api/products
 * Query options: search, category, sort, page, limit
 */
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, occasion } = req.query;

    // Validate page & limit
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) {
      if (req.query.page !== undefined) {
        return res.status(400).json({ error: { message: 'Invalid page number. Page must be a positive integer.' } });
      }
      page = 1;
    }

    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1) {
      if (req.query.limit !== undefined) {
        return res.status(400).json({ error: { message: 'Invalid limit. Limit must be a positive integer.' } });
      }
      limit = 8;
    }
    if (limit > 100) limit = 100;

    // Build filter query
    const filter = {};

    // Filter by Occasion
    if (occasion && occasion !== 'all') {
      filter.occasion = occasion.trim().toLowerCase();
    }

    // Filter by Category (supports category slug or ObjectId)
    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const foundCat = await Category.findOne({ slug: category.trim().toLowerCase() });
        if (foundCat) {
          filter.category = foundCat._id;
        } else {
          // If category slug doesn't exist, return empty result set gracefully
          return res.json({
            products: [],
            total: 0,
            page,
            pages: 0,
            hasMore: false,
          });
        }
      }
    }

    // Filter by Search Query (name or description)
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const sanitized = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { 'details.Material': { $regex: sanitized, $options: 'i' } },
        { 'details.Craft': { $regex: sanitized, $options: 'i' } },
      ];
    }

    // Determine Sorting
    let sortQuery = { createdAt: -1 }; // default: newest
    if (sort === 'price-asc') {
      sortQuery = { price: 1 };
    } else if (sort === 'price-desc') {
      sortQuery = { price: -1 };
    } else if (sort === 'featured') {
      sortQuery = { featured: -1, createdAt: -1 };
    } else if (sort === 'newest') {
      sortQuery = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate('category', 'name slug description image count')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    return res.json({
      products,
      total,
      page,
      pages,
      hasMore: page < pages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/featured
 * Returns up to 4 featured products for home showcase.
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('category', 'name slug description')
      .sort({ createdAt: -1 })
      .limit(4);

    return res.json({ products });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:slug
 * Looks up product by slug or ID.
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return res.status(400).json({ error: { message: 'Product slug or ID is required.' } });
    }

    let product = null;

    // Check if slug is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug).populate('category', 'name slug description image count');
    }

    // If not found by ID, look up by slug
    if (!product) {
      product = await Product.findOne({ slug: slug.trim().toLowerCase() }).populate(
        'category',
        'name slug description image count'
      );
    }

    if (!product) {
      return res.status(404).json({ error: { message: `Product '${slug}' was not found.` } });
    }

    return res.json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id/related
 * Returns 3-4 related products in the same category, excluding the current product.
 */
export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: { message: 'Product ID or slug is required.' } });
    }

    // Find current product first
    let current = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      current = await Product.findById(id);
    }
    if (!current) {
      current = await Product.findOne({ slug: id.trim().toLowerCase() });
    }

    if (!current) {
      return res.status(404).json({ error: { message: 'Target product not found.' } });
    }

    // Query same-category products excluding current product
    const related = await Product.find({
      category: current.category,
      _id: { $ne: current._id },
    })
      .populate('category', 'name slug description')
      .limit(4);

    return res.json({ related });
  } catch (error) {
    next(error);
  }
};
