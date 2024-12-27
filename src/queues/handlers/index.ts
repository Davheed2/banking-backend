import {
	CompromisedEmailData,
	CreditAlertEmailData,
	DebitAlertEmailData,
	EmailJobData,
	LoginEmailData,
	TransferEmailData,
	WelcomeEmailData,
} from '@/common/interfaces';
import { logger } from '@/common/utils';
import nodemailer from 'nodemailer';
import { ENVIRONMENT } from 'src/common/config';
import { creditEmail, debitEmail, loginEmail, welcomeEmail, transferEmail, compromisedEmail } from '@/queues/templates';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: ENVIRONMENT.EMAIL.GMAIL_USER,
		pass: ENVIRONMENT.EMAIL.GMAIL_PASSWORD,
	},
});

export const sendEmail = async (job: EmailJobData) => {
	const { data, type } = job as EmailJobData;

	let htmlContent: string;
	let subject: string;

	switch (type) {
		case 'welcomeEmail':
			htmlContent = welcomeEmail(data as WelcomeEmailData);
			subject = 'Please confirm your email address';
			break;
		case 'loginEmail':
			htmlContent = loginEmail(data as LoginEmailData);
			subject = 'Login Alert';
			break;
		case 'creditEmail':
			htmlContent = creditEmail(data as CreditAlertEmailData);
			subject = `BANK TRANSACTION ALERT[CREDIT:$${data.amount}]`;
			break;
		case 'debitEmail':
			htmlContent = debitEmail(data as DebitAlertEmailData);
			subject = `BANK TRANSACTION ALERT[DEBIT:$${data.amount}]`;
			break;
		case 'transferEmail':
			htmlContent = transferEmail(data as TransferEmailData);
			subject = 'Transfer Confirmation';
			break;
		case 'compromisedEmail':
			htmlContent = compromisedEmail(data as CompromisedEmailData);
			subject = 'Suspiscious activity detected';
			break;
		// Handle other email types...
		default:
			throw new Error(`No template found for email type: ${type}`);
	}

	const mailOptions = {
		from: `"Wise" <${ENVIRONMENT.EMAIL.GMAIL_USER}>`,
		to: data.to,
		subject: subject,
		html: htmlContent,
	};

	try {
		const dispatch = await transporter.sendMail(mailOptions);
		console.log(dispatch);
		logger.info(`Email successfully sent to ${data.to}`);
	} catch (error) {
		console.error(error);
		logger.error(`Failed to send email to ${data.to}: ${error}`);
	}
};
