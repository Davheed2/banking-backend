import { adminController } from '@/controllers';
import { authMiddleware } from '@/middlewares/auth';
import express from 'express';

const router = express.Router();

router.get('/users', authMiddleware, adminController.getPaginatedUsers);
router.patch('/suspend', authMiddleware, adminController.suspendAccount);
router.patch('/delete', authMiddleware, adminController.deleteAccount);
router.post('/fund', authMiddleware, adminController.fundAccount);
router.get('/health', adminController.appHealth);

export { router as adminRouter };
