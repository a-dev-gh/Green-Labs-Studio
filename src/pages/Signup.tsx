import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import '../styles/pages/auth.css';
import '../styles/components/button.css';
import '../styles/components/input.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    try {
      await signup(email, password, name);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Crear Cuenta</h1>
        <p className="auth__subtitle">Únete a la comunidad GREENLABS</p>

        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="input">
            <label className="input__label" htmlFor="name">Nombre completo</label>
            <input id="name" type="text" className="input__field" placeholder="Tu nombre"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="input">
            <label className="input__label" htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" className="input__field" placeholder="tu@correo.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input">
            <label className="input__label" htmlFor="password">Contraseña</label>
            <input id="password" type="password" className="input__field" placeholder="Mínimo 6 caracteres"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="input">
            <label className="input__label" htmlFor="confirm">Confirmar contraseña</label>
            <input id="confirm" type="password" className="input__field" placeholder="Repite tu contraseña"
              value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" className={`btn btn--primary btn--full btn--lg auth__submit ${loading ? 'btn--loading' : ''}`}
            disabled={loading}>
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth__footer">
          <span>¿Ya tienes cuenta? </span>
          <Link to="/auth/login" className="auth__link">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
