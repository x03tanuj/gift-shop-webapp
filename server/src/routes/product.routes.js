import { Router } from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/:slug', getProductBySlug);

export default router;
