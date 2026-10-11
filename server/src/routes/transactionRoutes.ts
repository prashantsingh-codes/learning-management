import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createStripePaymentIntent,
  createTransaction,
  listTransactions,
} from "../controllers/transactionController";

const router = express.Router();

router.get("/", requireAuth(), listTransactions);
router.post("/", requireAuth(), createTransaction);
router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;
