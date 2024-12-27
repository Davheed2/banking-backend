import { IBeneficiary } from '@/common/interfaces';
import { BeneficiaryModel } from '@/models/beneficiaryModel';

class BeneficiaryRepository {
	create = async (payload: Partial<IBeneficiary>) => {
		return await BeneficiaryModel.create(payload);
	};

	findByUserId = async (userId: string): Promise<IBeneficiary | null> => {
		return await BeneficiaryModel.findOne({ userId }).exec();
	};

	update = async (id: string, payload: Partial<IBeneficiary>): Promise<Partial<IBeneficiary> | null> => {
		return await BeneficiaryModel.findByIdAndUpdate(id, payload, { new: true }).exec();
	};

	delete = async (id: string) => {
		return await BeneficiaryModel.findByIdAndDelete(id).exec();
	};

	getAllUserBeneficiaries = async (userId: string, page: number, limit: number): Promise<IBeneficiary[]> => {
		const skip = (page - 1) * limit;
		return await BeneficiaryModel.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
	};

	findBeneficiaryByAccountNumber = async (userId: string, accountNumber: string): Promise<IBeneficiary | null> => {
		return await BeneficiaryModel.findOne({ userId, accountNumber }).exec();
	};

	findBeneficiaryByAccountName = async (userId: string, accountName: string): Promise<IBeneficiary[]> => {
		return await BeneficiaryModel.find({ userId, accountName: { $regex: accountName, $options: 'i' } }).exec();
	};

	findBeneficiaryByBankName = async (userId: string, bankName: string): Promise<IBeneficiary[]> => {
		return await BeneficiaryModel.find({ userId, bankName: { $regex: bankName, $options: 'i' } }).exec();
	};

	countTotalUserBeneficiaries = async (userId: string): Promise<number> => {
		return await BeneficiaryModel.countDocuments({ userId }).exec();
	};
}

export const beneficiaryRepository = new BeneficiaryRepository();
