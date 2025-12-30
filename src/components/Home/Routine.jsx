import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RoutineCard({ src, alt }) {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div 
      className={`${isActive ? 'grayscale-0' : 'grayscale'} hover:grayscale-0 transition-all duration-500 ease-in-out cursor-pointer transform hover:scale-105`}
      onClick={() => setIsActive(!isActive)}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

export default function Routine() {
  const routineImages = [
    { src: "/src/assets/Images/routine1.png", alt: "Routine 1" },
    { src: "/src/assets/Images/routine2.png", alt: "Routine 2" },
    { src: "/src/assets/Images/routine3.png", alt: "Routine 3" },
    { src: "/src/assets/Images/routine4.png", alt: "Routine 4" },
    { src: "/src/assets/Images/routine5.png", alt: "Routine 5" }
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h1 className="text-center text-3xl sm:text-4xl mt-10 mb-5 text-brandRed uppercase font-semibold font-['Playfair_Display']">
          Routines par besoin
        </h1>

        {/* Routines Carousel/Grid */}
        <div className="mt-10 overflow-x-auto sm:overflow-visible">
          <div className="flex gap-4 sm:gap-6 sm:justify-center min-w-max sm:min-w-0">
            {routineImages.map((routine, index) => (
              <div 
                key={index} 
                className="w-64 sm:w-1/5 shrink-0"
              >
                <RoutineCard 
                  src={routine.src}
                  alt={routine.alt}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-16 mb-20">
          <Link to={'/login'} 
            className="px-8 py-4 uppercase bg-white border border-black font-['Montserrat'] text-lg font-medium hover:bg-hoverBrandRed hover:text-brandWhite transition-all duration-300 transform hover:scale-105"
          >
            Je découvre ma routine idéale
          </Link>
        </div>
      </div>
    </div>
  );
}