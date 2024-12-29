import { IUser, UserMethods } from '@/common/interfaces';
import {
	generateRandom6DigitKey,
	generateUniqueTransactionReference,
	sendCreditAlertEmail,
	sendDebitAlertEmail,
} from '@/common/utils';
import { UserModel } from '@/models';
import { TransactionModel } from '@/models/transactionModel';
import { HydratedDocument } from 'mongoose';
import { beneficiaryRepository } from './beneficiaryRepository';
import { BeneficiaryModel } from '@/models/beneficiaryModel';

class UserRepository {
	create = async (payload: Partial<IUser>) => {
		return await UserModel.create(payload);
	};

	findById = async (id: string): Promise<IUser | null> => {
		return await UserModel.findById(id)
			.select('+isSuspended isDeleted accountNumber accountBalance phoneNumber firstName email role')
			.exec();
	};

	findByUsername = async (username: string) => {
		return await UserModel.findOne({ username });
	};

	findByEmail = async (email: string): Promise<HydratedDocument<IUser, UserMethods> | null> => {
		return await UserModel.findOne({ email, isDeleted: false })
			.select('+password isSuspended isEmailVerified accountNumber accountBalance email phoneNumber')
			.exec();
	};

	findByEmailOrPhoneNumber = async (
		email: string,
		PhoneNumber: string
	): Promise<HydratedDocument<IUser, UserMethods> | null> => {
		return await UserModel.findOne({
			$or: [{ email: email }, { phoneNumber: PhoneNumber }],
		})
			.select('+phoneNumber')
			.exec();
	};

	findByVerificationToken = async (token: string): Promise<HydratedDocument<IUser, UserMethods> | null> => {
		return await UserModel.findOne({ emailVerificationToken: token, isDeleted: false });
	};

	update = async (id: string, payload: Partial<IUser>): Promise<Partial<IUser> | null> => {
		return await UserModel.findByIdAndUpdate(id, payload, { new: true });
	};

	delete = async (id: string) => {
		return await UserModel.findByIdAndDelete(id);
	};

	getBalance = async (id: string): Promise<IUser | null> => {
		const user = await UserModel.findById(id).select('+accountBalance').exec();
		return user;
	};

	getUsers = async (page: number, limit: number): Promise<Partial<IUser>[]> => {
		const skip = (page - 1) * limit;
		return await UserModel.find({ isDeleted: false })
			.select('-password')
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 })
			.exec();
	};

	countTotalUsers = async () => {
		return await UserModel.countDocuments({ isDeleted: false });
	};

	findByAccountNumber = async (accountNumber: string): Promise<IUser | null> => {
		return await UserModel.findOne({ accountNumber })
			.select('+isSuspended isDeleted accountNumber accountBalance username email')
			.exec();
	};

	adminFundAccount = async (admin: IUser, accountNumber: string, amount: number): Promise<IUser | null> => {
		const user = await UserModel.findOneAndUpdate(
			{ accountNumber },
			{ $inc: { accountBalance: +amount } },
			{ new: true }
		);

		if (user) {
			await TransactionModel.create({
				senderId: admin._id,
				receiverId: user._id,
				amount,
				accountNumber,
				transactionType: 'deposit',
				status: 'successful',
				transactionReference: generateUniqueTransactionReference(),
			});
		}

		return user;
	};

	transferFunds = async (
		sender: string,
		accountNumber: string,
		amount: number,
		isBeneficiary: boolean,
		formattedDate: string
	): Promise<IUser | null> => {
		const beneficiary = await UserModel.findOneAndUpdate(
			{ accountNumber },
			{ $inc: { accountBalance: +amount } },
			{ new: true }
		).select('+accountNumber firstName lastName email accountBalance');
		const senderB = await UserModel.findOneAndUpdate(
			{ _id: sender },
			{ $inc: { accountBalance: -amount } },
			{ new: true }
		).select('+accountBalance email firstName');

		if (!senderB) {
			throw new Error('Sender not found');
		}
		if (!beneficiary) {
			throw new Error('Beneficiary not found');
		}

		const reference = generateUniqueTransactionReference();
		const reference2 = generateUniqueTransactionReference();

		if (senderB) {
			await TransactionModel.create({
				senderId: sender,
				receiverId: beneficiary._id,
				amount,
				accountNumber,
				transactionType: 'transfer',
				status: 'successful',
				transactionReference: reference,
			});
		}
		if (beneficiary) {
			await TransactionModel.create({
				senderId: sender,
				receiverId: beneficiary._id,
				amount,
				accountNumber,
				transactionType: 'deposit',
				status: 'successful',
				transactionReference: reference2,
			});

			if (isBeneficiary) {
				const existingBeneficiary = await beneficiaryRepository.findBeneficiaryByAccountNumber(
					sender,
					beneficiary.accountNumber
				);

				if (!existingBeneficiary) {
					await BeneficiaryModel.create({
						userId: sender,
						accountNumber: beneficiary.accountNumber,
						accountName: `${beneficiary.firstName} ${beneficiary.lastName}`,
						bankName: 'Wise Bank',
					});
				}
			}
		}

		await sendDebitAlertEmail(
			senderB.email,
			senderB.firstName,
			formattedDate,
			amount,
			'Transfer',
			'USD',
			accountNumber,
			reference,
			'debit',
			senderB.accountBalance
		);
		await sendCreditAlertEmail(
			beneficiary.email,
			beneficiary.firstName,
			formattedDate,
			amount,
			//'Transfer',
			'USD',
			//accountNumber,
			reference2,
			'credit',
			beneficiary.accountBalance
		);

		return senderB;
	};

	generateTransferToken = async (id: string): Promise<IUser | null> => {
		const token = generateRandom6DigitKey();
		return await UserModel.findByIdAndUpdate(id, { transferToken: token }, { new: true }).select('+transferToken');
	};

	findUserTransferToken = async (_id: string): Promise<HydratedDocument<IUser, UserMethods> | null> => {
		return await UserModel.findById({ _id }).select('+transferToken').exec();
	};
}

export const userRepository = new UserRepository();
