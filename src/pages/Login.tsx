import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import '../styles/pages/auth.css';
import '../styles/components/button.css';
import '../styles/components/input.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Iniciar Sesión</h1>
        <p className="auth__subtitle">Bienvenido de vuelta a GREENLABS</p>

        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="input">
            <label className="input__label" htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" className="input__field" placeholder="tu@correo.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input">
            <label className="input__label" htmlFor="password">Contraseña</label>
            <input id="password" type="password" className="input__field" placeholder="Tu contraseña"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={`btn btn--primary btn--full btn--lg auth__submit ${loading ? 'btn--loading' : ''}`}
            disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth__footer">
          <Link to="/auth/recuperar" className="auth__link">¿Olvidaste tu contraseña?</Link>
          <span className="auth__divider">·</span>
          <Link to="/auth/registro" className="auth__link">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}
