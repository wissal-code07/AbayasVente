import { marqueeItems } from "../../data/mockData";
import "./MarqueeBar.css";

export default function MarqueeBar() {
  // Duplicate items to create seamless loop
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="marquee">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
