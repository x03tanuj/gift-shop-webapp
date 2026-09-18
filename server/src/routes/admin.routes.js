import { Router } from 'express';
import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getDashboardStats,
} from '../controllers/admin.product.controller.js';
import {
  getAdminCategories,
  getAdminCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} from '../controllers/admin.category.controller.js';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { upload } from '../utils/upload.js';

const router = Router();

// All admin routes require authenticated session with OWNER or ADMIN role
router.use(authenticate, authorize('OWNER', 'ADMIN'));

// Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);

// Product CRUD
router.get('/products', getAdminProducts);
router.get('/products/:id', getAdminProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/images', upload.single('image'), uploadProductImage);

// Category CRUD
router.get('/categories', getAdminCategories);
router.get('/categories/:id', getAdminCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/categories/:id/image', upload.single('image'), uploadCategoryImage);

// Store Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
