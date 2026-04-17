import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import hero1 from '../../../assets/hero-1.webp';
import hero2 from '../../../assets/hero-2.webp';
import hero3 from '../../../assets/hero-3.webp';
import hero4 from '../../../assets/hero-4.webp';
import { useCountUp } from '../../hooks/useCountUp';
import '../../styles/components/hero-carousel.css';

/* Editorial two-liner labels per slide */
const slides = [
  { img: hero1, kicker: 'Sobre la mesa',    line: 'Una compañía serena para tu café' },
  { img: hero2, kicker: 'En el baño',       line: 'Verde donde menos lo esperas' },
  { img: hero3, kicker: 'Entre tus libros', line: 'Pausa viva entre páginas' },
  { img: hero4, kicker: 'En la cocina',     line: 'Textura que despierta los sentidos' },
];

const SLIDE_INTERVAL = 5000;
const PAUSE_AFTER_CLICK = 10000;

export default function HeroCarousel() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(Date.now());
  const carouselRef = useRef<HTMLElement>(null);

  /* Count-up badge values */
  const n1 = useCountUp(200);
  const n2 = useCountUp(15);
  const n3 = useCountUp(50);

  /* Auto-rotation via rAF */
  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    startedAtRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startedAtRef.current;
      if (elapsed >= SLIDE_INTERVAL) {
        setActive(prev => (prev + 1) % slides.length);
        startedAtRef.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, paused, prefersReducedMotion]);

  /* Reset timer start on slide change */
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, [active]);

  /* Navigate to slide (click/keyboard) — pauses temporarily */
  const goTo = useCallback((index: number) => {
    setActive(index);
    setPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPaused(false), PAUSE_AFTER_CLICK);
  }, []);

  /* Keyboard arrow navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo((active + 1) % slides.length);
      else if (e.key === 'ArrowLeft') goTo((active - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  /* Cursor parallax on desktop */
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = carouselRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: nx, y: ny });
  };

  /* Scroll-hint visibility: hide after 200px scroll */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Pause on hover + reset parallax on leave */
  const onHoverEnter = () => setPaused(true);
  const onHoverLeave = (e: React.MouseEvent<HTMLElement>) => {
    setParallax({ x: 0, y: 0 });
    if (!carouselRef.current?.contains(e.relatedTarget as Node)) {
      setPaused(false);
    }
  };

  return (
    <section
      id="hero"
      className="hero-carousel"
      ref={carouselRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onHoverLeave}
      onMouseEnter={onHoverEnter}
    >
      {/* Full-bleed slides */}
      <div
        className="hero-carousel__slides"
        style={{
          transform: `translate3d(${parallax.x * -10}px, ${parallax.y * -10}px, 0)`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-carousel__slide${i === active ? ' hero-carousel__slide--active' : ''}`}
          >
            <img
              src={slide.img}
              alt={slide.kicker}
              className="hero-carousel__slide-img"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Glass card — left-center floating panel */}
      <div className="hero-carousel__info">
        <p className="hero-carousel__eyebrow">Greenlabs Botanics</p>
        <h1 className="hero-carousel__title">Tu próxima<br />suculenta</h1>
        <h2 className="hero-carousel__title hero-carousel__title--accent">te espera</h2>
        <p className="hero-carousel__subtitle">
          Suculentas seleccionadas con amor en Santiago de los Caballeros.
        </p>

        <div className="hero-carousel__badges">
          <div className="hero-carousel__badge">
            <span className="hero-carousel__badge-number">
              <span>{n1}</span>+
            </span>
            <span className="hero-carousel__badge-label">Suculentas</span>
          </div>
          <div className="hero-carousel__badge">
            <span className="hero-carousel__badge-number">
              <span>{n2}</span>
            </span>
            <span className="hero-carousel__badge-label">Variedades</span>
          </div>
          <div className="hero-carousel__badge">
            <span className="hero-carousel__badge-number">
              <span>{n3}</span>+
            </span>
            <span className="hero-carousel__badge-label">Clientes felices</span>
          </div>
        </div>

        <Link to="/cuestionario" className="hero-carousel__cta">
          <span className="hero-carousel__cta-lead">¿Te gustaría encontrar tu suculenta ideal?</span>
          <span className="hero-carousel__cta-action">Toma este pequeño cuestionario →</span>
        </Link>
      </div>

      {/* Editorial two-line label — bottom-right, spring-in on slide change */}
      <div key={active} className="hero-carousel__label" aria-hidden="true">
        <span className="hero-carousel__label-kicker">{slides[active].kicker}</span>
        <span className="hero-carousel__label-line">{slides[active].line}</span>
      </div>

      {/* Thumbnail dots — bottom-left corner */}
      <div className="hero-carousel__dots" role="tablist" aria-label="Imágenes del carrusel">
        {slides.map((slide, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Imagen ${i + 1}: ${slide.kicker}`}
            className={`hero-carousel__dot${i === active ? ' hero-carousel__dot--active' : ''}`}
            onClick={() => goTo(i)}
          >
            <img src={slide.img} alt="" className="hero-carousel__dot-thumb" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Ambient progress line — remounted on each slide via key to restart animation */}
      <div
        key={`line-${active}`}
        className={`hero-carousel__progress-line${paused ? ' is-paused' : ''}`}
        aria-hidden="true"
      />

      {/* Scroll hint chevron */}
      <div
        className={`hero-carousel__scroll-hint${scrolled ? ' hero-carousel__scroll-hint--hidden' : ''}`}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
