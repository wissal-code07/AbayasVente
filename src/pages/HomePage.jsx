import HeroSection from "../components/home/HeroSection";
import MarqueeBar from "../components/home/MarqueeBar";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PromotionsSection from "../components/home/PromotionsSection";

export default function HomePage({ onAddToCart, navigate }) {
  return (
    <>
      <HeroSection navigate={navigate} />
      <MarqueeBar />
      <FeaturedProducts onAddToCart={onAddToCart} navigate={navigate} />
      <PromotionsSection navigate={navigate} />
    </>
  );
}
