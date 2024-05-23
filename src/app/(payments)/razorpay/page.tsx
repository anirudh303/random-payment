"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState, useTransition } from "react";
import { PaymentHandler } from "@/app/actions/payment";
import { FormSuccess } from "@/components/Form-success";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentSchema } from "@/app/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

type PaymentOrderState = z.infer<typeof PaymentSchema>;
const PaymentHomePage = () => {
  const [message, SetMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<PaymentOrderState>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      uid: "",
      amount: undefined,
    },
  });
  const onSubmit = (values: PaymentOrderState) => {
    startTransition(async () => {
      const result = await PaymentHandler(values);
      if (!result) SetMessage("error");
      //SetMessage(result?.message || "");

      if (!result?.options) SetMessage("internal error");
      console.log(result?.options);
      const paymentObject = new window.Razorpay(result?.options);
      paymentObject.open();
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed. Please try again. Contact support for help");
        console.log("\n", response.error);
      });
    });
  };

  return (
    <div className="  justify-center items-center flex flex-col pt-20 drop-shadow-lg">
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="  space-y-3 "
            >
              <FormField
                control={form.control}
                name="uid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Username /Email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Amount"
                        disabled={isPending}
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Pay
              </Button>
              <FormSuccess message={message} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHomePage;
