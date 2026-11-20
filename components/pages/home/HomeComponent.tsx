import About from "./About/About";
import Gallery from "./Gallery/Gallery";
import Hero from "./Hero/Hero";
import Shop from "./Shop/Shop";

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
