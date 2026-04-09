import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/useAuth';
import '../styles/pages/account.css';
import '../styles/components/button.css';
import '../styles/components/input.css';

export default function Settings() {
  const { updatePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return; }
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setPassword('');
      setConfirm('');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="account-page">
      <h1 className="account-page__title">Configuración</h1>

      <div className="settings__section">
        <h2 className="settings__section-title">Cambiar Contraseña</h2>
        {error && <div className="auth__error">{error}</div>}
        {success && <div className="auth__success">Contraseña actualizada</div>}
        <form className="settings-form" onSubmit={handlePassword}>
          <div className="input">
            <label className="input__label">Nueva contraseña</label>
            <input type="password" className="input__field" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
          </div>
          <div className="input">
            <label className="input__label">Confirmar contraseña</label>
            <input type="password" className="input__field" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite la contraseña" required />
          </div>
          <button type="submit" className={`btn btn--primary ${loading ? 'btn--loading' : ''}`} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>

      <div className="settings__section settings__section--danger">
        <h2 className="settings__section-title">Sesión</h2>
        <button className="btn btn--danger" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
