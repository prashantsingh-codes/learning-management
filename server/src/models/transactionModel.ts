import { Schema, model } from "dynamoose";
import { Item } from "dynamoose/dist/Item";

export class TransactionClass extends Item {
  userId!: string;
  transactionId!: string;
  dateTime!: string;
  courseId!: string;
  paymentProvider!: "stripe";
  amount?: number;
}

const transactionSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true,
      required: true,
    },
    transactionId: {
      type: String,
      rangeKey: true,
      required: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: {
        name: "CourseTransactionsIndex",
        type: "global",
      },
    },
    paymentProvider: {
      type: String,
      enum: ["stripe"],
      required: true,
    },
    amount: Number,
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

const Transaction = model<TransactionClass>("Transaction", transactionSchema);
export default Transaction;
