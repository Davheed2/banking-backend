import type { IUser, UserMethods } from '@/common/interfaces';
import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { generateAccountNumber, generateRandomString, hashPassword } from '@/common/utils';
import { AccountType, Role } from '@/common/constants';

type UserModel = Model<IUser, unknown, UserMethods>;

const userSchema = new mongoose.Schema<IUser, unknown, UserMethods>(
	{
		firstName: {
			type: String,
			min: [2, 'First name must be at least 2 characters long'],
			max: [50, 'First name must not be more than 50 characters long'],
			required: [true, 'First name is required'],
		},
		lastName: {
			type: String,
			min: [2, 'Last name must be at least 2 characters long'],
			max: [50, 'Last name must not be more than 50 characters long'],
			required: [true, 'Last name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email field is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			unique: true,
			min: [7, 'Phone number must be at least 7 characters long'],
			required: [true, 'Phone number is required'],
			select: false,
		},
		password: {
			type: String,
			min: [8, 'Password must be at least 8 characters long'],
			required: [true, 'Password field is required'],
			select: false,
		},
		role: {
			type: String,
			enum: Object.values(Role),
			default: Role.User,
			select: false,
		},
		accountNumber: {
			type: String,
			unique: true,
			select: false,
		},
		accountBalance: {
			type: Number,
			default: 0,
			select: false,
		},
		accountType: {
			type: String,
			enum: Object.values(AccountType),
			select: false,
		},
		bankName: {
			type: String,
			select: false,
			default: 'Wise Bank',
		},
		country: {
			type: String,
			select: false,
		},
		emailVerificationToken: {
			type: String,
			select: false,
		},
		transferToken: {
			type: String,
			select: false,
		},
		ipAddress: {
			type: String,
			select: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			select: false,
		},
		isSuspended: {
			type: Boolean,
			default: false,
			select: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * hash password before saving to the database only if the password is modified
 */
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await hashPassword(this.password as string);
	}

	if (!this.accountNumber) {
		this.accountNumber = await generateAccountNumber();
	}

	if (!this.isEmailVerified) {
		this.emailVerificationToken = generateRandomString();
	}

	next();
});
// userSchema.pre(/^find/, function (this: Model<IUser>, next) {
// 	this.find({ isDeleted: { $ne: true }, isSuspended: { $ne: true } });
// 	next();
// });

/**
 * Verify user password method
 * @param {HydratedDocument<IUser>} this - The hydrated document.
 * @param {string} enteredPassword - The entered password.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the password is valid.
 */
userSchema.method('verifyPassword', async function (this: HydratedDocument<IUser>, enteredPassword: string) {
	if (!this.password) {
		return false;
	}

	return await bcrypt.compare(enteredPassword, this.password);
});

userSchema.method('toJSON', function (this: HydratedDocument<IUser>) {
	const userObject = this.toObject() as Partial<IUser>;
	delete userObject.password;
	return userObject;
});


export const UserModel = mongoose.model<IUser, UserModel>('User', userSchema);