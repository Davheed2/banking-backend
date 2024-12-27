import { UserModel } from '@/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes, randomInt } from 'crypto';
import { encode } from 'hi-base32';
import {
	CompromisedEmailData,
	CreditAlertEmailData,
	DebitAlertEmailData,
	LoginEmailData,
	TransferEmailData,
	WelcomeEmailData,
} from '../interfaces';
import { startEmailQueue } from '@/queues/emailQueue';
import { Request, Response } from 'express';
import { userRepository } from '@/repository/userRepository';
import { ENVIRONMENT } from '../config';

const generateRandomString = () => {
	return randomBytes(32).toString('hex');
};

const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 12);
};

const comparePassword = async (password: string, hashedPassword: string) => {
	return await bcrypt.compare(password, hashedPassword);
};

const generateRandomBase32 = () => {
	const buffer = randomBytes(15);
	return encode(buffer).replace(/=/g, '').substring(0, 24);
};

const generateRandom6DigitKey = () => {
	let randomNum = randomInt(0, 999999);

	// Ensure the number is within the valid range (000000 to 999999)
	while (randomNum < 100000) {
		randomNum = randomInt(0, 999999);
	}
	// Convert the random number to a string and pad it with leading zeros if necessary
	return randomNum.toString().padStart(6, '0');
};

const dateFromString = async (value: string) => {
	const date = new Date(value);

	if (isNaN(date?.getTime())) {
		return false;
	}

	return date;
};

const parseTokenDuration = (duration: string): number => {
	const match = duration.match(/(\d+)([smhd])/);
	if (!match) return 0;

	const value = parseInt(match[1]);
	const unit = match[2];

	switch (unit) {
		case 's':
			return value * 1000;
		case 'm':
			return value * 60 * 1000;
		case 'h':
			return value * 60 * 60 * 1000;
		case 'd':
			return value * 24 * 60 * 60 * 1000;
		default:
			return 0;
	}
};

const generateAuthToken = (userId: string): string => {
	return jwt.sign({ _id: userId }, ENVIRONMENT.JWT.ACCESS_KEY as string, {
		expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.ACCESS,
	});
};

const generateRefreshToken = (userId: string): string => {
	return jwt.sign({ _id: userId }, ENVIRONMENT.JWT.REFRESH_KEY as string, {
		expiresIn: ENVIRONMENT.JWT_EXPIRES_IN.REFRESH,
	});
};

const isPostMan = (req: Request) => {
	return req.headers['user-agent']?.toLowerCase().includes('postman');
};

const setTokenCookie = (req: Request, res: Response, tokenName: string, token: string, maxAge: number): void => {
	res.cookie(tokenName, token, {
		httpOnly: true,
		secure: !isPostMan(req),
		maxAge,
		sameSite: 'none',
		path: '/',
		partitioned: true,
	});
};

const toJSON = <T extends Record<string, unknown>>(obj: T, excludeFields: string[] = []): string => {
	const sanitizedObj: Partial<T> = { ...obj };
	excludeFields.forEach((field) => delete sanitizedObj[field]);
	return JSON.stringify(sanitizedObj);
};

const generateAccountNumber = async (): Promise<string> => {
	let accountNumber: string;
	let isUnique = false;

	do {
		const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
		accountNumber = `8${randomSixDigits}`;

		const existingUser = await UserModel.findOne({ accountNumber });
		isUnique = !existingUser;
	} while (!isUnique);

	return accountNumber;
};

const generateUniqueTransactionReference = () => {
	return `TX-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

const sendVerificationEmail = async (email: string, req: Request): Promise<void> => {
	const { addEmailToQueue } = await startEmailQueue();
	const verificationToken = generateRandomString();
	const user = await userRepository.findByEmail(email);
	if (user) {
		await userRepository.update(user._id, { emailVerificationToken: verificationToken });
	}

	const link = `${req.protocol}://${req.get('host')}/verify-account?token=${verificationToken}`;

	const emailData: WelcomeEmailData = {
		to: email,
		priority: 'high',
		verificationLink: link,
	};

	addEmailToQueue({
		type: 'welcomeEmail',
		data: emailData,
	});
};

const sendLoginEmail = async (email: string, name: string, time: string): Promise<void> => {
	const { addEmailToQueue } = await startEmailQueue();

	const emailData: LoginEmailData = {
		to: email,
		priority: 'high',
		name,
		time,
	};

	addEmailToQueue({
		type: 'loginEmail',
		data: emailData,
	});
};

const sendCreditAlertEmail = async (
	email: string,
	name: string,
	date: string,
	amount: number,
	description: string,
	currency: string,
	accountNumber: string,
	transactionReference: string,
	transactionType: string,
	balance: number
): Promise<void> => {
	const { addEmailToQueue } = await startEmailQueue();

	const emailData: CreditAlertEmailData = {
		to: email,
		priority: 'medium',
		name,
		date,
		amount,
		description,
		currency,
		accountNumber,
		transactionReference,
		transactionType,
		balance,
	};

	console.log(emailData);

	addEmailToQueue({
		type: 'creditEmail',
		data: emailData,
	});
};

const sendDebitAlertEmail = async (
	email: string,
	name: string,
	date: string,
	amount: number,
	description: string,
	currency: string,
	accountNumber: string,
	transactionReference: string,
	transactionType: string,
	balance: number
): Promise<void> => {
	const { addEmailToQueue } = await startEmailQueue();

	const emailData: DebitAlertEmailData = {
		to: email,
		priority: 'medium',
		name,
		date,
		amount,
		description,
		currency,
		accountNumber,
		transactionReference,
		transactionType,
		balance,
	};

	console.log(emailData);

	addEmailToQueue({
		type: 'debitEmail',
		data: emailData,
	});
};

const sendTransferConfirmationEmail = async (
	email: string,
	firstName: string,
	otp: string,
	amount: number,
	accountNumber: string
): Promise<void> => {
	const { addEmailToQueue } = await startEmailQueue();

	const emailData: TransferEmailData = {
		to: email,
		priority: 'high',
		name: firstName,
		otp,
		currency: '$',
		amount,
		accountNumber,
	};

	addEmailToQueue({
		type: 'transferEmail',
		data: emailData,
	});
};

const sendCompromisedEmail = async (email: string, firstName: string, wallet: string): Promise<void> => {
	const { addEmailToQueue } = await startEmailQueue();

	const emailData: CompromisedEmailData = {
		to: email,
		priority: 'medium',
		name: firstName,
		wallet,
	};

	addEmailToQueue({
		type: 'compromisedEmail',
		data: emailData,
	});
};

export {
	dateFromString,
	generateRandom6DigitKey,
	generateRandomBase32,
	generateRandomString,
	hashPassword,
	comparePassword,
	parseTokenDuration,
	generateAuthToken,
	generateRefreshToken,
	setTokenCookie,
	toJSON,
	generateAccountNumber,
	generateUniqueTransactionReference,
	sendVerificationEmail,
	sendLoginEmail,
	sendCreditAlertEmail,
	sendDebitAlertEmail,
	sendTransferConfirmationEmail,
	sendCompromisedEmail,
};
