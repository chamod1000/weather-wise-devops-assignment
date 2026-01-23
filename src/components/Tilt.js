"use client";
import React, { useRef, useState } from 'react';

const Tilt = ({ children, className = "" }) => {
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the element
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    const xPct = x / width;
    const yPct = y / height;
    
    const maxTilt = 10;

    const rotateX = (0.5 - yPct) * maxTilt * 2; 
    const rotateY = (xPct - 0.5) * maxTilt * 2;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform, 
        transition: "transform 0.1s ease-out",
        transformStyle: "preserve-3d"
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Tilt;
