import React from 'react';
import './styles/carousel-indicators.css';

export const CarouselIndicators = ({ slidesCount, currentSlide, onIndicatorClick }) => {
  return (
    <div className="carousel-indicators">
      {Array.from({ length: slidesCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={`indicator ${index === currentSlide ? 'active' : ''}`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};