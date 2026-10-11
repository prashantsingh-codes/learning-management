import React from "react";
import StripeProvider from "./StripeProvider";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useClerk, useUser } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation } from "@/state/api";
import { toast } from "sonner";

const PaymentPageContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [createTransaction] = useCreateTransactionMutation();
  const { navigateToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe service is not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const rawLocalUrl = process.env.NEXT_PUBLIC_LOCAL_URL || "";
      const localUrl = rawLocalUrl.startsWith("http")
        ? rawLocalUrl
        : rawLocalUrl
        ? `http://${rawLocalUrl}`
        : "";
      const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "";
      const baseUrl =
        localUrl ||
        vercelUrl ||
        (typeof window !== "undefined" ? window.location.origin : "");

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/checkout?step=3&id=${courseId}`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message || "An error occurred with your payment");
        setIsSubmitting(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const transactionData: Partial<Transaction> = {
          transactionId: result.paymentIntent.id,
          userId: user?.id,
          courseId: courseId,
          paymentProvider: "stripe",
          amount: course?.price || 0,
        };

        await createTransaction(transactionData).unwrap();
        toast.success("Payment successful!");
        navigateToStep(3);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error?.message || "Failed to complete transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOutAndNavigate = async () => {
    await signOut();
    navigateToStep(1);
  };

  if (!course) return null;

  return (
    <div className="payment">
      <div className="payment__container">
        {/* Order Summary */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>

        {/* Payment Form */}
        <div className="payment__form-container">
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="payment__form"
          >
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                Fill out the payment details below to complete your purchase.
              </p>

              <div className="payment__method">
                <h3 className="payment__method-title">Payment Method</h3>

                <div className="payment__card-container">
                  <div className="payment__card-header">
                    <CreditCard size={24} />
                    <span>Credit/Debit Card</span>
                  </div>
                  <div className="payment__card-element">
                    <PaymentElement
                      id="payment-element"
                      options={{ layout: "accordion" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        <Button
          form="payment-form"
          type="submit"
          className="payment__submit"
          disabled={!stripe || !elements || isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Pay with Credit Card"}
        </Button>
      </div>
    </div>
  );
};

const FreeEnrollmentContent = () => {
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const { navigateToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleFreeEnrollment = async () => {
    if (!user) {
      toast.error("Please sign in to complete enrollment");
      return;
    }

    try {
      const transactionData: Partial<Transaction> = {
        transactionId: `free_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: user.id,
        courseId: courseId,
        paymentProvider: "free",
        amount: 0,
      };

      await createTransaction(transactionData).unwrap();
      toast.success("Successfully enrolled!");
      navigateToStep(3);
    } catch {
      toast.error("Failed to enroll in course. Please try again.");
    }
  };

  const handleSignOutAndNavigate = async () => {
    await signOut();
    navigateToStep(1);
  };

  if (!course) return null;

  return (
    <div className="payment">
      <div className="payment__container">
        {/* Order Summary */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>

        {/* Free Enrollment Card */}
        <div className="payment__form-container">
          <div className="payment__form">
            <div className="payment__content">
              <h1 className="payment__title">Enroll in Free Course</h1>
              <p className="payment__subtitle">
                This course is offered free of charge. No payment details required.
              </p>

              <div className="payment__method">
                <div className="payment__card-container p-6 bg-customgreys-secondarybg rounded-lg border border-customgreys-dirtyGrey/20">
                  <h3 className="text-lg font-semibold text-white-100 mb-2">
                    Free Course Access
                  </h3>
                  <p className="text-sm text-customgreys-dirtyGrey">
                    Full lifetime access to this course will be added to your account instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        <Button
          onClick={handleFreeEnrollment}
          type="button"
          disabled={isLoading}
          className="payment__submit"
        >
          {isLoading ? "Enrolling..." : "Complete Free Enrollment"}
        </Button>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const { course, isLoading } = useCurrentCourse();

  if (isLoading) return null;

  if (course && (course.price ?? 0) === 0) {
    return <FreeEnrollmentContent />;
  }

  return (
    <StripeProvider>
      <PaymentPageContent />
    </StripeProvider>
  );
};

export default PaymentPage;
