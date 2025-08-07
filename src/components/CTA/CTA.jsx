import React from "react";
import "./cta.css";

const CTA = () => {
  return (
    <section className="cta">
      <div className="container cta__container">
        <div className="shop__content">
          <h6>Our Shop</h6>
          <h2>
            Go Pre-Order <br />
            Buy &amp; Get <br />
            Best <span className="custom__text">Prices</span> <br />
            For You!
          </h2>
          <p>
            Lorem ipsum dolor consectetur adipiscing, sed do eiusmod tempor
            incididunt.
          </p>
          <button className="btn">Shop Now</button>
        </div>
        <div className="subscribe__content">
          <h6>Newsletter</h6>
          <h2>
            Get Up To $100 Off Just Buy{" "}
            <span className="custom__text">Subscribe</span> Newsletter!
          </h2>
          <div className="subscribe__input">
            <input type="email" placeholder="Your Email.." />
            <button className="btn">Subscribe Now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
