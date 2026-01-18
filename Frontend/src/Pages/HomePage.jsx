import HeroSection from "@/components/HeroSection.jsx";
import LibraryCarousel from "@/components/LibraryCrousal.jsx";
import FeaturedBooks from "@/components/FeatureBooks.jsx";

const HomePage = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <LibraryCarousel />
      <FeaturedBooks />
    </div>
  );
};

export default HomePage;
