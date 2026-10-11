import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useCreateStripePaymentIntentMutation } from "@/state/api";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import Loading from "@/components/Loading";

const cleanKey = (key?: string): string => {
  if (!key) return "";
  return key.trim().replace(/^["']|["']$/g, "").trim();
};

const DEFAULT_STRIPE_PUBLIC_KEY =
  "pk_test_51TAsNuJ60Lb1e6oVkz1IDQ96CAAM4SLCzOYVKWucl4OEITnXFAVpmtJnqGevJPRsImPgWmyVkAym0MPVjE0a23Ki00ym9bWNoA";

const envKey =
  cleanKey(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) ||
  cleanKey(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const stripePublicKey =
  envKey && envKey.startsWith("pk_") ? envKey : DEFAULT_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(stripePublicKey);

const appearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#0570de",
    colorBackground: "#18181b",
    colorText: "#d2d2d2",
    colorDanger: "#df1b41",
    colorTextPlaceholder: "#6e6e6e",
    fontFamily: "Inter, system-ui, sans-serif",
    spacingUnit: "3px",
    borderRadius: "10px",
    fontSizeBase: "14px",
  },
};

const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientSecret, setClientSecret] = useState<string | "">("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  const { course, courseId } = useCurrentCourse();

  useEffect(() => {
    if (!course || (course.price ?? 0) <= 0 || clientSecret) return;

    let isMounted = true;
    const fetchPaymentIntent = async () => {
      try {
        const result: any = await createStripePaymentIntent({
          amount: course.price ?? 0,
        }).unwrap();

        const secret =
          result?.clientSecret ||
          result?.data?.clientSecret ||
          (typeof result === "string" ? result : "");

        if (isMounted && secret) {
          setClientSecret(secret);
        }
      } catch (error: any) {
        console.error("Failed to create payment intent:", error);
        if (isMounted) {
          setErrorMessage(
            error?.data?.message ||
              error?.message ||
              "Failed to initialize payment gateway."
          );
        }
      }
    };

    fetchPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [createStripePaymentIntent, course?.price, courseId, clientSecret]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (!stripePromise) {
    return (
      <div className="p-6 text-center text-red-400">
        Stripe configuration is missing. Please check your environment variables.
      </div>
    );
  }

  if (errorMessage && !clientSecret) {
    return (
      <div className="p-6 text-center text-red-400">
        {errorMessage}
      </div>
    );
  }

  if (!clientSecret) return <Loading />;

  return (
    <Elements stripe={stripePromise} options={options} key={clientSecret}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
