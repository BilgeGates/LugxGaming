import React from "react";
import Navbar from "../../layout/Navbar/Navbar";
import Header from "../../components/sections/Header/Header";
import TrendingSection from "../../components/sections/TrendingSection/TrendingSection";
import Footer from "../../layout/Footer/Footer";
import MotionWrapper from "../../components/common/MotionWrapper";

const Home = () => {
  return (
    <>
      <MotionWrapper>
        <Navbar />
      </MotionWrapper>

      <MotionWrapper direction="up" delay={1}>
        <Header />
      </MotionWrapper>

      <MotionWrapper direction="left" delay={1}>
        <TrendingSection />
      </MotionWrapper>

      <MotionWrapper direction="zoom" delay={0.2}>
        <Footer />
      </MotionWrapper>
    </>
  );
};

export default Home;
