import React from "react";
import "./header.css";

const Header = ({ switchStatus }) => {
  return (
    <div className="header">
      <h1>
        LA MAISON <span>PALMIER</span>
      </h1>
      <div className="nav">
        <h2
          className="headerTitle activeTitle"
          onClick={(e) => switchStatus(e, "all")}
        >
          On-air
        </h2>
        <h2 className="headerTitle" onClick={(e) => switchStatus(e, "matin")}>
          Morning
        </h2>
        <h2
          className="headerTitle"
          onClick={(e) => switchStatus(e, "apresmidi")}
        >
          Afternoon
        </h2>
        <h2 className="headerTitle" onClick={(e) => switchStatus(e, "nuit")}>
          Night
        </h2>
      </div>
    </div>
  );
};

export default Header;
