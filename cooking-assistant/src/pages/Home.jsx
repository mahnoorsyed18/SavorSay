import FetchPopular from "../components/FetchPopular";
import HeroSection from "../components/HeroSection";
import Popular from "../components/Popular";
import SearchSection from "../components/SearchSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FetchPopular />
      <div id="popular" style={{ scrollMarginTop: "100px" }}>
        <Popular />
      </div>

      <SearchSection />
    </>
  );
};

export default Home;
