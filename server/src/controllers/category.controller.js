import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

/**
 * GET /api/categories
 * Returns all categories with product counts.
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Attach real dynamic product count if count property isn't explicitly set
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const catObj = cat.toJSON();
        const productCount = await Product.countDocuments({ category: cat._id });
        catObj.productCount = productCount;
        if (!catObj.count || catObj.count.trim() === '') {
          catObj.count = `${productCount} Creations`;
        }
        return catObj;
      })
    );

    return res.json({ categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:slug
 * Returns a single category by slug or ID.
 */
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return res.status(400).json({ error: { message: 'Category slug is required.' } });
    }

    let category = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      category = await Category.findById(slug);
    }
    if (!category) {
      category = await Category.findOne({ slug: slug.trim().toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({ error: { message: `Category '${slug}' was not found.` } });
    }

    const catObj = category.toJSON();
    catObj.productCount = await Product.countDocuments({ category: category._id });

    return res.json({ category: catObj });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:slug/products
 * Returns all products under a given category slug.
 */
export const getCategoryProducts = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ error: { message: 'Category slug is required.' } });
    }

    let category = null;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      category = await Category.findById(slug);
    }
    if (!category) {
      category = await Category.findOne({ slug: slug.trim().toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({ error: { message: `Category '${slug}' not found.` } });
    }

    const products = await Product.find({ category: category._id })
      .populate('category', 'name slug description')
      .sort({ createdAt: -1 });

    return res.json({
      category: category.toJSON(),
      products,
      total: products.length,
    });
  } catch (error) {
    next(error);
  }
};
