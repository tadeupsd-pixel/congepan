'use client';

import { useEffect, useRef } from 'react';

export function WheatParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheats = container.querySelectorAll('.wheat');
    let animationId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      wheats.forEach((wheat, index) => {
        const speed = 0.3 + (index * 0.08);
        const offsetY = scrollY * speed;
        (wheat as HTMLElement).style.transform = `translateY(${offsetY * 0.15}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="wheat-flight">
      <span className="wheat wheat-1">🌾</span>
      <span className="wheat wheat-2">🌾</span>
      <span className="wheat wheat-3">🌾</span>
      <span className="wheat wheat-4">🌾</span>
      <span className="wheat wheat-5">🌾</span>
      <span className="wheat wheat-6">🌾</span>
      <span className="wheat wheat-7">🌾</span>
      <span className="wheat wheat-8">🌾</span>
      <span className="wheat wheat-extra-1" style={{ left: '35%', top: '-22%', animationDuration: '25s', animationDelay: '-5s' }}>🌾</span>
      <span className="wheat wheat-extra-2" style={{ left: '62%', top: '-18%', animationDuration: '23s', animationDelay: '-9s' }}>🌾</span>
    </div>
  );
}
