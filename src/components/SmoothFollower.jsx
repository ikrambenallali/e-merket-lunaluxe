'use client';
import { useState, useEffect, useRef } from 'react';

export default function SmoothFollower() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const borderDotPosition = useRef({ x: 0, y: 0 });
  const [renderPos, setRenderPos] = useState({
    dot: { x: 0, y: 0 },
    border: { x: 0, y: 0 },
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const DOT_SMOOTHNESS = 0.2;
  const BORDER_DOT_SMOOTHNESS = 0.1;

  useEffect(() => {
    // Check if device is desktop (min-width: 1024px)
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);

    const interactiveElements = document.querySelectorAll(
      'a, button, img, input, textarea, select'
    );
    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    const animate = () => {
      const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
      };

      dotPosition.current.x = lerp(
        dotPosition.current.x,
        mousePosition.current.x,
        DOT_SMOOTHNESS
      );
      dotPosition.current.y = lerp(
        dotPosition.current.y,
        mousePosition.current.y,
        DOT_SMOOTHNESS
      );

      borderDotPosition.current.x = lerp(
        borderDotPosition.current.x,
        mousePosition.current.x,
        BORDER_DOT_SMOOTHNESS
      );
      borderDotPosition.current.y = lerp(
        borderDotPosition.current.y,
        mousePosition.current.y,
        BORDER_DOT_SMOOTHNESS
      );

      setRenderPos({
        dot: { x: dotPosition.current.x, y: dotPosition.current.y },
        border: {
          x: borderDotPosition.current.x,
          y: borderDotPosition.current.y,
        },
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkIsDesktop);
      interactiveElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Don't render on mobile/tablet
  if (typeof window === 'undefined' || !isDesktop) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className={`absolute rounded-full transition-colors ${
          isHovering ? 'bg-white' : 'dark:bg-brandBrown bg-brandRed'
        }`}
        style={{
          width: '8px',
          height: '8px',
          transform: 'translate(-50%, -50%)',
          left: `${renderPos.dot.x}px`,
          top: `${renderPos.dot.y}px`,
          transition: 'background-color 0.3s',
        }}
      />

      <div
        className={`absolute rounded-full border transition-colors ${
          isHovering ? 'border-white' : 'dark:border-brandBrown border-brandRed'
        }`}
        style={{
          width: isHovering ? '44px' : '28px',
          height: isHovering ? '44px' : '28px',
          transform: 'translate(-50%, -50%)',
          left: `${renderPos.border.x}px`,
          top: `${renderPos.border.y}px`,
          transition: 'width 0.3s, height 0.3s, border-color 0.3s',
        }}
      />
    </div>
  );
}