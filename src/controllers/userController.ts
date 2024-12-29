import { AppError, AppResponse, sendTransferConfirmationEmail } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { beneficiaryRepository } from '@/repository/beneficiaryRepository';
import { transactionRepository } from '@/repository/transactionRepository';
import { userRepository } from '@/repository/userRepository';
import { Request, Response } from 'express';
import geoip from 'geoip-lite';

class UserController {
	getProfile = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const currentUser = await userRepository.findById(user._id);

		return AppResponse(res, 200, currentUser, 'User profile retrieved successfully');
	});

	getBalance = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const balance = await userRepository.getBalance(user._id);
		return AppResponse(res, 200, balance, 'User balance retrieved successfully');
	});

	getUserTransactions = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { page, limit } = req.query;
		const currentPage = parseInt(page as string) || 1;
		const pageSize = parseInt(limit as string) || 10;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const transactions = await transactionRepository.getUserTransactions(user._id, currentPage, pageSize);
		const totalTransactions = await transactionRepository.countTotalUserTransactions(user._id);

		return AppResponse(
			res,
			200,
			{
				transactions,
				currentPage: currentPage,
				totalPages: Math.ceil(totalTransactions / pageSize),
				totalTransactions,
			},
			'User transactions retrieved successfully'
		);
	});

	getUserBeneficiaries = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { page, limit } = req.query;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const currentPage = parseInt(page as string) || 1;
		const pageSize = parseInt(limit as string) || 10;

		const beneficiaries = await beneficiaryRepository.getAllUserBeneficiaries(user._id, currentPage, pageSize);
		const totalBeneficiaries = await beneficiaryRepository.countTotalUserBeneficiaries(user._id);

		return AppResponse(
			res,
			200,
			{
				beneficiaries,
				currentPage: currentPage,
				totalPages: Math.ceil(totalBeneficiaries / pageSize),
				totalBeneficiaries,
			},
			'User beneficiaries retrieved successfully'
		);
	});

	transferFunds = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { amount, accountNumber, isBeneficiary, transferToken } = req.body;

		if (!user) {
			throw new AppError('User not found', 404);
		}
		if (!amount || !accountNumber) {
			throw new AppError('Amount and account number are required', 400);
		}

		const userToken = await userRepository.findUserTransferToken(user._id);

		if (!userToken || userToken.transferToken !== transferToken) {
			throw new AppError('Invalid transfer token', 400);
		}

		userToken.transferToken = '';
		await userToken.save();

		const users = await Promise.all([
			userRepository.findById(user._id),
			userRepository.findByAccountNumber(accountNumber),
			userRepository.getBalance(user._id),
		]);

		const [sender, beneficiary, senderBalance] = users;

		if (!sender) {
			throw new AppError('User not found', 404);
		}
		if (!beneficiary) {
			throw new AppError('Beneficiary not found', 404);
		}
		if (beneficiary.isSuspended) {
			throw new AppError('User account is suspended! Withhold funds', 400);
		}

		if (!senderBalance) {
			throw new AppError('Your account balance is required', 404);
		}

		if (sender.accountNumber === beneficiary.accountNumber) {
			throw new AppError('You cannot transfer funds to yourself', 400);
		}
		if (senderBalance.accountBalance < amount) {
			throw new AppError('Insufficient funds', 400);
		}

		const ip = req.ip || req.socket.remoteAddress || '';
		const geo = geoip.lookup(ip);
		const userRegion = geo ? geo.country : 'US';
		const timeZone = geo ? geo.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
		const formattedDate = new Date().toLocaleString(`en-${userRegion}`, {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZone: timeZone,
		});

		const transaction = await userRepository.transferFunds(
			sender._id,
			accountNumber,
			amount,
			isBeneficiary,
			formattedDate
		);

		if (!transaction) {
			throw new AppError('Failed to transfer funds', 400);
		}

		return AppResponse(res, 200, { balance: transaction.accountBalance }, 'Funds transferred successfully');
	});

	assignTransferToken = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { amount, accountNumber } = req.body;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const token = await userRepository.generateTransferToken(user._id);

		if (!token) {
			throw new AppError('Failed to generate transfer token', 400);
		}

		const userMakingTransfer = await userRepository.findById(user._id);

		if (!userMakingTransfer) {
			throw new AppError('User not found', 404);
		}

		await sendTransferConfirmationEmail(
			userMakingTransfer.email,
			userMakingTransfer.firstName,
			token.transferToken,
			amount,
			accountNumber
		);

		return AppResponse(res, 200, null, 'Transfer token assigned successfully');
	});

	verifyTransferToken = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { transferToken } = req.body;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		if (!transferToken) {
			throw new AppError('Transfer token is required', 400);
		}

		const userToken = await userRepository.findUserTransferToken(user._id);

		if (!userToken) {
			throw new AppError('No transfer token found in your account, kindly try again.', 400);
		}

		if (userToken.transferToken !== transferToken || userToken.transferToken === '') {
			throw new AppError('Invalid transfer token', 400);
		}

		return AppResponse(res, 200, null, 'Transfer token verified successfully');
	});

	test = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const beneficiary = await beneficiaryRepository.findBeneficiaryByBankName(user._id, 'Wise');

		//console.log(beneficiary);

		return AppResponse(res, 200, beneficiary, 'Test successful');
	});
}

export const userController = new UserController();
