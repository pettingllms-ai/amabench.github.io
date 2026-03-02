import HeroBanner from "@/components/HeroBanner";
import CategoryCarousel from "@/components/CategoryCarousel";
import Highlights from "@/components/Highlights";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      <CategoryCarousel />
      <Highlights />
      <Footer />
    </div>
  );
};

export default Index;
