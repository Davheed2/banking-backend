import mongoose, { Document } from 'mongoose';
import { TransactionStatus, TransactionType } from '../types';

export interface ITransaction extends Document {
	senderId: mongoose.Schema.Types.ObjectId | null;
	receiverId: mongoose.Schema.Types.ObjectId | null;
	amount: number;
	accountNumber: string;
	transactionType: TransactionType;
	status: TransactionStatus;
	transactionReference: string;
}
