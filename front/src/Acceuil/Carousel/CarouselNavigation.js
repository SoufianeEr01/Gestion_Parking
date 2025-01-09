import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './styles/carousel-navigation.css';

export const CarouselNavigation = ({ onPrevClick, onNextClick }) => {
  return (
    <>
      <button
        onClick={onPrevClick}
        className="carousel-nav-button prev"
        aria-label="Previous slide"
      >
        <ChevronLeft className="nav-icon" />
      </button>
      <button
        onClick={onNextClick}
        className="carousel-nav-button next"
        aria-label="Next slide"
      >
        <ChevronRight className="nav-icon" />
      </button>
    </>
  );
};