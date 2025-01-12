import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/carousel-slide.css';

export const CarouselSlide = ({ slide, isActive }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    console.log(slide.url);
    navigate(slide.url); // Navigue vers l'URL spécifiée dans l'objet `slide`
  };

  return (
    <div className={`carousel-slide ${isActive ? 'active' : ''}`}>
      <div 
        className="slide-background"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="slide-overlay" />
      </div>
      
      <div className="slide-content">
        <div className="slide-content-inner">
          <h2 className="slide-title">{slide.title}</h2>
          <p className="slide-description">{slide.description}</p>
          <button className="slide-button" onClick={handleButtonClick}>
            {slide.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};
