import { AppError, AppResponse, parseTokenDuration, sendLoginEmail, sendVerificationEmail } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { userRepository } from '@/repository/userRepository';
import { Request, Response } from 'express';
import { generateAuthToken, generateRefreshToken, setTokenCookie } from '@/common/utils';
import { ENVIRONMENT } from '@/common/config';
import geoip from 'geoip-lite';

class AuthController {
	signUp = catchAsync(async (req: Request, res: Response) => {
		const { firstName, lastName, email, password, country, accountType, phoneNumber } = req.body;

		if (!email || !password || !country || !accountType || !phoneNumber || !firstName || !lastName) {
			throw new AppError('Incomplete signup data', 400);
		}

		const existingUser = await userRepository.findByEmailOrPhoneNumber(email, phoneNumber);
		if (existingUser) {
			if (existingUser.email === email) {
				throw new AppError('User with this email already exists', 409);
			} else if (existingUser.phoneNumber === phoneNumber) {
				throw new AppError('User with this phoneNumber already exists', 409);
			}
		}

		const user = await userRepository.create({
			firstName,
			lastName,
			email,
			password,
			country,
			accountType,
			phoneNumber,
			ipAddress: req.ip,
		});

		const authToken = generateAuthToken(user._id);
		const refreshToken = generateRefreshToken(user._id);

		setTokenCookie(req, res, 'authToken', authToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS)); // 15 minutes
		setTokenCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

		await sendVerificationEmail(email, req);

		return AppResponse(res, 201, user, 'Account created successfully');
	});

	signIn = catchAsync(async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new AppError('Incomplete signin data', 400);
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new AppError('User with this email does not exist', 404);
		}

		if (!user.isEmailVerified) {
			throw new AppError('User email not verified', 403);
		}

		if (user.isSuspended) {
			throw new AppError('User is suspended', 403);
		}

		if (!(await user.verifyPassword(password))) {
			throw new AppError('Incorrect password', 401);
		}

		const authToken = generateAuthToken(user._id);
		const refreshToken = generateRefreshToken(user._id);

		setTokenCookie(req, res, 'authToken', authToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS)); // 15 minutes
		setTokenCookie(req, res, 'refreshToken', refreshToken, parseTokenDuration(ENVIRONMENT.JWT_EXPIRES_IN.REFRESH));

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

		await sendLoginEmail(user.email, user.firstName, formattedDate);
		return AppResponse(res, 200, user, 'Sign in successful');
	});

	verifyAccount = catchAsync(async (req: Request, res: Response) => {
		const { token } = req.query;

		if (!token) {
			throw new AppError('Invalid verification token', 400);
		}

		const user = await userRepository.findByVerificationToken(token as string);
		if (!user) {
			throw new AppError('Invalid verification token', 400);
		}

		user.emailVerificationToken = '';
		user.isEmailVerified = true;
		await user.save();

		return AppResponse(res, 200, user, 'Account verified successfully');
	});

	verifyPhone = catchAsync(async (req: Request, res: Response) => {
		const { phoneNumber } = req.body;

		if (!phoneNumber) {
			throw new AppError('Phone number is missing', 400);
		}

		return AppResponse(res, 200, null, 'Phone number is valid');
	});
}

export const authController = new AuthController();
