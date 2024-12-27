import mongoose from "mongoose";

export interface IBeneficiary {
  userId: mongoose.Schema.Types.ObjectId;
  accountNumber: string;
  bankName: string;
  accountName: string;
}