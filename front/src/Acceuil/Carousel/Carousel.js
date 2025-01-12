import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselSlide } from './CarouselSlide';
import { CarouselNavigation } from './CarouselNavigation';
import { CarouselIndicators } from './CarouselIndicators';
import { useCarousel } from './useCarousel';
import { slides } from './carouselData';
import './styles/carousel.css';

const Carousel = ({ autoPlayInterval = 5000 }) => {
  const { currentSlide, nextSlide, prevSlide, goToSlide } = useCarousel(slides.length, autoPlayInterval);

  return (
    <div className="carousel">
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <CarouselSlide
            key={index}
            slide={slide}
            isActive={index === currentSlide}
          />
        ))}
      </div>

      <CarouselNavigation
        onPrevClick={prevSlide}
        onNextClick={nextSlide}
      />

      <CarouselIndicators
        slidesCount={slides.length}
        currentSlide={currentSlide}
        onIndicatorClick={goToSlide}
      />
    </div>
  );
};

export default Carousel;
