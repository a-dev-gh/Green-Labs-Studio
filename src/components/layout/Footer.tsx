import { Link } from 'react-router-dom';
import '../../styles/components/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <div className="footer__logo">G</div>
        <span className="footer__name">GREENLABS BOTANICS</span>
      </div>
      <p className="footer__location">Santiago de los Caballeros, República Dominicana</p>
      <div className="footer__links">
        <a href="https://instagram.com/greenlabs_studio" target="_blank" rel="noopener noreferrer" className="footer__link">Instagram</a>
        <a href="#" className="footer__link">WhatsApp</a>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2026 Greenlabs Botanics &middot; Creado por{' '}
          <a href="https://alexander.ad" target="_blank" rel="noopener noreferrer" className="footer__credit">adrian alexander</a>
        </p>
      </div>
    </footer>
  );
}
