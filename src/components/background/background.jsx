import React from "react";
import "./background.css";
const Background = ({ videoSrc }) => {
  return (
    <div className="backgroundContainer">
      <video
        key={videoSrc}
        webkit-playsinline="true"
        playsInline={true}
        loop={true}
        autoPlay={true}
        muted={true}
        className="videoBackground"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Background;
