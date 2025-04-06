import express from 'express';
import { authWithGoogle } from '../controllers/user-controller.js';
import { authenticateUser as authenticateUserMiddleware } from '../middleware/auth-middleware.js';

const router = express.Router();

router.post('/google-login', authWithGoogle);

router.use(authenticateUserMiddleware);

export default router;
