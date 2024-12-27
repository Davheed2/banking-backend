import jwt from 'jsonwebtoken';
//import { DateTime } from 'luxon';
import { Require_id } from 'mongoose';
import { ENVIRONMENT } from '../config';
import { IUser } from '../interfaces';
import AppError from './appError';
import { UserModel } from '@/models';

type AuthenticateResult = {
	currentUser: Require_id<IUser>;
	accessToken?: string;
};

export const authenticate = async ({
	accessToken,
	refreshToken,
}: {
	accessToken?: string;
	refreshToken?: string;
}): Promise<AuthenticateResult> => {
	if (!refreshToken) {
		throw new AppError('Unauthorized', 401);
	}

	const handleUserVerification = async (decoded: jwt.JwtPayload): Promise<Require_id<IUser>> => {
		const user = (await UserModel.findOne({ _id: decoded._id }).select('isSuspended isDeleted')) as Require_id<IUser>;

		if (!user) {
			throw new AppError('User not found', 404);
		}

		if (user.isSuspended) {
			throw new AppError('Your account is currently suspended', 401);
		}

		if (user.isDeleted) {
			throw new AppError('Your account has been deleted', 404);
		}

		return user;
	};

	const handleTokenRefresh = async (): Promise<AuthenticateResult> => {
		try {
			const decodedRefreshToken = jwt.verify(refreshToken, ENVIRONMENT.JWT.REFRESH_KEY) as jwt.JwtPayload;
			const currentUser = await handleUserVerification(decodedRefreshToken);

			const accessToken = jwt.sign({ _id: currentUser._id.toString() }, ENVIRONMENT.JWT.ACCESS_KEY, {
				expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.ACCESS,
			});

			return { currentUser, accessToken };
		} catch (error) {
			throw new AppError('Session expired. Please log in again', 401);
		}
	};

	try {
		if (!accessToken) {
			return await handleTokenRefresh();
		} else {
			const decodedAccessToken = jwt.verify(accessToken, ENVIRONMENT.JWT.ACCESS_KEY) as jwt.JwtPayload;

			const currentUser = await handleUserVerification(decodedAccessToken);

			return { currentUser };
		}
	} catch (error) {
		if ((error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) && refreshToken) {
			return await handleTokenRefresh();
		} else {
			throw new AppError('An error occurred. Please log in again', 401);
		}
	}
};
