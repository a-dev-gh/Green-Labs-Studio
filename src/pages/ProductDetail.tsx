import { useParams, Link } from 'react-router-dom';
import imgHercules from '../../assets/IMG_6745.JPG.webp';
import imgPerle from '../../assets/IMG_6739.JPG.webp';
import imgOrgyalis from '../../assets/IMG_6743.JPG.webp';
import imgTomentosa from '../../assets/IMG_6744.JPG.webp';
import '../styles/pages/product-detail.css';
import '../styles/components/button.css';

const products: Record<string, any> = {
  'echeveria-hercules': { name: "Echeveria 'Hercules'", category: 'Echeveria', price: 550, img: imgHercules, light: 'Luz directa', water: 'Riego mínimo', desc: 'Una suculenta robusta con rosetas perfectamente simétricas de color verde-azulado con bordes rosados. Ideal para exteriores y coleccionistas.' },
  'echeveria-perle': { name: "Echeveria 'Perle von Nürnberg'", category: 'Echeveria', price: 480, img: imgPerle, light: 'Luz indirecta', water: 'Riego mínimo', desc: 'Roseta elegante con hojas de color púrpura-rosa. Una de las suculentas más populares del mundo.' },
  'kalanchoe-orgyalis': { name: 'Kalanchoe orgyalis', category: 'Kalanchoe', price: 420, img: imgOrgyalis, light: 'Luz directa', water: 'Riego mínimo', desc: 'Conocida como "Copper Spoons" por sus hojas aterciopeladas de color bronce. Nativa de Madagascar.' },
  'kalanchoe-tomentosa': { name: 'Kalanchoe tomentosa', category: 'Kalanchoe', price: 380, img: imgTomentosa, light: 'Luz indirecta', water: 'Riego mínimo', desc: 'La "Panda Plant" con hojas cubiertas de vellosidad plateada y bordes marrones. Perfecta para interiores.' },
  'crassula-ovata': { name: 'Crassula ovata', category: 'Crassula', price: 650, img: null, light: 'Luz indirecta', water: 'Riego moderado', desc: 'El clásico árbol de jade. Crece hasta ser una suculenta imponente con el paso de los años.' },
  'crassula-perforata': { name: 'Crassula perforata', category: 'Crassula', price: 350, img: null, light: 'Luz directa', water: 'Riego mínimo', desc: 'Suculenta apilada con hojas en forma de triángulo. Crece en columnas decorativas.' },
  'sedum-morganianum': { name: 'Sedum morganianum', category: 'Sedum', price: 520, img: null, light: 'Luz directa', water: 'Riego moderado', desc: 'Cola de burro. Una suculenta colgante dramática con hojas que caen en cascada.' },
  'sedum-rubrotinctum': { name: 'Sedum rubrotinctum', category: 'Sedum', price: 300, img: null, light: 'Luz directa', water: 'Riego mínimo', desc: 'Conocida como "Jelly Bean Plant". Las hojas se tornan rojas con el sol.' },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products[slug || ''];

  if (!product) {
    return (
      <div className="product-detail product-detail--empty">
        <h1>Suculenta no encontrada</h1>
        <Link to="/catalogo" className="btn btn--primary">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Link to="/catalogo" className="product-detail__back">← Volver al catálogo</Link>
      <div className="product-detail__grid">
        <div className="product-detail__image-wrap">
          {product.img ? (
            <img src={product.img} alt={product.name} className="product-detail__image" />
          ) : (
            <div className="product-detail__placeholder">{product.name.charAt(0)}</div>
          )}
        </div>
        <div className="product-detail__info">
          <p className="product-detail__category">{product.category}</p>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">RD$ {product.price}</p>
          <p className="product-detail__desc">{product.desc}</p>

          <div className="product-detail__care">
            <div className="product-detail__care-item">
              <span className="product-detail__care-icon">☀️</span>
              <span>{product.light}</span>
            </div>
            <div className="product-detail__care-item">
              <span className="product-detail__care-icon">💧</span>
              <span>{product.water}</span>
            </div>
          </div>

          <div className="product-detail__actions">
            <button className="btn btn--primary btn--lg btn--full">Agregar al carrito</button>
            <a href="#" className="btn btn--whatsapp btn--lg btn--full">Pedir por WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
