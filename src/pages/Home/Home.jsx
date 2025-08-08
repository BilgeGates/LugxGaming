import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import TrendingGames from "../../components/TrendingGames/TrendingGames";
import Games from "../../components/Games/Games";
import Categories from "../../components/Categories/Categories";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <TrendingGames />
      <Games />
      <Categories />
      <Footer />
    </>
  );
};

export default Home;
