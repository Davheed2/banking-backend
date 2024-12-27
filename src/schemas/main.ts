import { z } from 'zod';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { AccountType } from '@/common/constants';

const verifyPhoneNumber = (phoneNumber: string) => {
	const phoneUtil = PhoneNumberUtil.getInstance();
	const phoneNumberInstance = phoneUtil.parse(phoneNumber);
	const isValid = phoneUtil.isValidNumber(phoneNumberInstance);
	return isValid;
};

//verifyPhoneNumber('+2348134567890'); // true

export const baseSchema = z.object({
	username: z.string().trim(),
	firstName: z.string().trim(),
	lastName: z.string().trim(),
	email: z.string().trim().email(),
	password: z.string().trim(),
	phoneNumber: z.string().trim(),
	accountNumber: z.string().trim(),
	country: z.string().trim(),
	accountType: z.enum([AccountType.Business, AccountType.Personal]),
	isBeneficiary: z.boolean(),
	bankName: z.string().trim(),
	transferToken: z.string().trim(),
});

export const mainSchema = z.object({
	username: z
		.string()
		.trim()
		.min(3, 'Username must be at least 3 characters long')
		.max(20, 'Username must be at most 20 characters long')
		.refine((name) => /^[a-zA-Z0-9]+$/.test(name), {
			message: 'Username must contain only letters and numbers',
		}),
	firstName: z
		.string()
		.trim()
		.min(2, 'First name must be at least 2 characters long')
		.max(50, 'First name must not be 50 characters long')
		.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
			message:
				'Firstname must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
		}),
	lastName: z
		.string()
		.trim()
		.min(2, 'Last name must be at least 2 characters long')
		.max(50, 'Last name must not be 50 characters long')
		.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
			message:
				'Lastname must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
		}),
	email: z.string().trim().email('Please enter a valid email address!'),
	password: z
		.string()
		.trim()
		.min(8, 'Password must have at least 8 characters!')
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
			message: `Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character`,
		}),
	phoneNumber: z.string().refine((value) => verifyPhoneNumber(value), {
		message: 'Invalid phone number.',
	}),
	accountNumber: z.string().min(5, 'Account number must be at least 5 characters long').trim(),
	amount: z.coerce.number().min(1, 'Amount must be at least 1'),
	country: z.string().trim(),
	accountType: z.enum([AccountType.Business, AccountType.Personal]),
	isBeneficiary: z.boolean(),
	transferToken: z.string().trim(),
});
