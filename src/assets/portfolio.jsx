import React, { useState } from "react";
import "./portfolio.css";

const PortfolioSlider = ({pics}) => {


  const [spread, setSpread] = useState(false);

  
  
  const getProfilePicUrl = (fileName) => {
    return `http://localhost:4000/${fileName}`;
  };
  let slides;

  if (pics && pics.length > 0) {
    slides = pics.map((pic, index) => ({
      backgroundImage: `url(${getProfilePicUrl(pic.item)})`,
      transform: index % 2 === 0 ? "rotate(8deg) scale(1.1)" : "rotate(-5deg) scale(0.9)",
    }));
  } else {
    slides = [
      {
        backgroundImage: "url('/image/noPortfolio.png')",
        transform: "rotate(8deg) scale(1.1)",
      },
    ];
  }
  

  
  const transform = [
    {
      transform: "translateX(0)",
    },
    {
      transform: "translateX(90%)",
    },
    {
      transform: "translateY(80%)",
    },
    {
      transform: "translateX(-80%)",
    },
 
  ];

  const over = () => {
    setSpread(true);
  };
  const Notover = () => {
    setSpread(false);
  };

  return (
    <>
    <div className="proslider"
    style={{ width: spread ? "300px" : "350px", height: spread ? "270px" : "350px" , top: spread ? "4rem" : "0" }}
    onMouseOut={Notover}>
       Click To Download
      {slides.map((slide, index) => (

    
        <div
          key={index}
          className="slide"
          style={{
            ...slide,
            ...(spread ? transform[index] : {})
          }}
          onMouseOver={over}
        />
   
      ))}
    </div>
    </>
  );
};

export default PortfolioSlider;
