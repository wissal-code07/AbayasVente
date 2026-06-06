import { useState } from "react";
import CheckoutProgress from "../components/checkout/CheckoutProgress";
import CheckoutAddress from "../components/checkout/CheckoutAddress";
import CheckoutDelivery from "../components/checkout/CheckoutDelivery";
import CheckoutPayment from "../components/checkout/CheckoutPayment";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import CheckoutConfirmation from "../components/checkout/CheckoutConfirmation";
import "./CheckoutPage.css";

const STEPS = ["address", "delivery", "payment"];

export default function CheckoutPage({ cart, navigate }) {
  const [currentStep, setCurrentStep]     = useState("address");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [confirmed, setConfirmed]         = useState(false);

  // Collected data across steps
  const [orderData, setOrderData] = useState({
    address:        null,
    deliveryOption: null,
    paymentId:      null,
    cart,
  });

  const completeStep = (step, data) => {
    setOrderData(prev => ({ ...prev, ...data }));
    setCompletedSteps(prev => [...new Set([...prev, step])]);

    const nextIndex = STEPS.indexOf(step) + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // All steps done — show confirmation
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    const prevIndex = STEPS.indexOf(currentStep) - 1;
    if (prevIndex >= 0) setCurrentStep(STEPS[prevIndex]);
  };

  const goToStep = (step) => {
    if (completedSteps.includes(step)) setCurrentStep(step);
  };

  if (confirmed) {
    return (
      <div className="checkout-page checkout-page--confirmed">
        <CheckoutConfirmation orderData={orderData} navigate={navigate} />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <div className="checkout-page__hero">
        <button className="checkout-page__logo" onClick={() => navigate("home")}>
          Abayas<span>Vente</span>
        </button>
        <p className="checkout-page__secure">🔒 Paiement sécurisé</p>
      </div>

      {/* Progress */}
      <div className="checkout-page__progress-wrap">
        <CheckoutProgress
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      {/* Layout: form + summary */}
      <div className="checkout-page__layout">
        {/* Left: current step form */}
        <div className="checkout-page__form">
          {currentStep === "address" && (
            <CheckoutAddress
              onNext={(data) => completeStep("address", {
                address: data.mode === "saved" ? data.address : data.form,
              })}
              savedData={orderData}
            />
          )}
          {currentStep === "delivery" && (
            <CheckoutDelivery
              onNext={(data) => completeStep("delivery", {
                deliveryOption: data.deliveryOption,
              })}
              onBack={goBack}
              savedData={orderData}
            />
          )}
          {currentStep === "payment" && (
            <CheckoutPayment
              onNext={(data) => completeStep("payment", { paymentId: data.paymentId })}
              onBack={goBack}
              savedData={orderData}
            />
          )}
        </div>

        {/* Right: order summary */}
        <div className="checkout-page__summary">
          <CheckoutSummary
            cart={cart}
            deliveryOption={orderData.deliveryOption}
          />
        </div>
      </div>
    </div>
  );
}
