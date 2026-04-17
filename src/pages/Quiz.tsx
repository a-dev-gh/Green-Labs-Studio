import { Link } from 'react-router-dom';
import SucculentQuiz from '../components/landing/SucculentQuiz';
import '../styles/pages/quiz.css';

export default function Quiz() {
  return (
    <div className="quiz-page">
      <header className="quiz-page__header">
        <p className="quiz-page__eyebrow">Cuestionario</p>
        <h1 className="quiz-page__title">Encuentra tu suculenta ideal</h1>
        <p className="quiz-page__intro">
          Responde 4 preguntas rápidas sobre tu espacio y hábitos de cuidado.
          Te recomendaremos la suculenta perfecta para ti.
        </p>
      </header>

      <main className="quiz-page__body">
        <SucculentQuiz />
      </main>

      <footer className="quiz-page__footer">
        <p className="quiz-page__footer-text">
          ¿Prefieres explorar por tu cuenta?{' '}
          <Link to="/catalogo" className="quiz-page__footer-link">
            Ver todo el catálogo →
          </Link>
        </p>
      </footer>
    </div>
  );
}
