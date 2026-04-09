import { useState } from 'react';
import { Link } from 'react-router-dom';
import imgHercules from '../../assets/IMG_6745.JPG.webp';
import imgPerle from '../../assets/IMG_6739.JPG.webp';
import imgOrgyalis from '../../assets/IMG_6743.JPG.webp';
import imgTomentosa from '../../assets/IMG_6744.JPG.webp';
import '../styles/pages/catalog.css';
import '../styles/pages/landing.css';

const categories = ['Todas', 'Echeveria', 'Kalanchoe', 'Crassula', 'Sedum'];

const allProducts = [
  { slug: 'echeveria-hercules', name: "Echeveria 'Hercules'", category: 'Echeveria', price: 550, img: imgHercules, light: 'high', water: 'low' },
  { slug: 'echeveria-perle', name: "Echeveria 'Perle von Nürnberg'", category: 'Echeveria', price: 480, img: imgPerle, light: 'medium', water: 'low' },
  { slug: 'kalanchoe-orgyalis', name: 'Kalanchoe orgyalis', category: 'Kalanchoe', price: 420, img: imgOrgyalis, light: 'high', water: 'low' },
  { slug: 'kalanchoe-tomentosa', name: 'Kalanchoe tomentosa', category: 'Kalanchoe', price: 380, img: imgTomentosa, light: 'medium', water: 'low' },
  { slug: 'crassula-ovata', name: 'Crassula ovata', category: 'Crassula', price: 650, img: null, light: 'medium', water: 'moderate' },
  { slug: 'crassula-perforata', name: 'Crassula perforata', category: 'Crassula', price: 350, img: null, light: 'high', water: 'low' },
  { slug: 'sedum-morganianum', name: 'Sedum morganianum', category: 'Sedum', price: 520, img: null, light: 'high', water: 'moderate' },
  { slug: 'sedum-rubrotinctum', name: 'Sedum rubrotinctum', category: 'Sedum', price: 300, img: null, light: 'high', water: 'low' },
];

export default function Catalog() {
  const [active, setActive] = useState('Todas');
  const filtered = active === 'Todas' ? allProducts : allProducts.filter(p => p.category === active);

  return (
    <div className="catalog">
      <h1 className="catalog__title">Catálogo</h1>
      <p className="catalog__subtitle">Suculentas seleccionadas con guía de cuidado incluida</p>

      <div className="catalog__pills">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`catalog__pill ${active === cat ? 'catalog__pill--active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="catalog__grid">
        {filtered.map(p => (
          <Link to={`/catalogo/${p.slug}`} key={p.slug} className="product-card">
            <div className="product-card__image-wrap">
              {p.img ? (
                <img src={p.img} alt={p.name} className="product-card__image" />
              ) : (
                <div className="product-card__placeholder">{p.name.charAt(0)}</div>
              )}
            </div>
            <div className="product-card__body">
              <h3 className="product-card__name">{p.name}</h3>
              <p className="product-card__scientific">{p.category}</p>
              <div className="product-card__footer">
                <span className="product-card__price">RD$ {p.price}</span>
                <div className="product-card__add">+</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
