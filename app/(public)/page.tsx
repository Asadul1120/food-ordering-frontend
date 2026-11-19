import Hero from "@/components/homepage/hero";
import HomeSections from "@/components/homepage/home-sections";
import FoodCategoryNav from "@/components/share/FoodCategoryNav";

export default function HomePage() {
  return (
    <div>
      <FoodCategoryNav />
      <Hero />
      <HomeSections />
    </div>
  );
}
