import React from 'react';
import './styles/carousel-slide.css';

export const CarouselSlide = ({ slide, isActive }) => {
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
          <button className="slide-button" >
            {slide.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};