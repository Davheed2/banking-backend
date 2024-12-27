import { authController } from '@/controllers';
import express from 'express';

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.get('/verify-account', authController.verifyAccount);
router.post('/verify-phone', authController.verifyPhone);

export { router as authRouter };
