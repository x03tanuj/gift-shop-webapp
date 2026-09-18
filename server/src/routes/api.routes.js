import { Router } from 'express';
import healthRoutes from './health.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import settingsRoutes from './settings.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Mount health check
router.use('/', healthRoutes);

// Mount resource routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/settings', settingsRoutes);

export default router;
