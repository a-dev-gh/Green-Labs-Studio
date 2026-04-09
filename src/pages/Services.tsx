import { Link } from 'react-router-dom';
import '../styles/pages/services.css';
import '../styles/components/button.css';

const packages = [
  { icon: '💍', name: 'Boda', desc: 'Suculentas elegantes como recuerdo para tus invitados. Personalizadas con etiquetas y macetas decorativas.', price: 'RD$ 250/u', min: 'Mínimo 20 unidades' },
  { icon: '🎂', name: 'Cumpleaños', desc: 'Mini suculentas perfectas como souvenirs de cumpleaños. Variedad de especies y presentaciones.', price: 'RD$ 200/u', min: 'Mínimo 10 unidades' },
  { icon: '🏢', name: 'Corporativo', desc: 'Suculentas premium para eventos empresariales, conferencias y regalos corporativos.', price: 'RD$ 350/u', min: 'Mínimo 15 unidades' },
];

export default function Services() {
  return (
    <div className="services">
      <div className="services__hero">
        <p className="services__eyebrow">Servicios</p>
        <h1 className="services__title">
          Suculentas para tus <span className="services__title-accent">eventos</span>
        </h1>
        <p className="services__hero-text">
          Creamos souvenirs únicos con suculentas para todo tipo de eventos. Cada pieza es seleccionada y preparada con amor para que tus invitados se lleven un recuerdo vivo.
        </p>
      </div>

      <h2 className="services__section-title">Paquetes de Souvenirs</h2>
      <div className="services__grid">
        {packages.map((pkg, i) => (
          <div key={i} className="service-card">
            <div className="service-card__icon">{pkg.icon}</div>
            <h3 className="service-card__name">{pkg.name}</h3>
            <p className="service-card__desc">{pkg.desc}</p>
            <p className="service-card__price">{pkg.price}</p>
            <p className="service-card__min">{pkg.min}</p>
            <a href="#" className="btn btn--whatsapp btn--full">Consultar por WhatsApp</a>
          </div>
        ))}
      </div>

      <div className="services__extra">
        <div className="service-card">
          <div className="service-card__icon">🌱</div>
          <h3 className="service-card__name">Asesoría de Cuidado</h3>
          <p className="service-card__desc">
            ¿Nuevas con suculentas? Te enseñamos todo lo que necesitas saber para mantener tus suculentas sanas y hermosas. Consulta personalizada virtual o presencial.
          </p>
          <p className="service-card__price">Consulta gratuita</p>
          <a href="#" className="btn btn--outline btn--full">Agendar consulta</a>
        </div>
      </div>
    </div>
  );
}
