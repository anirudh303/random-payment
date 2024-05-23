import { validateOrder } from "./order-validate";

export const Createoptions = async (
  amount: number,
  orderId: string,
  name: string
) => {
  "use server";
  const key = process.env.RAZORPAY_KEY_ID;

  const PaymentOptions = {
    key, // Enter the Key ID generated from the Dashboard
    amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "CreativeCanvas", //your business name
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: orderId, //
    handler: async function (response: any) {
      "use server";
      const body = {
        ...response,
      };

      const validateRes = await validateOrder(body);

      console.log(validateRes);
    },
    prefill: {
      //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
      name: name, //your customer's name
      email: "webdevmatrix@example.com", // add these fields in form
      contact: "9000000000", //Provide the customer's phone number for better conversion rates
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };

  return PaymentOptions;
};
