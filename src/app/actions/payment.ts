"use server";
const Razorpay = require("razorpay");
import { PaymentSchema } from "@/app/schemas";
import { z } from "zod";
import { Createoptions } from "@/utils/order-create";
import { validateOrder } from "@/utils/order-validate";
type PaymentOrderState = z.infer<typeof PaymentSchema>;

type RazorOrder = {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: undefined;
  created_at: number; // shd be date and time
};
// creating order
export const PaymentHandler = async (values: PaymentOrderState) => {
  // validating input
  const result = PaymentSchema.safeParse(values);

  if (!result.success) return null;
  console.log(result.data);

  const { uid, amount } = result.data;

  // creating order

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  //currency and amount are reuired fields
  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_${Date.now()}`, // generate a unique receipt number
  };
  const order = await razorpay.orders.create(options); // order created here

  // basic check
  if (!order) {
    return { message: "Payment Order not created" };
  }
  // destructing req info from razor pay order
  const { id: RazorOrderId, amount: RazorOrderAmount }: RazorOrder = order;
  // got options from utility
  const key = process.env.RAZORPAY_KEY_ID;

  const PaymentOptions = await Createoptions(
    RazorOrderAmount,
    RazorOrderId,
    uid
  );

  return {
    message: "order created  and returning options",
    options: PaymentOptions,
  };

  //payment window

  return { message: `Success ` };
};
