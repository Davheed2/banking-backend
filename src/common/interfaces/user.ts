import { Role, AccountType } from '../constants';

export interface IUser {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	password: string;
	ipAddress: string;
	role: Role;
	accountNumber: string;
	accountBalance: number;
	bankName: string;
	accountType: AccountType;
	transferToken: string;
	country: string;
	isEmailVerified: boolean;
	emailVerificationToken: string;
	isDeleted: boolean;
	isSuspended: boolean;
}

export interface UserMethods {
	verifyPassword(enteredPassword: string): Promise<boolean>;
}
