"use server";
import crypto from "crypto";

export const validateOrder = async (body: any) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  // just come pre given functio to check te transaction is valid or not
  if (!process.env.RAZORPAY_KEY_SECRET) return { message: " internal error" }; //key message
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return { message: "Transaction is not legit!" };
  }

  return {
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  };
};
