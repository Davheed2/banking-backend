import {
	AppResponse,
	sendCreditAlertEmail,
	sendDebitAlertEmail,
	sendLoginEmail,
	sendVerificationEmail,
	sendTransferConfirmationEmail,
	AppError,
	sendCompromisedEmail,
} from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { Request, Response } from 'express';
import geoip from 'geoip-lite';

class EmailController {
	sendWelcomeEmail = catchAsync(async (req: Request, res: Response) => {
		const { email } = req.body;

		if (!email) throw new AppError('Incomplete Email Data', 400);

		await sendVerificationEmail(email, req);

		return AppResponse(res, 200, null, 'Email sent successfully');
	});

	sendLoginEmail = catchAsync(async (req: Request, res: Response) => {
		const { email, firstName } = req.body;
		//console.log(req.protocol, req.hostname);
		const ip = req.ip || req.socket.remoteAddress || '';
		// const geo = geoip.lookup("72.229.28.185");
		const geo = geoip.lookup(ip);

		const userRegion = geo ? geo.country : 'US';
		const timeZone = geo ? geo.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
		console.log(timeZone);

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

		console.log(firstName);
		await sendLoginEmail(email, firstName, formattedDate);
		console.log('Request time:', formattedDate);

		return AppResponse(res, 200, null, 'Email sent successfully');
	});

	sendCreditAlertEmail = catchAsync(async (req: Request, res: Response) => {
		const { email, firstName } = req.body;

		const ip = req.ip || req.socket.remoteAddress || '';
		// const geo = geoip.lookup("72.229.28.185");
		const geo = geoip.lookup(ip);

		const userRegion = geo ? geo.country : 'US';
		const timeZone = geo ? geo.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
		console.log(timeZone);

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

		await sendCreditAlertEmail(
			email,
			firstName,
			formattedDate,
			200,
			'USD',
			'TX-1626950730000-4JQJZQ',
			'credit',
			3581.21
		);
		return AppResponse(res, 200, null, 'Email sent successfully');
	});

	sendDebitAlertEmail = catchAsync(async (req: Request, res: Response) => {
		const { email, firstName } = req.body;
		const ip = req.ip || req.socket.remoteAddress || '';
		// const geo = geoip.lookup("72.229.28.185");
		const geo = geoip.lookup(ip);

		const userRegion = geo ? geo.country : 'US';
		const timeZone = geo ? geo.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
		console.log(timeZone);

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

		await sendDebitAlertEmail(
			email,
			firstName,
			formattedDate,
			200,
			'description test',
			'USD',
			'7488838848',
			'transactionReference',
			'debit',
			3000
		);
		return AppResponse(res, 200, null, 'Email sent successfully');
	});

	sendTransferConfirmationEmail = catchAsync(async (req: Request, res: Response) => {
		const { email, firstName, transferToken, amount, accountNumber } = req.body;

		if (!email || !firstName || !transferToken || !amount || !accountNumber) {
			throw new AppError('Incomplete Email Data', 400);
		}

		await sendTransferConfirmationEmail(email, firstName, transferToken, amount, accountNumber);
		return AppResponse(res, 200, null, 'Email sent successfully');
	});

	sendCompromisedEmail = catchAsync(async (req: Request, res: Response) => {
		const { email, firstName, wallet } = req.body;
		if (!email || !firstName || !wallet) {
			throw new AppError('Incomplete Email Data', 400);
		}

		await sendCompromisedEmail(email, firstName, wallet);
		return AppResponse(res, 200, null, 'Email sent successfully');
	});
}

export const emailController = new EmailController();
