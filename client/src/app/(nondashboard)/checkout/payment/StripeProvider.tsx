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

const stripePublicKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ||
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

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
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  const { course, courseId } = useCurrentCourse();

  useEffect(() => {
    if (!course || (course.price ?? 0) <= 0 || clientSecret) return;

    let isMounted = true;
    const fetchPaymentIntent = async () => {
      try {
        const result = await createStripePaymentIntent({
          amount: course.price ?? 0,
        }).unwrap();

        if (isMounted && result?.clientSecret) {
          setClientSecret(result.clientSecret);
        }
      } catch (error) {
        console.error("Failed to create payment intent:", error);
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

  if (!clientSecret) return <Loading />;

  return (
    <Elements stripe={stripePromise} options={options} key={clientSecret}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
