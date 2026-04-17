import { useEffect } from 'react';
import { useServices } from '../hooks/useServices';
import { generateServiceInquiryLink } from '../lib/whatsapp';
import servicesPotted from '../../assets/services-potted.webp';
import souvenirGift from '../../assets/souvenir-gift-wrap.webp';
import souvenirCollection from '../../assets/souvenir-collection.webp';
import '../styles/pages/services.css';

/** Fallback images for when DB rows have empty images array */
const FALLBACK_IMAGES = [souvenirGift, souvenirCollection, servicesPotted];

export default function Services() {
  const { items, isLoading } = useServices();

  // Re-fire reveal animations when services load
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        entries => entries.forEach(e => {
          const dir = (e.target as HTMLElement).dataset.reveal;
          if (e.isIntersecting) {
            if (dir) e.target.classList.add('is-in');
          } else {
            e.target.classList.remove('is-in');
          }
        }),
        { threshold: 0.08 }
      );
      document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [items]);

  // Determine which services to render — DB data or a helpful loading state
  const showItems = !isLoading && items.length > 0;

  return (
    <div className="services-page">
      {/* Hero */}
      <header className="services-page__hero">
        <p className="services-page__eyebrow">Servicios</p>
        <h1 className="services-page__title">
          Suculentas para tus <span className="services-page__title-accent">eventos</span>
        </h1>
        <p className="services-page__hero-text">
          Creamos souvenirs únicos con suculentas para todo tipo de eventos. Cada pieza es
          seleccionada y preparada con amor para que tus invitados se lleven un recuerdo vivo.
        </p>
      </header>

      {/* Loading state */}
      {isLoading && (
        <div className="services-page__loading">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="services-page__skeleton" />
          ))}
        </div>
      )}

      {/* Alternating full-bleed sections */}
      {showItems && items.map((service, index) => {
        const isReverse = index % 2 !== 0;
        const bgImage = service.images[0] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
        const reveal = isReverse ? 'right' : 'left';

        return (
          <section
            key={service.id}
            className={`services-section${isReverse ? ' services-section--reverse' : ''}`}
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="services-section__scrim" />
            <div
              className="services-section__panel"
              data-reveal={reveal}
            >
              <p className="services-section__eyebrow">Servicio</p>
              <h2 className="services-section__name">{service.name}</h2>
              {service.description && (
                <p className="services-section__desc">{service.description}</p>
              )}
              {service.price_range && (
                <p className="services-section__price">{service.price_range}</p>
              )}
              <a
                href={generateServiceInquiryLink(service.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="services-section__cta"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </section>
        );
      })}

      {/* Empty DB state */}
      {!isLoading && items.length === 0 && (
        <div className="services-page__empty">
          <p>Los servicios se cargarán pronto.</p>
        </div>
      )}
    </div>
  );
}
