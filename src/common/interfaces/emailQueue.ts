export interface CommonDataFields {
	to: string;
	priority: string;
}

export interface WelcomeEmailData extends CommonDataFields {
	verificationLink: string;
}

export interface LoginEmailData extends CommonDataFields {
	name: string;
	time: string;
}

export interface CreditAlertEmailData extends CommonDataFields {
	name: string;
	date: string;
	amount: number;
	description: string;
	currency: string;
	accountNumber: string;
	transactionReference: string;
	transactionType: string;
	balance: number;
}

export interface DebitAlertEmailData extends CommonDataFields {
	name: string;
	date: string;
	amount: number;
	description: string;
	currency: string;
	accountNumber: string;
	transactionReference: string;
	transactionType: string;
	balance: number;
}

export interface TransferEmailData extends CommonDataFields {
	name: string;
	otp: string;
	amount: number;
	currency: string;
	accountNumber: string;
}

export interface CompromisedEmailData extends CommonDataFields {
	name: string;
	wallet: string;
}

export interface ResetPasswordData extends CommonDataFields {
	token: string;
	name: string;
}

export interface PasswordResetSuccessfulData extends CommonDataFields {
	name: string; // Example field for when the password reset is successful
}

export type EmailJobData =
	| { type: 'welcomeEmail'; data: WelcomeEmailData }
	| { type: 'loginEmail'; data: LoginEmailData }
	| { type: 'creditEmail'; data: CreditAlertEmailData }
	| { type: 'debitEmail'; data: DebitAlertEmailData }
	| { type: 'transferEmail'; data: TransferEmailData }
	| { type: 'compromisedEmail'; data: CompromisedEmailData }
	| { type: 'resetPassword'; data: ResetPasswordData }
	| { type: 'passwordResetSuccessful'; data: PasswordResetSuccessfulData };
