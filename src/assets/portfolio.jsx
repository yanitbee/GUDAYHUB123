import React, { useState } from 'react';
import './portfolio.css'; // Import the CSS file

const slides = [
    '/image.log 4.jpg',
  '/image.log 4.jpg',
 '/image.log 4.jpg',
];

const PortfolioSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="proslider">
      <div
        className="slides"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="slide"
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}
      </div>
      <button className="control control-prev" onClick={goToPrevSlide}>
        &#10094;
      </button>
      <button className="control control-next" onClick={goToNextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default PortfolioSlider;
