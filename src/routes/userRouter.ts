import { userController } from '@/controllers';
import { authMiddleware } from '@/middlewares/auth';
import express from 'express';

const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.get('/balance', authMiddleware, userController.getBalance);
router.get('/transactions', authMiddleware, userController.getUserTransactions);
router.post('/transfer', authMiddleware, userController.transferFunds);
router.get('/beneficiaries', authMiddleware, userController.getUserBeneficiaries);
router.post('/assign-transfer-token', authMiddleware, userController.assignTransferToken);
router.post('/verify-transfer-token', authMiddleware, userController.verifyTransferToken);
router.get("/test", authMiddleware, userController.test);

export { router as userRouter };
