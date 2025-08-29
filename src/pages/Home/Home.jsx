import React from "react";
import Navbar from "../../layout/Navbar/Navbar";
import Header from "../../components/sections/Header/Header";
import TrendingSection from "../../components/sections/TrendingSection/TrendingSection";
import TopRatedSection from "../../components/sections/TopRatedSection/TopRatedSection";
import CategoriesSection from "../../components/sections/CategoriesSection/CategoriesSection";
import Footer from "../../layout/Footer/Footer";

import { useDocumentTitle } from "../../hooks";

const Home = () => {
  useDocumentTitle("Home | PlayGuide");

  return (
    <>
      <Navbar />

      <Header />

      <TrendingSection />
      <TopRatedSection />
      <CategoriesSection />

      <Footer />
    </>
  );
};

export default Home;
