import { useState } from 'react';
import { useAuth } from '../../core/auth/useAuth';
import '../../styles/components/testimonial-form.css';

interface Props {
  onClose: () => void;
  onSubmit: (data: { text: string; rating: number }) => void;
}

export default function TestimonialForm({ onClose, onSubmit }: Props) {
  const { profile } = useAuth();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.length < 10) return;
    setSubmitting(true);
    try {
      onSubmit({ text: text.trim(), rating });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="tform-overlay" onClick={onClose}>
        <div className="tform" onClick={e => e.stopPropagation()}>
          <div className="tform__success">
            <div className="tform__success-icon">✓</div>
            <h3 className="tform__success-title">¡Gracias por tu testimonio!</h3>
            <p className="tform__success-text">Tu opinión será revisada y publicada pronto.</p>
            <button className="tform__success-btn" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tform-overlay" onClick={onClose}>
      <div className="tform" onClick={e => e.stopPropagation()}>
        <button className="tform__close" onClick={onClose} aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h3 className="tform__title">Comparte tu experiencia</h3>
        <p className="tform__subtitle">Tu opinión ayuda a otros a descubrir GREENLABS</p>

        <form className="tform__form" onSubmit={handleSubmit}>
          <div className="tform__field">
            <label className="tform__label">Nombre</label>
            <input
              type="text"
              className="tform__input tform__input--disabled"
              value={profile?.full_name || 'Usuario'}
              disabled
            />
          </div>

          <div className="tform__field">
            <label className="tform__label">Calificación</label>
            <div className="tform__stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`tform__star ${star <= (hover || rating) ? 'tform__star--active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${star} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="tform__field">
            <label className="tform__label">Tu testimonio</label>
            <textarea
              className="tform__textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Cuéntanos tu experiencia con las suculentas de GREENLABS..."
              rows={4}
              minLength={10}
              maxLength={500}
              required
            />
            <span className="tform__charcount">{text.length}/500</span>
          </div>

          <button
            type="submit"
            className="tform__submit"
            disabled={submitting || text.trim().length < 10}
          >
            {submitting ? 'Enviando...' : 'Enviar testimonio'}
          </button>
        </form>
      </div>
    </div>
  );
}
