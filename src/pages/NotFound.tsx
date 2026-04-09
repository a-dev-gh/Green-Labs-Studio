import { Link } from 'react-router-dom';
import '../styles/pages/not-found.css';
import '../styles/components/button.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h1 className="not-found__title">Página no encontrada</h1>
      <p className="not-found__text">La página que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn--primary btn--lg">Volver al inicio</Link>
    </div>
  );
}
