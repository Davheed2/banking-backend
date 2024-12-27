import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '@/common/interfaces';

const transactionSchema = new Schema<ITransaction>(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		accountNumber: {
			type: String,
			required: true,
		},
		transactionType: {
			type: String,
			enum: ['deposit', 'withdraw', 'transfer'],
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'successful', 'failed'],
			default: 'pending',
		},
		transactionReference: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);
