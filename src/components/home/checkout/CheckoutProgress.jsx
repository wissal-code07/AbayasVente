import "./CheckoutProgress.css";

const STEPS = [
  { key: "address",  label: "Adresse",  num: 1 },
  { key: "delivery", label: "Livraison", num: 2 },
  { key: "payment",  label: "Paiement",  num: 3 },
];

export default function CheckoutProgress({ currentStep, completedSteps, onStepClick }) {
  return (
    <div className="checkout-progress">
      {STEPS.map((step, i) => {
        const isCompleted = completedSteps.includes(step.key);
        const isCurrent   = currentStep === step.key;
        const isClickable = isCompleted;

        return (
          <div key={step.key} className="checkout-progress__item">
            <button
              className={`checkout-progress__step
                ${isCurrent   ? "checkout-progress__step--current"   : ""}
                ${isCompleted ? "checkout-progress__step--completed"  : ""}
                ${!isCurrent && !isCompleted ? "checkout-progress__step--pending" : ""}
              `}
              onClick={() => isClickable && onStepClick(step.key)}
              disabled={!isClickable && !isCurrent}
            >
              <span className="checkout-progress__num">
                {isCompleted ? "✓" : step.num}
              </span>
              <span className="checkout-progress__label">{step.label}</span>
            </button>

            {i < STEPS.length - 1 && (
              <div className={`checkout-progress__line ${isCompleted ? "checkout-progress__line--done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
