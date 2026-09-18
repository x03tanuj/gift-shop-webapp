import { Router } from 'express';
import { login, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
