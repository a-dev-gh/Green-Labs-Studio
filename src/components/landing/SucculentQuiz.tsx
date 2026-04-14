import { useState } from 'react';
import { Link } from 'react-router-dom';
import imgHercules from '../../../assets/echeveria-hercules.webp';
import imgPerle from '../../../assets/echeveria-perle.webp';
import imgOrgyalis from '../../../assets/kalanchoe-orgyalis.webp';
import imgTomentosa from '../../../assets/kalanchoe-tomentosa.webp';
import '../../styles/components/quiz.css';

interface Question {
  title: string;
  subtitle: string;
  options: { label: string; icon: string; scores: Record<string, number> }[];
}

const questions: Question[] = [
  {
    title: '¿Cuánta luz recibe tu espacio?',
    subtitle: 'Paso 1 de 4 — Iluminación',
    options: [
      { label: 'Sol directo', icon: '☀️', scores: { bright: 3, lowLight: 0 } },
      { label: 'Luz indirecta', icon: '⛅', scores: { bright: 1, lowLight: 1 } },
      { label: 'Poca luz', icon: '🌙', scores: { bright: 0, lowLight: 3 } },
    ],
  },
  {
    title: '¿Con qué frecuencia quieres regar?',
    subtitle: 'Paso 2 de 4 — Cuidado',
    options: [
      { label: 'Casi nunca', icon: '🏜️', scores: { lowWater: 3, easycare: 2 } },
      { label: 'Semanal', icon: '💧', scores: { lowWater: 1, easycare: 1 } },
      { label: 'Frecuente', icon: '🌊', scores: { lowWater: 0, easycare: 0 } },
    ],
  },
  {
    title: '¿Dónde vivirá tu suculenta?',
    subtitle: 'Paso 3 de 4 — Espacio',
    options: [
      { label: 'Escritorio', icon: '🖥️', scores: { compact: 3, lowLight: 1 } },
      { label: 'Ventana', icon: '🪟', scores: { bright: 2, compact: 1 } },
      { label: 'Jardín / patio', icon: '🌿', scores: { bright: 2, hardy: 2 } },
    ],
  },
  {
    title: '¿Qué estilo prefieres?',
    subtitle: 'Paso 4 de 4 — Estética',
    options: [
      { label: 'Roseta clásica', icon: '🌹', scores: { rosette: 3 } },
      { label: 'Textura suave', icon: '🧸', scores: { fuzzy: 3 } },
      { label: 'Color llamativo', icon: '🎨', scores: { colorful: 3 } },
    ],
  },
];

interface Recommendation {
  name: string;
  scientific: string;
  reason: string;
  img: string;
  slug: string;
}

function getRecommendations(scores: Record<string, number>): Recommendation[] {
  const profiles: { match: (s: Record<string, number>) => number; rec: Recommendation }[] = [
    {
      match: s => (s.rosette || 0) + (s.bright || 0) + (s.lowWater || 0),
      rec: { name: "Echeveria 'Hercules'", scientific: 'Echeveria', reason: 'Perfecta para sol directo y bajo riego. Roseta clásica impresionante.', img: imgHercules, slug: 'echeveria-hercules' },
    },
    {
      match: s => (s.colorful || 0) + (s.bright || 0) + (s.easycare || 0),
      rec: { name: "Echeveria 'Perle von Nürnberg'", scientific: 'Echeveria', reason: 'Colores púrpura y rosa espectaculares. Fácil de cuidar.', img: imgPerle, slug: 'echeveria-perle' },
    },
    {
      match: s => (s.hardy || 0) + (s.lowWater || 0) + (s.bright || 0),
      rec: { name: 'Kalanchoe orgyalis', scientific: 'Kalanchoe', reason: 'Extremadamente resistente. Ideal para exteriores y principiantes.', img: imgOrgyalis, slug: 'kalanchoe-orgyalis' },
    },
    {
      match: s => (s.fuzzy || 0) + (s.compact || 0) + (s.lowLight || 0),
      rec: { name: 'Kalanchoe tomentosa', scientific: 'Kalanchoe', reason: 'Textura aterciopelada única. Perfecta para espacios pequeños.', img: imgTomentosa, slug: 'kalanchoe-tomentosa' },
    },
  ];

  return profiles
    .map(p => ({ score: p.match(scores), rec: p.rec }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(p => p.rec);
}

interface Props {
  onClose: () => void;
}

export default function SucculentQuiz({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Recommendation[] | null>(null);

  const handleSelect = (optionScores: Record<string, number>) => {
    const updated = { ...scores };
    for (const [key, val] of Object.entries(optionScores)) {
      updated[key] = (updated[key] || 0) + val;
    }
    setScores(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResults(getRecommendations(updated));
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRestart = () => {
    setStep(0);
    setScores({});
    setResults(null);
  };

  return (
    <div className="quiz-overlay" onClick={onClose}>
      <div className="quiz" onClick={e => e.stopPropagation()}>
        <button className="quiz__close" onClick={onClose} aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {!results ? (
          <>
            {/* Progress */}
            <div className="quiz__progress">
              {questions.map((_, i) => (
                <div key={i} className={`quiz__progress-dot ${i <= step ? 'quiz__progress-dot--active' : ''}`} />
              ))}
            </div>

            <p className="quiz__subtitle">{questions[step].subtitle}</p>
            <h3 className="quiz__question">{questions[step].title}</h3>

            <div className="quiz__options">
              {questions[step].options.map((opt, i) => (
                <button key={i} className="quiz__option" onClick={() => handleSelect(opt.scores)}>
                  <span className="quiz__option-icon">{opt.icon}</span>
                  <span className="quiz__option-label">{opt.label}</span>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button className="quiz__back" onClick={handleBack}>← Anterior</button>
            )}
          </>
        ) : (
          <>
            <h3 className="quiz__results-title">Tu suculenta ideal</h3>
            <p className="quiz__results-subtitle">Basado en tus respuestas, te recomendamos:</p>

            <div className="quiz__results">
              {results.map((rec, i) => (
                <div key={i} className="quiz__result-card">
                  <img src={rec.img} alt={rec.name} className="quiz__result-img" />
                  <div className="quiz__result-info">
                    <h4 className="quiz__result-name">{rec.name}</h4>
                    <p className="quiz__result-scientific">{rec.scientific}</p>
                    <p className="quiz__result-reason">{rec.reason}</p>
                    <Link to={`/catalogo/${rec.slug}`} className="quiz__result-link" onClick={onClose}>
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz__results-actions">
              <button className="quiz__restart" onClick={handleRestart}>Intentar de nuevo</button>
              <Link to="/catalogo" className="quiz__browse" onClick={onClose}>Ver todo el catálogo →</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
