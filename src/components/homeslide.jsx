import React, { useState, useEffect, useRef, useCallback } from 'react';
import './slider.css'; // Create a corresponding CSS file for styles
import { useTranslation } from "react-i18next";

const videos = [
  "/image/passport-checking-at-airport-5010098-4171905.mp4",
  "/image/man-waiting-for-taxi-11240553-9048488.mp4",
  "/image/asian-female-hoovering-floor-11213621-9014917.mp4",
  "/image/delivery-woman-going-to-delivery-parcel-3573267-3070288.mp4",
  "/image/developers-doing-discussion-with-manager-on-javascript-3574026-3099677.mp4",
  "/image/farmer-watering-on-plants-4234261-3527521.mp4",
  "/image/woman-works-as-makeup-artist-8636673-6860974.mp4",
  "/image/grocery-delivery-7141047-5804622.mp4",
];

const HomeSlide = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const videoRefs = useRef([]);
  
  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      const handleCanPlay = () => {
        currentVideo.play();
      };

      currentVideo.load();
      currentVideo.addEventListener('canplay', handleCanPlay);

      return () => {
        currentVideo.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [activeIndex]);

  const text = {
    WaitInLine: t("A person that will wait in line for your appointments"),
    Driver: t("A driver that you can call anywhere"),
    Cleaner: t("A person that cleans your home"),
    Delivery: t("A delivery service"),
    Programmer: t("A programmer to help you with your problems"),
    Gardener: t("The best gardeners"),
    MakeUpArtist: t("Makeup professionals who will make you look fabulous"),
    Shopper: t("A person to help you with your grocery shopping"),
    Movers: t("Helps with moving"),
  };

  return (
    <div id="slider" ref={sliderRef}>
      <div className="slider__content">
        <div className="slider__images">
          {videos.map((video, i) => (
            <div
              key={i}
              className={`slider__images-item ${i === activeIndex ? 'slider__images-item--active' : ''}`}
            >
              <video
                width="600"
                ref={(el) => (videoRefs.current[i] = el)}
                muted
                controls={false}
                autoPlay={false}
                loop
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
        <div className="slider__text">
          {Object.entries(text).map(([key, val], i) => (
            <div
              key={key}
              className={`slider__text-item ${i === activeIndex ? 'slider__text-item--active' : ''}`}
            >
              <div className="slider__text-item-head">
                <h3>{key}</h3>
              </div>
              <div className="slider__text-item-info">
                <p>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="slider__nav">
        <div className="slider__nav-arrows">
          <div id="left" className="slider__nav-arrow slider__nav-arrow--left" onClick={prevSlide}></div>
          <div id="right" className="slider__nav-arrow slider__nav-arrow--right" onClick={nextSlide}></div>
        </div>
        <div id="slider-dots" className="slider__nav-dots">
          {videos.map((_, i) => (
            <div
              key={i}
              className={`slider__nav-dot ${i === activeIndex ? 'slider__nav-dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSlide;
