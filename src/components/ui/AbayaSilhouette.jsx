// Abaya silhouette SVG — used as placeholder image in product cards
// Will be replaced by real product images from the API later

export default function AbayaSilhouette({ gradientFrom, gradientTo, accentColor, id }) {
  const gradId = `grad-${id}`;
  return (
    <svg
      width="120"
      height="220"
      viewBox="0 0 120 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.35 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>
      <path
        d="M60 10 C50 10 44 20 44 30 L44 40 C30 45 18 55 14 70 L4 120 L18 122 L22 90 L22 210 L98 210 L98 90 L102 122 L116 120 L106 70 C102 55 90 45 76 40 L76 30 C76 20 70 10 60 10Z"
        fill={`url(#${gradId})`}
        stroke={accentColor}
        strokeWidth="1"
      />
    </svg>
  );
}
