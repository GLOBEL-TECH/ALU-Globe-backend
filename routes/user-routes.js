import express from 'express';
import { authWithGoogle } from '../controllers/user-controller.js';

const router = express.Router();

router.post('/google-login', authWithGoogle);

export default router;
