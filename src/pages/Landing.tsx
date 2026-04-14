import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SucculentQuiz from '../components/landing/SucculentQuiz';
import TestimonialForm from '../components/landing/TestimonialForm';
import { useAuth } from '../core/auth/useAuth';
import heroImg from '../../assets/hero-oscar.webp';
import aboutImg from '../../assets/about-oscar.webp';
import imgHercules from '../../assets/echeveria-hercules.webp';
import imgPerle from '../../assets/echeveria-perle.webp';
import imgOrgyalis from '../../assets/kalanchoe-orgyalis.webp';
import imgTomentosa from '../../assets/kalanchoe-tomentosa.webp';
import souvenirGift from '../../assets/souvenir-gift-wrap.webp';
import souvenirCollection from '../../assets/souvenir-collection.webp';
import servicesPotted from '../../assets/services-potted.webp';
import '../styles/pages/landing.css';

const products = [
  { name: "Echeveria 'Hercules'", scientific: 'Echeveria', price: 'RD$ 550', img: imgHercules },
  { name: "Echeveria 'Perle von Nürnberg'", scientific: 'Echeveria', price: 'RD$ 480', img: imgPerle },
  { name: 'Kalanchoe orgyalis', scientific: 'Kalanchoe', price: 'RD$ 420', img: imgOrgyalis },
  { name: 'Kalanchoe tomentosa', scientific: 'Kalanchoe', price: 'RD$ 380', img: imgTomentosa },
];

const testimonials = [
  { text: 'Mis suculentas llegaron perfectas. El empaque fue increíble.', name: 'María R.' },
  { text: 'Greenlabs me enseñó a cuidar mis suculentas. Ahora tengo 12.', name: 'Carlos M.' },
  { text: 'La mejor tienda de suculentas en Santiago.', name: 'Ana P.' },
];


function CanvasBackground({ scrollProgress, darkBlend }: { scrollProgress: number; darkBlend: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    cv.width = vw * dpr;
    cv.height = vh * dpr;
    cv.style.width = vw + 'px';
    cv.style.height = vh + 'px';
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, vw, vh);

    const cx = vw / 2;
    const baseY = vh + 20;
    const blend = darkBlend * darkBlend * (3 - 2 * darkBlend); // smoothstep

    const leaves = [
      { angle: -62, len: vh * 0.55, w: vh * 0.09, rgb: [82, 183, 136], t: -1, preGrown: true },
      { angle: 62, len: vh * 0.53, w: vh * 0.085, rgb: [82, 183, 136], t: -1, preGrown: true },
      { angle: -33, len: vh * 0.48, w: vh * 0.08, rgb: [64, 145, 108], t: 0.08 },
      { angle: 33, len: vh * 0.46, w: vh * 0.075, rgb: [64, 145, 108], t: 0.12 },
      { angle: -8, len: vh * 0.42, w: vh * 0.07, rgb: [45, 106, 79], t: 0.28 },
      { angle: 8, len: vh * 0.40, w: vh * 0.065, rgb: [45, 106, 79], t: 0.33 },
    ];

    leaves.forEach(lf => {
      let ease = 1;
      if (!lf.preGrown) {
        if (scrollProgress < lf.t) return;
        const lp = Math.min(1, (scrollProgress - lf.t) / 0.12);
        ease = 1 - Math.pow(1 - lp, 3);
      }
      const rad = (lf.angle * Math.PI) / 180;
      const cLen = lf.len * ease;
      const cW = lf.w * ease;
      const tipX = cx + Math.sin(rad) * cLen;
      const tipY = baseY - Math.cos(rad) * cLen;
      const px = Math.cos(rad), py = Math.sin(rad);
      const mx = cx + Math.sin(rad) * cLen * 0.45;
      const my = baseY - Math.cos(rad) * cLen * 0.45;

      ctx.beginPath();
      ctx.moveTo(cx, baseY);
      ctx.quadraticCurveTo(mx + px * cW, my + py * cW, tipX, tipY);
      ctx.quadraticCurveTo(mx - px * cW, my - py * cW, cx, baseY);
      ctx.closePath();

      const [r, g, b] = lf.rgb;
      const lr = r + (240 - r) * blend;
      const lg = g + (248 - g) * blend;
      const lb = b + (244 - b) * blend;

      const grad = ctx.createLinearGradient(cx, baseY, tipX, tipY);
      grad.addColorStop(0, `rgba(${lr},${lg},${lb},0.75)`);
      grad.addColorStop(0.5, `rgba(${lr},${lg},${lb},0.55)`);
      grad.addColorStop(1, `rgba(${lr},${lg},${lb},0.25)`);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = `rgba(${lr},${lg},${lb},0.35)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      if (ease > 0.25) {
        ctx.beginPath();
        ctx.moveTo(cx, baseY);
        ctx.lineTo(cx + Math.sin(rad) * cLen * 0.8, baseY - Math.cos(rad) * cLen * 0.8);
        const va = blend > 0.5 ? 0.3 : 0.2;
        ctx.strokeStyle = blend > 0.5 ? `rgba(255,255,255,${va})` : `rgba(216,243,220,${va})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (ease > 0.45) {
          for (let v = 0.2; v < 0.65; v += 0.15) {
            const vx = cx + Math.sin(rad) * cLen * v;
            const vy = baseY - Math.cos(rad) * cLen * v;
            ctx.beginPath(); ctx.moveTo(vx, vy);
            ctx.lineTo(vx + px * cW * 0.4, vy + py * cW * 0.4);
            ctx.strokeStyle = blend > 0.5 ? 'rgba(255,255,255,0.15)' : 'rgba(216,243,220,0.12)';
            ctx.lineWidth = 0.6; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(vx, vy);
            ctx.lineTo(vx - px * cW * 0.4, vy - py * cW * 0.4);
            ctx.stroke();
          }
        }
      }
    });

    // Center bud
    const budR = 45 + (220 - 45) * blend;
    const budG = 106 + (230 - 106) * blend;
    const budB = 79 + (225 - 79) * blend;
    ctx.beginPath(); ctx.ellipse(cx, baseY, 20, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${budR},${budG},${budB},0.4)`; ctx.fill();
  }, [scrollProgress, darkBlend]);

  return <canvas ref={ref} className="canvas-bg" />;
}

export default function Landing() {
  const { user } = useAuth();
  const [scrollProg, setScrollProg] = useState(0);
  const [darkBlend, setDarkBlend] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [testimonialFormOpen, setTestimonialFormOpen] = useState(false);
  const testiRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const prog = totalHeight > 0 ? window.scrollY / totalHeight : 0;
    setScrollProg(Math.max(0, Math.min(1, prog)));

    if (testiRef.current) {
      const rect = testiRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;
      const end = vh * 0.4;
      const raw = 1 - (rect.top - end) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      const quantized = Math.round(clamped * 100) / 100;
      setDarkBlend(quantized);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  // Scroll reveal observer for services slide-in + general reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const dir = (e.target as HTMLElement).dataset.reveal;
          if (dir === 'left') e.target.classList.add('reveal--left', 'is-visible');
          else if (dir === 'right') e.target.classList.add('reveal--right', 'is-visible');
          else e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    const t = setTimeout(() => {
      document.querySelectorAll('[data-reveal], .reveal').forEach(el => observer.observe(el));
    }, 200);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <CanvasBackground scrollProgress={scrollProg} darkBlend={darkBlend} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="hero">
          {/* Left: Oscar */}
          <div className="hero__visual">
            <div className="hero__oscar-wrap">
              <img src={heroImg} alt="Oscar - GREENLABS" className="hero__oscar" />
            </div>
          </div>

          {/* Right: text + quiz pill */}
          <div className="hero__info">
            <p className="hero__eyebrow">Greenlabs Botanics</p>
            <h1 className="hero__title">Tu próxima<br />suculenta</h1>
            <h1 className="hero__title hero__title--accent">te espera</h1>
            <p className="hero__subtitle">
              Suculentas seleccionadas con amor en Santiago de los Caballeros.
            </p>

            <div className="hero__badges">
              <div className="hero__badge">
                <span className="hero__badge-number">200+</span>
                <span className="hero__badge-label">Suculentas</span>
              </div>
              <div className="hero__badge">
                <span className="hero__badge-number">15</span>
                <span className="hero__badge-label">Variedades</span>
              </div>
              <div className="hero__badge">
                <span className="hero__badge-number">50+</span>
                <span className="hero__badge-label">Clientes felices</span>
              </div>
            </div>

            <button className="hero__cta" onClick={() => setQuizOpen(true)}>
              <span className="hero__cta-lead">¿Te gustaría encontrar tu suculenta ideal?</span>
              <span className="hero__cta-action">Toma este pequeño cuestionario →</span>
            </button>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="how-it-works__inner">
            <p className="how-it-works__eyebrow">Cómo funciona</p>
            <h2 className="how-it-works__title">3 pasos para tu <span className="how-it-works__title-accent">suculenta</span></h2>
            <div className="how-it-works__grid">
              <div className="how-it-works__step reveal reveal--delay-1">
                <div className="how-it-works__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                </div>
                <h3 className="how-it-works__step-title">Elige</h3>
                <p className="how-it-works__step-desc">Explora nuestro catálogo o toma el cuestionario para encontrar tu suculenta ideal.</p>
              </div>
              <div className="how-it-works__step reveal reveal--delay-2">
                <div className="how-it-works__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                  </svg>
                </div>
                <h3 className="how-it-works__step-title">Pide</h3>
                <p className="how-it-works__step-desc">Escríbenos por WhatsApp y coordinamos tu pedido con empaque personalizado.</p>
              </div>
              <div className="how-it-works__step reveal reveal--delay-3">
                <div className="how-it-works__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V12M12 12C12 12 7 10 4 6c5 0 8 2 8 6z" />
                    <path d="M12 12C12 12 17 10 20 6c-5 0-8 2-8 6z" />
                  </svg>
                </div>
                <h3 className="how-it-works__step-title">Disfruta</h3>
                <p className="how-it-works__step-desc">Recibe tu suculenta con guía de cuidado incluida. ¡Lista para transformar tu espacio!</p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="about">
          <div className="about__inner">
            <p className="about__eyebrow">Nosotros</p>
            <h2 className="about__title">
              Una marca que enseña a <span className="about__title-accent">cuidar</span>
            </h2>
            <div className="about__grid">
              <div>
                <p className="about__text">
                  Greenlabs Botanics nació de la pasión por las suculentas y la educación botánica. Cada suculenta viene con una guía de cuidado personalizada.
                </p>
                <p className="about__text">
                  Desde Santiago de los Caballeros, cultivamos y seleccionamos las mejores variedades para que tu espacio cobre vida.
                </p>
                <div className="about__stats">
                  {[{ n: '200+', l: 'Suculentas' }, { n: '50+', l: 'Clientes' }, { n: '15', l: 'Variedades' }].map((s, i) => (
                    <div key={i}>
                      <div className="about__stat-number">{s.n}</div>
                      <div className="about__stat-label">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <img src={aboutImg} alt="Oscar - GREENLABS" className="about__photo float" />
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="featured">
          <div className="featured__inner">
            <p className="featured__eyebrow">Catálogo</p>
            <h2 className="featured__title">
              Nuestras <span className="featured__title-accent">suculentas</span>
            </h2>
            <p className="featured__desc">Seleccionadas a mano con guía de cuidado incluida.</p>
            <div className="featured__grid">
              {products.map((p, i) => (
                <div key={i} className="product-card tilt-card">
                  <div className="product-card__image-wrap">
                    <img src={p.img} alt={p.name} className="product-card__image" />
                  </div>
                  <div className="product-card__body">
                    <h3 className="product-card__name">{p.name}</h3>
                    <p className="product-card__scientific">{p.scientific}</p>
                    <div className="product-card__footer">
                      <span className="product-card__price">{p.price}</span>
                      <div className="product-card__add">+</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Souvenir Sections */}
        <section className="souvenir-mini">
          <div className="souvenir-mini__inner">
            <p className="souvenir-mini__eyebrow">Servicio</p>
            <h2 className="souvenir-mini__title">
              Suculentas para tus <span className="souvenir-mini__title-accent">eventos</span>
            </h2>
          </div>

          <div className="souvenir-section" data-reveal="left">
            <div className="souvenir-section__img-wrap">
              <img src={souvenirGift} alt="Souvenirs para Bodas" className="souvenir-section__img" />
            </div>
            <div className="souvenir-section__content">
              <h3 className="souvenir-section__name">Bodas</h3>
              <p className="souvenir-section__desc">
                Suculentas elegantes como recuerdo para tus invitados. Personalizadas con etiquetas, macetas decorativas y empaque artesanal.
              </p>
              <p className="souvenir-section__price">Desde RD$ 250/unidad</p>
              <p className="souvenir-section__min">Mínimo 20 unidades</p>
            </div>
          </div>

          <div className="souvenir-section souvenir-section--reverse" data-reveal="right">
            <div className="souvenir-section__img-wrap">
              <img src={souvenirCollection} alt="Souvenirs para Cumpleaños" className="souvenir-section__img" />
            </div>
            <div className="souvenir-section__content">
              <h3 className="souvenir-section__name">Cumpleaños</h3>
              <p className="souvenir-section__desc">
                Mini suculentas perfectas como souvenirs de cumpleaños. Variedad de especies y presentaciones para cualquier temática.
              </p>
              <p className="souvenir-section__price">Desde RD$ 200/unidad</p>
              <p className="souvenir-section__min">Mínimo 10 unidades</p>
            </div>
          </div>

          <div className="souvenir-section" data-reveal="left">
            <div className="souvenir-section__img-wrap">
              <img src={servicesPotted} alt="Souvenirs Corporativos" className="souvenir-section__img" />
            </div>
            <div className="souvenir-section__content">
              <h3 className="souvenir-section__name">Corporativo</h3>
              <p className="souvenir-section__desc">
                Suculentas premium para eventos empresariales, conferencias y regalos corporativos. Presentación ejecutiva con branding personalizado.
              </p>
              <p className="souvenir-section__price">Desde RD$ 350/unidad</p>
              <p className="souvenir-section__min">Mínimo 15 unidades</p>
            </div>
          </div>

          <div className="souvenir-mini__inner">
            <Link to="/servicios" className="souvenir-mini__cta">Ver todos los paquetes →</Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials" ref={testiRef}>
          <div className="testimonials__inner">
            <p className="testimonials__eyebrow">Testimonios</p>
            <h2 className="testimonials__title">
              Lo que dicen nuestros <span className="testimonials__title-accent">clientes</span>
            </h2>
            <div className="testimonials__cards">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonials__card">
                  <div className="testimonials__card-stars">{'★'.repeat(5)}</div>
                  <p className="testimonials__card-quote">"{t.text}"</p>
                  <p className="testimonials__card-author">{t.name}</p>
                </div>
              ))}
            </div>
            <button
              className="testimonials__share-btn"
              onClick={() => user ? setTestimonialFormOpen(true) : window.location.assign('/auth/login')}
            >
              Comparte tu experiencia
            </button>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="wa-cta">
          <h2 className="wa-cta__title">
            ¿Lista para tu primera <span className="wa-cta__title-accent">suculenta</span>?
          </h2>
          <p className="wa-cta__subtitle">Escríbenos y te ayudamos a elegir.</p>
          <a href={`https://wa.me/18495252430?text=${encodeURIComponent('Hola! Me interesan las suculentas de GREENLABS')}`} target="_blank" rel="noopener noreferrer" className="wa-cta__btn">Escríbenos por WhatsApp</a>
        </section>
      </div>

      {quizOpen && <SucculentQuiz onClose={() => setQuizOpen(false)} />}
      {testimonialFormOpen && (
        <TestimonialForm
          onClose={() => setTestimonialFormOpen(false)}
          onSubmit={(data) => {
            // TODO: Insert into Supabase when credentials are available
            console.log('Testimonial submitted:', data);
          }}
        />
      )}
    </div>
  );
}
