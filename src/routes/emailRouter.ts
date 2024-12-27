import { emailController } from '@/controllers';
import express from 'express';

const router = express.Router();

router.post('/welcome-email', emailController.sendWelcomeEmail);
router.post('/login-email', emailController.sendLoginEmail);
router.post('/credit-email', emailController.sendCreditAlertEmail);
router.post('/debit-email', emailController.sendDebitAlertEmail);
router.post('/transfer-email', emailController.sendTransferConfirmationEmail);
router.post('/compromised-email', emailController.sendCompromisedEmail);

export { router as emailRouter };
