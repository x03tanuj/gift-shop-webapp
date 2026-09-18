import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { processImageUpload } from '../utils/upload.js';

/**
 * Slugifies a title string and ensures uniqueness.
 */
async function generateUniqueSlug(name, excludeId = null) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let slug = baseSlug || `product-${Date.now()}`;
  let count = 0;

  while (true) {
    const candidate = count === 0 ? slug : `${slug}-${count}`;
    const query = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Product.findOne(query);
    if (!existing) {
      return candidate;
    }
    count += 1;
  }
}

/**
 * GET /api/admin/products
 * Returns all products for administrative listing.
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    return res.json({ products });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/products/:id
 * Fetches single product for administrative editing.
 */
export const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid product ID format.' } });
    }

    const product = await Product.findById(id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    return res.json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/products
 * Creates a new product with input validation and auto-slug generation.
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      category,
      description,
      details,
      available,
      featured,
      badge,
      personalizable,
      personalizationNote,
      images,
    } = req.body;

    // 1. Validation
    const errors = {};
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.name = 'Product name is required.';
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      errors.price = 'A valid positive price is required.';
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      errors.category = 'A valid category must be selected.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: {
          message: 'Validation failed. Please verify required fields.',
          fields: errors,
        },
      });
    }

    // Check category existence
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        error: { message: 'Selected category does not exist.' },
      });
    }

    // 2. Slug generation
    const slug = await generateUniqueSlug(name);

    // 3. Normalized images (Maximum 3 images per product)
    const imageList = Array.isArray(images)
      ? images
          .filter((url) => typeof url === 'string' && url.trim().length > 0)
          .slice(0, 3)
      : [];
    const primaryImage = imageList[0] || '';

    // 4. Create document
    const product = await Product.create({
      name: name.trim(),
      slug,
      price: parsedPrice,
      category,
      images: imageList,
      image: primaryImage,
      description: description ? description.trim() : '',
      details: details && typeof details === 'object' ? details : {},
      available: available !== undefined ? available : true,
      featured: Boolean(featured),
      badge: badge ? badge.trim() : null,
      personalizable: Boolean(personalizable),
      personalizationNote: personalizable && personalizationNote ? personalizationNote.trim() : null,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'category',
      'name slug'
    );

    return res.status(201).json({
      product: populatedProduct,
      message: 'Product created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/products/:id
 * Updates an existing product with validation.
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid product ID format.' } });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    const {
      name,
      price,
      category,
      description,
      details,
      available,
      featured,
      badge,
      personalizable,
      personalizationNote,
      images,
    } = req.body;

    // Validation
    const errors = {};
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.name = 'Product name is required.';
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      errors.price = 'A valid positive price is required.';
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      errors.category = 'A valid category must be selected.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: {
          message: 'Validation failed. Please verify required fields.',
          fields: errors,
        },
      });
    }

    // Update slug if name changed
    if (name.trim() !== product.name) {
      product.slug = await generateUniqueSlug(name, product._id);
    }

    product.name = name.trim();
    product.price = parsedPrice;
    product.category = category;

    if (description !== undefined) product.description = description.trim();
    if (details !== undefined) product.details = details;
    if (available !== undefined) product.available = available;
    if (featured !== undefined) product.featured = Boolean(featured);
    if (badge !== undefined) product.badge = badge ? badge.trim() : null;

    product.personalizable = Boolean(personalizable);
    product.personalizationNote =
      product.personalizable && personalizationNote ? personalizationNote.trim() : null;

    if (Array.isArray(images)) {
      product.images = images
        .filter((u) => typeof u === 'string' && u.trim().length > 0)
        .slice(0, 3);
      product.image = product.images[0] || '';
    }

    await product.save();

    const updated = await Product.findById(product._id).populate(
      'category',
      'name slug'
    );

    return res.json({
      product: updated,
      message: 'Product updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/products/:id
 * Removes a product from the database.
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid product ID format.' } });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    return res.json({
      message: `Product '${product.name}' was successfully deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/products/:id/images
 * Uploads one or multiple images (up to max 3 total per product) and stores URLs on product.
 */
export const uploadProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid product ID format.' } });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found.' } });
    }

    const files =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files
        : req.file
        ? [req.file]
        : [];

    if (files.length === 0) {
      return res.status(400).json({
        error: { message: 'No image files uploaded. Please attach valid images.' },
      });
    }

    if (!product.images) product.images = [];

    // Check maximum 3 images limit
    const availableSlots = Math.max(0, 3 - product.images.length);
    if (availableSlots === 0) {
      return res.status(400).json({
        error: { message: 'This product already has the maximum of 3 photos allowed.' },
      });
    }

    const filesToUpload = files.slice(0, availableSlots);
    const newImageUrls = [];

    for (const f of filesToUpload) {
      const imageUrl = await processImageUpload(f);
      product.images.push(imageUrl);
      newImageUrls.push(imageUrl);
    }

    if (!product.image && product.images.length > 0) {
      product.image = product.images[0];
    }

    await product.save();

    return res.status(201).json({
      message: `${filesToUpload.length} photo(s) uploaded successfully.`,
      imageUrl: newImageUrls[0],
      newImages: newImageUrls,
      images: product.images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/dashboard/stats
 * Aggregates live product, category, and catalog statistics.
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalProducts, availableProducts, categoriesCount, featuredCount] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({
          available: { $in: [true, 'In Stock', 'Made to Order'] },
        }),
        Category.countDocuments(),
        Product.countDocuments({ featured: true }),
      ]);

    return res.json({
      stats: {
        totalProducts,
        availableProducts,
        categoriesCount,
        featuredCount,
        // Customer enquiry tracking is scheduled for Phase 10; stubbed as 0
        enquiriesCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
