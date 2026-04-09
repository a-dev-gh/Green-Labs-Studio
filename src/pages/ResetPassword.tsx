import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import '../styles/pages/auth.css';
import '../styles/components/button.css';
import '../styles/components/input.css';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
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
      await updatePassword(password);
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Nueva Contraseña</h1>
        <p className="auth__subtitle">Ingresa tu nueva contraseña</p>

        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="input">
            <label className="input__label" htmlFor="password">Nueva contraseña</label>
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
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
