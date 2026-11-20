import { Container } from "@/components/ui-library/container";
import Hero from "./Hero/Hero";
import About from "./About/About";
import Shop from "./Shop/Shop";
import Gallery from "./Gallery/Gallery";

const HomeComponent = () => {
  return (
    <>
      <Hero />
      <About />
      <Shop />
      <Gallery />
    </>
  );
};

export default HomeComponent;
