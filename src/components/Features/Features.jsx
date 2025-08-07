import React from "react";
import { Link } from "react-router-dom";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoPlayCircleOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";

import "./features.css";

const Features = () => {
  const featuresData = [
    {
      id: 1,
      icon: <IoCloudDownloadOutline size={48} />,
      title: "Free Storage",
      link: "/",
    },
    {
      id: 2,
      icon: <FaRegCircleUser size={48} />,
      title: "User More",
      link: "/",
    },
    {
      id: 3,
      icon: <IoPlayCircleOutline size={48} />,
      title: "Reply Ready",
      link: "/",
    },
    {
      id: 4,
      icon: <LuLayoutDashboard size={48} />,
      title: "Easy Layout",
      link: "/",
    },
  ];

  return (
    <section className="features">
      <div className="container features__container">
        {featuresData.map((feature) => (
          <Link to={feature.link} key={feature.id}>
            <div className="feature__item">
              <span className="feature__icon">
                <i>{feature.icon}</i>
              </span>
              <h4>{feature.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Features;
