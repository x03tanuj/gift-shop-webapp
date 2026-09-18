import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { processImageUpload } from '../utils/upload.js';

/**
 * Generates a unique URL slug for a category based on its name.
 */
async function generateUniqueCategorySlug(name, excludeId = null) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let slug = baseSlug || `category-${Date.now()}`;
  let count = 0;

  while (true) {
    const candidate = count === 0 ? slug : `${slug}-${count}`;
    const query = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Category.findOne(query);
    if (!existing) {
      return candidate;
    }
    count += 1;
  }
}

/**
 * GET /api/admin/categories
 * Returns all categories with live product counts for administrative display.
 */
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const catObj = cat.toJSON();
        const productCount = await Product.countDocuments({ category: cat._id });
        catObj.productCount = productCount;
        return catObj;
      })
    );

    return res.json({ categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/categories/:id
 * Fetches a single category by ID with associated product count.
 */
export const getAdminCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid category ID format.' } });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: { message: 'Category not found.' } });
    }

    const catObj = category.toJSON();
    catObj.productCount = await Product.countDocuments({ category: category._id });

    return res.json({ category: catObj });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/categories
 * Creates a new category with name uniqueness validation.
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    const errors = {};
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.name = 'Category name is required.';
    }

    if (name && typeof name === 'string' && name.trim()) {
      const trimmedName = name.trim();
      // Case-insensitive uniqueness check
      const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });
      if (existing) {
        errors.name = 'A category with this name already exists.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: {
          message: 'Validation failed. Please verify required fields.',
          fields: errors,
        },
      });
    }

    const slug = await generateUniqueCategorySlug(name);

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : '',
      image: image ? image.trim() : '',
    });

    const catObj = category.toJSON();
    catObj.productCount = 0;

    return res.status(201).json({
      category: catObj,
      message: 'Category created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/categories/:id
 * Updates an existing category with name uniqueness and slug synchronization.
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid category ID format.' } });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: { message: 'Category not found.' } });
    }

    const { name, description, image } = req.body;

    const errors = {};
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.name = 'Category name is required.';
    }

    if (name && typeof name === 'string' && name.trim()) {
      const trimmedName = name.trim();
      const existing = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });
      if (existing) {
        errors.name = 'A category with this name already exists.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: {
          message: 'Validation failed. Please verify required fields.',
          fields: errors,
        },
      });
    }

    if (name.trim() !== category.name) {
      category.slug = await generateUniqueCategorySlug(name, category._id);
    }

    category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image.trim();

    await category.save();

    const catObj = category.toJSON();
    catObj.productCount = await Product.countDocuments({ category: category._id });

    return res.json({
      category: catObj,
      message: 'Category updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/categories/:id
 * Blocks deletion if the category still has products; deletes only if product count is 0.
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid category ID format.' } });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: { message: 'Category not found.' } });
    }

    // Guard: check if products are assigned to this category
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        error: {
          message: `Reassign or delete the ${productCount} products in this category first.`,
        },
      });
    }

    await Category.findByIdAndDelete(id);

    return res.json({
      message: `Category '${category.name}' was successfully deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/categories/:id/image
 * Handles image upload for category and persists image URL.
 */
export const uploadCategoryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid category ID format.' } });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: { message: 'Category not found.' } });
    }

    if (!req.file) {
      return res.status(400).json({
        error: { message: 'No image file uploaded. Please attach a valid image.' },
      });
    }

    const imageUrl = await processImageUpload(req.file);
    category.image = imageUrl;
    await category.save();

    const catObj = category.toJSON();
    catObj.productCount = await Product.countDocuments({ category: category._id });

    return res.status(201).json({
      message: 'Category image uploaded successfully.',
      imageUrl,
      category: catObj,
    });
  } catch (error) {
    next(error);
  }
};
