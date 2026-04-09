import { useState, type FormEvent } from 'react';
import { useAuth } from '../core/auth/useAuth';
import '../styles/pages/account.css';
import '../styles/components/button.css';
import '../styles/components/input.css';

export default function Profile() {
  const { user, profile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="account-page">
      <h1 className="account-page__title">Mi Perfil</h1>

      <div className="profile__avatar">
        <div className="profile__avatar-circle">{initial}</div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        {saved && <div className="auth__success">Cambios guardados</div>}
        <div className="input">
          <label className="input__label">Correo electrónico</label>
          <input type="email" className="input__field" value={user?.email || ''} disabled />
        </div>
        <div className="input">
          <label className="input__label">Nombre completo</label>
          <input type="text" className="input__field" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
        </div>
        <div className="input">
          <label className="input__label">Teléfono</label>
          <input type="tel" className="input__field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 809 000 0000" />
        </div>
        <button type="submit" className="btn btn--primary btn--lg">Guardar cambios</button>
      </form>
    </div>
  );
}
