import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import Features from "../../components/Features/Features";
import TrendingGames from "../../components/TrendingGames/TrendingGames";
import Games from "../../components/Games/Games";
// import Categories from "../../components/Categories/Categories";
// import CTA from "../../components/CTA/CTA";
// import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <Features />
      <TrendingGames />
      <Games />
      {/*<Categories />
      <CTA />
      <Footer /> */}
    </>
  );
};

export default Home;
