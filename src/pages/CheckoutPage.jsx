import { useState } from "react";
import { createOrder } from "../services/orderService";
import { createAddress } from "../services/authService";
import CheckoutProgress from "../components/home/checkout/CheckoutProgress";
import CheckoutAddress from "../components/home/checkout/CheckoutAddress";
import CheckoutDelivery from "../components/home/checkout/CheckoutDelivery";
import CheckoutPayment from "../components/home/checkout/CheckoutPayment";
import CheckoutSummary from "../components/home/checkout/CheckoutSummary";
import CheckoutConfirmation from "../components/home/checkout/CheckoutConfirmation";
import "./CheckoutPage.css";

const STEPS = ["address", "delivery", "payment"];

export default function CheckoutPage({ cart, navigate, onOrderSuccess }) {
  const [currentStep, setCurrentStep]       = useState("address");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [confirmed, setConfirmed]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [orderData, setOrderData]           = useState({ address: null, deliveryOption: null, paymentId: null, cart });
  const [createdOrder, setCreatedOrder]     = useState(null);

  const completeStep = async (step, data) => {
    let updatedData = { ...orderData, ...data };

    // Si c'est une nouvelle adresse (sans id), on la sauvegarde en base
    if (step === "address" && updatedData.address && !updatedData.address.id) {
      try {
        // Convertir les champs camelCase → snake_case pour l'API
        const addressForApi = {
          first_name: updatedData.address.firstName,
          last_name: updatedData.address.lastName,
          address: updatedData.address.address,
          city: updatedData.address.city,
          wilaya: updatedData.address.wilaya,
          phone: updatedData.address.phone,
          label: updatedData.address.label || "",
        };
        const newAddress = await createAddress(addressForApi);
        updatedData.address = newAddress;
      } catch (err) {
        console.error("Erreur création adresse:", err);
        alert("Erreur lors de l'enregistrement de l'adresse. Veuillez réessayer.");
        return;
      }
    }

    setOrderData(updatedData);
    setCompletedSteps(prev => [...new Set([...prev, step])]);

    const nextIndex = STEPS.indexOf(step) + 1;

    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitting(true);
      try {
        const addr = updatedData.address;
        const payload = {
          items: cart.map(item => ({
            product_id: item.id,
            quantity:   item.quantity,
            size:       item.selectedSize  || "",
            color:      item.selectedColor || "",
          })),
          shipping_name:    `${addr.first_name || addr.firstName} ${addr.last_name || addr.lastName}`,
          shipping_address: addr.address,
          shipping_city:    addr.city,
          shipping_wilaya:  addr.wilaya,
          shipping_phone:   addr.phone,
          delivery_method:  updatedData.deliveryOption.id,
          payment_method:   updatedData.paymentId,
          notes:            "",
        };
        const order = await createOrder(payload);
        setCreatedOrder(order);
        if (onOrderSuccess) onOrderSuccess();
        setConfirmed(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        alert("Erreur lors de la création de la commande. Veuillez réessayer.");
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const goBack = () => {
    const prevIndex = STEPS.indexOf(currentStep) - 1;
    if (prevIndex >= 0) setCurrentStep(STEPS[prevIndex]);
  };

  const goToStep = (step) => { if (completedSteps.includes(step)) setCurrentStep(step); };

  if (confirmed) {
    return (
      <div className="checkout-page checkout-page--confirmed">
        <CheckoutConfirmation orderData={{ ...orderData, cart, orderNumber: createdOrder?.order_number }} navigate={navigate} />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__hero">
        <button className="checkout-page__logo" onClick={() => navigate("home")}>Abayas<span>Vente</span></button>
        <p className="checkout-page__secure">🔒 Paiement sécurisé</p>
      </div>

      <div className="checkout-page__progress-wrap">
        <CheckoutProgress currentStep={currentStep} completedSteps={completedSteps} onStepClick={goToStep} />
      </div>

      <div className="checkout-page__layout">
        <div className="checkout-page__form">
          {submitting && (
            <div className="checkout-page__submitting">
              <div className="catalogue-page__spinner" />
              <p>Création de votre commande...</p>
            </div>
          )}
          {!submitting && currentStep === "address" && (
            <CheckoutAddress onNext={(data) => completeStep("address", { address: data.mode === "saved" ? data.address : data.form })} savedData={orderData} />
          )}
          {!submitting && currentStep === "delivery" && (
            <CheckoutDelivery onNext={(data) => completeStep("delivery", { deliveryOption: data.deliveryOption })} onBack={goBack} savedData={orderData} />
          )}
          {!submitting && currentStep === "payment" && (
            <CheckoutPayment onNext={(data) => completeStep("payment", { paymentId: data.paymentId })} onBack={goBack} savedData={orderData} />
          )}
        </div>
        <div className="checkout-page__summary">
          <CheckoutSummary cart={cart} deliveryOption={orderData.deliveryOption} />
        </div>
      </div>
    </div>
  );
}