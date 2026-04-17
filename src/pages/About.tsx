import { WHATSAPP_NUMBER } from '../lib/constants';
import aboutImg from '../../assets/about-oscar.webp';
import '../styles/pages/about.css';

export default function About() {
  const waMessage = encodeURIComponent('Hola! Me gustaría conocer más sobre GREENLABS Botanics.');

  return (
    <div className="about-page">

      {/* Hero Strip */}
      <section className="about-page__hero">
        <img
          src={aboutImg}
          alt="Oscar – GREENLABS Botanics"
          className="about-page__hero-img"
        />
        <div className="about-page__hero-overlay">
          <p className="about-page__hero-eyebrow">Nosotros</p>
          <h1 className="about-page__hero-title">
            Una marca que <span>enseña</span> a cuidar
          </h1>
        </div>
      </section>

      {/* Origin story */}
      <section className="about-page__section about-page__origin">
        <div className="about-page__inner">
          <p className="about-page__eyebrow">Nuestra historia</p>
          <h2 className="about-page__title">
            Nacimos de la <span>pasión</span>
          </h2>
          <p className="about-page__text">
            Greenlabs Botanics nació en Santiago de los Caballeros de las manos de Oscar Junior
            Espinosa, un apasionado de la botánica que descubrió en las suculentas algo más que
            plantas: una forma de conectar personas con la naturaleza en sus espacios cotidianos.
          </p>
          <p className="about-page__text">
            Lo que empezó como una colección personal se convirtió en una marca con propósito:
            democratizar el cuidado de suculentas en la República Dominicana, ofreciendo
            variedades de calidad junto con la educación necesaria para que cada cliente
            tenga éxito en su cuidado.
          </p>
          <p className="about-page__text">
            Cada suculenta que sale de Greenlabs lleva una guía de cuidado personalizada.
            No vendemos suculentas — enseñamos a cuidarlas.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-page__section about-page__mission">
        <div className="about-page__inner">
          <p className="about-page__eyebrow">Misión</p>
          <h2 className="about-page__title">Por qué existimos</h2>
          <blockquote className="about-page__mission-quote">
            "Queremos que cada dominicano tenga una suculenta que ame
            y sepa cuidar."
          </blockquote>
          <p className="about-page__text">
            Nuestra misión es hacer accesible la belleza de las suculentas en hogares,
            oficinas y eventos de toda la región Cibao. Lo hacemos con variedades
            seleccionadas, empaque artesanal y educación botánica práctica.
          </p>
          <p className="about-page__text">
            Creemos que una planta bien cuidada transforma el espacio — y que el conocimiento
            para cuidarla debe venir incluido.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="about-page__section about-page__values">
        <div className="about-page__inner">
          <p className="about-page__eyebrow">Valores</p>
          <h2 className="about-page__title">Lo que nos define</h2>

          <div className="about-page__values-grid">
            {/* Educación */}
            <div className="about-page__value-card">
              <div className="about-page__value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
              </div>
              <h3 className="about-page__value-title">Educación</h3>
              <p className="about-page__value-desc">
                Cada compra incluye guía de cuidado. Compartimos conocimiento porque
                una suculenta bien cuidada es una suculenta feliz.
              </p>
            </div>

            {/* Calidad */}
            <div className="about-page__value-card">
              <div className="about-page__value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="about-page__value-title">Calidad</h3>
              <p className="about-page__value-desc">
                Seleccionamos cada espécimen a mano. Solo vendemos suculentas
                saludables, bien desarrolladas y listas para un nuevo hogar.
              </p>
            </div>

            {/* Sostenibilidad */}
            <div className="about-page__value-card">
              <div className="about-page__value-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22V12M12 12C12 12 7 10 4 6c5 0 8 2 8 6z" />
                  <path d="M12 12C12 12 17 10 20 6c-5 0-8 2-8 6z" />
                </svg>
              </div>
              <h3 className="about-page__value-title">Sostenibilidad</h3>
              <p className="about-page__value-desc">
                Usamos empaque artesanal reutilizable. Las suculentas requieren
                poca agua — son la opción verde más fácil de mantener.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="about-page__section about-page__location">
        <div className="about-page__inner">
          <div className="about-page__location-pin">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Santiago de los Caballeros, República Dominicana
          </div>
          <p className="about-page__eyebrow">Ubicación</p>
          <h2 className="about-page__title">Desde el Cibao para todo el país</h2>
          <p className="about-page__text">
            Operamos desde Santiago de los Caballeros, la segunda ciudad más grande de la
            República Dominicana y corazón de la región Cibao. Coordinamos entregas locales
            y enviamos a todo el país con empaque especial para que tu suculenta llegue perfecta.
          </p>
          <p className="about-page__text">
            ¿Tienes un evento en Santiago o alrededores? Escríbenos para coordinar
            souvenirs personalizados o una visita a nuestra colección.
          </p>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="about-page__cta">
        <h2 className="about-page__cta-title">
          ¿Quieres conocer más sobre <span>Greenlabs</span>?
        </h2>
        <p className="about-page__cta-subtitle">
          Escríbenos por WhatsApp — con gusto te contamos todo.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="about-page__cta-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Escríbenos por WhatsApp
        </a>
      </section>
    </div>
  );
}
