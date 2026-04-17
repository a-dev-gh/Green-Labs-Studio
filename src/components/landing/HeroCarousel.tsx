import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import hero1 from '../../../assets/hero-1.webp';
import hero2 from '../../../assets/hero-2.webp';
import hero3 from '../../../assets/hero-3.webp';
import hero4 from '../../../assets/hero-4.webp';
import '../../styles/components/hero-carousel.css';

const slides = [
  { img: hero1, label: 'En la mesa' },
  { img: hero2, label: 'En el baño' },
  { img: hero3, label: 'En la biblioteca' },
  { img: hero4, label: 'En la cocina' },
];

const SLIDE_INTERVAL = 5000;
const PAUSE_AFTER_CLICK = 10000;

export default function HeroCarousel() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 for ring
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  // Auto-rotation + progress ring, ticked via rAF for smooth fill
  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    startedAtRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startedAtRef.current;
      const p = Math.min(1, elapsed / SLIDE_INTERVAL);
      setProgress(p);
      if (p >= 1) {
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

  // Reset ring each time `active` changes (including from a click)
  useEffect(() => {
    setProgress(0);
    startedAtRef.current = Date.now();
  }, [active]);

  const goTo = useCallback((index: number) => {
    setActive(index);
    setPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPaused(false), PAUSE_AFTER_CLICK);
  }, []);

  // Keyboard arrow navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo((active + 1) % slides.length);
      else if (e.key === 'ArrowLeft') goTo((active - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  // Cursor parallax on desktop only
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = visualRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5..0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: nx, y: ny });
  };

  const onMouseLeave = () => setParallax({ x: 0, y: 0 });

  const ringCircumference = 2 * Math.PI * 9; // radius 9
  const ringOffset = ringCircumference * (1 - progress);

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
      <div
        className="hero-carousel__visual"
        ref={visualRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={() => setPaused(true)}
        onMouseOut={(e) => {
          // resume only when truly leaving the visual area
          if (!visualRef.current?.contains(e.relatedTarget as Node)) {
            setPaused(false);
          }
        }}
      >
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
                alt={slide.label}
                className="hero-carousel__slide-img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Slide counter */}
        <div className="hero-carousel__counter">
          <span className="hero-carousel__counter-current">{String(active + 1).padStart(2, '0')}</span>
          <span className="hero-carousel__counter-divider" />
          <span className="hero-carousel__counter-total">{String(slides.length).padStart(2, '0')}</span>
        </div>

        {/* Label pill */}
        <span key={active} className="hero-carousel__label">
          {slides[active].label}
        </span>

        {/* Bottom control bar: progress ring + dots */}
        <div className="hero-carousel__controls">
          {/* Progress ring shows time to next slide */}
          <div className="hero-carousel__progress" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" className="hero-carousel__progress-track" />
              <circle
                cx="12"
                cy="12"
                r="9"
                className="hero-carousel__progress-fill"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
              />
            </svg>
          </div>

          {/* Dot indicators with thumbnail peek */}
          <div className="hero-carousel__dots" role="tablist" aria-label="Imágenes del carrusel">
            {slides.map((slide, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`Imagen ${i + 1}: ${slide.label}`}
                className={`hero-carousel__dot${i === active ? ' hero-carousel__dot--active' : ''}`}
                onClick={() => goTo(i)}
              >
                <img src={slide.img} alt="" className="hero-carousel__dot-thumb" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
