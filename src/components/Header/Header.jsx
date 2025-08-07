import React from "react";
import HERO_IMG from "../../assets/banner-image.jpg";
import "./header.css";

const Header = () => {
  return (
    <div className="banner__image" id="homePageBanner">
      <header>
        <div className="container hero__container">
          <div className="hero__content">
            <div className="hero__left">
              <h6>Welcome to Lugx</h6>
              <h2>Best Gaming Site Ever!</h2>
              <p>
                LUGX Gaming is free Bootstrap 5 HTML CSS website template for
                your gaming websites. You can download and use this layout for
                commercial purposes. Please tell your friends about TemplateMo.
              </p>
              <div className="search__input">
                <input type="search" placeholder="Type Something" />
                <button className="btn">Search Now</button>
              </div>
            </div>
            <div className="hero__right">
              <img src={HERO_IMG} alt="" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
