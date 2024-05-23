import { z } from "zod";

export const PaymentSchema = z.object({
  uid: z.string().min(3, { message: " minimum 4 charcters" }),
  amount: z.coerce.number().int().min(1),
});

export const LoginSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password needs to be minimum of 6 charcaters" })
    .max(18, { message: "Password needs to be below 18 characters" }),
  code: z.optional(z.string()),
});
