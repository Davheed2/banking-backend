import { ITransaction } from '@/common/interfaces';
import { TransactionModel } from '@/models/transactionModel';

class TransactionRepository {
	create = async (payload: Partial<ITransaction>) => {
		return await TransactionModel.create(payload);
	};
	findById = async (id: string): Promise<ITransaction | null> => {
		return await TransactionModel.findById(id).exec();
	};

	findByTransactionReference = async (transactionReference: string): Promise<ITransaction | null> => {
		return await TransactionModel.findOne({ transactionReference }).exec();
	};

	update = async (id: string, payload: Partial<ITransaction>): Promise<Partial<ITransaction> | null> => {
		return await TransactionModel.findByIdAndUpdate(id, payload, { new: true }).populate('senderId receiverId').exec();
	};

	delete = async (id: string) => {
		return await TransactionModel.findByIdAndDelete(id);
	};

	getTransactions = async (page: number, limit: number): Promise<Partial<ITransaction>[]> => {
		const skip = (page - 1) * limit;
		return await TransactionModel.find().skip(skip).limit(limit).exec();
	};

	countTotalUserTransactions = async (userId: string): Promise<number> => {
		return await TransactionModel.countDocuments({ $or: [{ senderId: userId }, { receiverId: userId }] });
	}

	getUserTransactions = async (userId: string, page: number, limit: number): Promise<Partial<ITransaction>[]> => {
		const skip = (page - 1) * limit;
		return await TransactionModel.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
			.skip(skip)
			.limit(limit)
			.populate('senderId receiverId')
			.sort({ createdAt: -1 })
			.exec();
	};
}

export const transactionRepository = new TransactionRepository();
