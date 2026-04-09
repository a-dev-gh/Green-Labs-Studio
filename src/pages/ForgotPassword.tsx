import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import '../styles/pages/auth.css';
import '../styles/components/button.css';
import '../styles/components/input.css';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el enlace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Recuperar Contraseña</h1>
        <p className="auth__subtitle">Te enviaremos un enlace para restablecer tu contraseña</p>

        {error && <div className="auth__error">{error}</div>}
        {success && <div className="auth__success">Enlace enviado. Revisa tu correo electrónico.</div>}

        {!success && (
          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="input">
              <label className="input__label" htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" className="input__field" placeholder="tu@correo.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className={`btn btn--primary btn--full btn--lg auth__submit ${loading ? 'btn--loading' : ''}`}
              disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <div className="auth__footer">
          <Link to="/auth/login" className="auth__link">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
