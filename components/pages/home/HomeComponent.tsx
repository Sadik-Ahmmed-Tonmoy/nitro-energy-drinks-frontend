import { Container } from "@/components/ui-library/container";
import Hero from "./Hero/Hero";
import About from "./About/About";
import Shop from "./Shop/Shop";

const HomeComponent = () => {
  return (
    <>
      <Hero />
      <About />
        <Shop />
    </>
  );
};

export default HomeComponent;
