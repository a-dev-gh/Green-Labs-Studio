import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import hero1 from '../../../assets/hero-1.webp';
import hero2 from '../../../assets/hero-2.webp';
import hero3 from '../../../assets/hero-3.webp';
import hero4 from '../../../assets/hero-4.webp';
import '../../styles/components/hero-carousel.css';

const slides = [
  { img: hero1, label: 'En la mesa' },
  { img: hero2, label: 'En la biblioteca' },
  { img: hero3, label: 'En la cocina' },
  { img: hero4, label: 'En el baño' },
];

const SLIDE_INTERVAL = 5000;   // 5 s auto-rotation
const PAUSE_AFTER_CLICK = 10000; // 10 s pause when user clicks a dot

export default function HeroCarousel() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoRotation = useCallback(() => {
    if (prefersReducedMotion) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [prefersReducedMotion]);

  useEffect(() => {
    startAutoRotation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoRotation]);

  const handleDotClick = (index: number) => {
    setActive(index);

    // Pause auto-rotation for 10 s then resume
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startAutoRotation();
    }, PAUSE_AFTER_CLICK);
  };

  return (
    <section className="hero-carousel">
      {/* Left: text column */}
      <div className="hero-carousel__info">
        <p className="hero-carousel__eyebrow">Greenlabs Botanics</p>
        <h1 className="hero-carousel__title">Tu próxima<br />suculenta</h1>
        <h1 className="hero-carousel__title hero-carousel__title--accent">te espera</h1>
        <p className="hero-carousel__subtitle">
          Suculentas seleccionadas con amor en Santiago de los Caballeros.
        </p>

        <div className="hero-carousel__badges">
          <div className="hero-carousel__badge">
            <span className="hero-carousel__badge-number">200+</span>
            <span className="hero-carousel__badge-label">Suculentas</span>
          </div>
          <div className="hero-carousel__badge">
            <span className="hero-carousel__badge-number">15</span>
            <span className="hero-carousel__badge-label">Variedades</span>
          </div>
          <div className="hero-carousel__badge">
            <span className="hero-carousel__badge-number">50+</span>
            <span className="hero-carousel__badge-label">Clientes felices</span>
          </div>
        </div>

        <Link to="/cuestionario" className="hero-carousel__cta">
          <span className="hero-carousel__cta-lead">¿Te gustaría encontrar tu suculenta ideal?</span>
          <span className="hero-carousel__cta-action">Toma este pequeño cuestionario →</span>
        </Link>
      </div>

      {/* Right: image carousel */}
      <div className="hero-carousel__visual">
        <div className="hero-carousel__slides">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`hero-carousel__slide${i === active ? ' hero-carousel__slide--active' : ''}`}
            >
              <img
                src={slide.img}
                alt={slide.label}
                className="hero-carousel__slide-img"
              />
              <span className="hero-carousel__label">{slide.label}</span>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="hero-carousel__dots" role="tablist" aria-label="Imágenes del carrusel">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Imagen ${i + 1}: ${slides[i].label}`}
              className={`hero-carousel__dot${i === active ? ' hero-carousel__dot--active' : ''}`}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
