import { Role } from '@/common/constants';
import { AppError, AppResponse } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { userRepository } from '@/repository/userRepository';
import { Request, Response } from 'express';

class AdminController {
	getPaginatedUsers = catchAsync(async (req: Request, res: Response) => {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const { user } = req;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const currentUserRole = await userRepository.findById(user._id);
		if (!currentUserRole) {
			throw new AppError('User not found', 404);
		}

		if (currentUserRole.role !== Role.SuperUser) {
			throw new AppError('You are not authorized to perform this action', 403);
		}

		const users = await userRepository.getUsers(page, limit);
		const totalUsers = await userRepository.countTotalUsers();

		return AppResponse(
			res,
			200,
			{ users, currentPage: page, totalPages: Math.ceil(totalUsers / limit), totalUsers },
			'Users retrieved successfully'
		);
	});

	suspendAccount = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { userId } = req.query;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const users = await Promise.all([userRepository.findById(user._id), userRepository.findById(userId as string)]);

		console.log(users);

		const [currentUserRole, userToSuspend] = users;
		if (!currentUserRole) {
			throw new AppError('Admin User not found', 404);
		}
		if (!userToSuspend) {
			throw new AppError('User with the given Id not found', 404);
		}
		if (currentUserRole.role !== Role.SuperUser) {
			throw new AppError('You are not authorized to perform this action', 403);
		}
		if (userToSuspend.role === Role.SuperUser) {
			throw new AppError('You cannot suspend a super user', 403);
		}

		await userRepository.update(userId as string, {
			isSuspended: !userToSuspend.isSuspended,
		});

		return AppResponse(
			res,
			200,
			null,
			userToSuspend.isSuspended ? 'User account unsuspended successfully' : 'User account suspended successfully'
		);
	});

	deleteAccount = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { userId } = req.query;
		if (!user) {
			throw new AppError('User not found', 404);
		}

		const users = await Promise.all([userRepository.findById(user._id), userRepository.findById(userId as string)]);

		const [currentUserRole, userToDelete] = users;

		console.log(users);
		if (!currentUserRole) {
			throw new AppError('Admin User not found', 404);
		}
		if (!userToDelete) {
			throw new AppError('User with the given Id not found', 404);
		}
		if (currentUserRole.role !== Role.SuperUser) {
			throw new AppError('You are not authorized to perform this action', 403);
		}
		if (userToDelete.role === Role.SuperUser) {
			throw new AppError('You cannot delete a super user', 403);
		}

		await userRepository.update(userId as string, {
			isDeleted: !userToDelete.isDeleted,
		});

		return AppResponse(
			res,
			200,
			null,
			userToDelete.isDeleted ? 'User account restored successfully' : 'User account deleted successfully'
		);
	});

	fundAccount = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { accountNumber, amount } = req.body;

		if (!user) {
			throw new AppError('User not found', 404);
		}
		if (!accountNumber) {
			throw new AppError('Account number is required', 400);
		}

		const currentUserRole = await userRepository.findById(user._id);
		if (!currentUserRole) {
			throw new AppError('User not found', 404);
		}

		if (currentUserRole.role !== Role.SuperUser) {
			throw new AppError('You are not authorized to perform this action', 403);
		}

		if (amount <= 0) {
			throw new AppError('Please provide a valid amount', 400);
		}

		const userToFund = await userRepository.findByAccountNumber(accountNumber);
		if (!userToFund) {
			throw new AppError('Beneficiary not found', 404);
		}

		const newBalance = await userRepository.adminFundAccount(user, accountNumber, amount);
		if (!newBalance) {
			throw new AppError('Failed to fund account', 400);
		}

		const balance = await userRepository.getBalance(userToFund._id);

		return AppResponse(res, 200,  balance, 'User account funded successfully');
	});

	appHealth = catchAsync(async (req: Request, res: Response) => {
		//await handleEmailAppHealth();
		return AppResponse(res, 200, null, 'Server is healthy');
	})
}

export const adminController = new AdminController();
