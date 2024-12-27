import mongoose from "mongoose";
import { IBeneficiary } from "@/common/interfaces";

const beneficiarySchema = new mongoose.Schema<IBeneficiary>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BeneficiaryModel = mongoose.model<IBeneficiary>(
  "Beneficiary",
  beneficiarySchema
);

