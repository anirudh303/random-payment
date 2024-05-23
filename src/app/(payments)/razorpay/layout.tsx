import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <body>{children}</body>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
