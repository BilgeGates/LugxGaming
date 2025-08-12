import React from "react";
import Navbar from "../../layout/Navbar/Navbar";
import Header from "../../components/sections/Header/Header";
import TrendingSection from "../../components/sections/TrendingSection/TrendingSection";
import Footer from "../../layout/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <TrendingSection />
      <Footer />
    </>
  );
};

export default Home;
