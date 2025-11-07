// src/components/HeroCollage.jsx
import React, { useState, useEffect } from 'react';

const images = [
  { url: '/hero-images/1.jpg', title: 'Art' },
  { url: '/hero-images/2.jpg', title: 'Yoga' },
  { url: '/hero-images/3.jpg', title: 'Board Games' },
  { url: '/hero-images/4.jpg', title: 'Picnic' },
  { url: '/hero-images/5.jpg', title: 'Music' },
  { url: '/hero-images/6.jpg', title: 'Brunch' },
  { url: '/hero-images/7.jpg', title: 'Games' },
  { url: '/hero-images/8.jpg', title: 'Dining' },
  { url: '/hero-images/9.jpg', title: 'Hiking' },
  { url: '/hero-images/10.jpg', title: 'Gaming' },
];
const HeroCollage = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 2) % (images.length + 1) - 1);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 grid grid-cols-5 grid-rows-2 gap-1 p-1">
      {images.map((image, index) => (
        <div
          key={index}
          className={`bg-cover bg-center transition-all duration-1000 ease-in-out 
            ${activeIndex === index ? 'absolute inset-0 z-10 w-full h-full' : 'relative'}
            ${activeIndex !== -1 && activeIndex !== index ? 'opacity-0' : 'opacity-100'}
          `}
          style={{ backgroundImage: `url(${image.url})` }}
        />
      ))}
    </div>
  );
};

export default HeroCollage;