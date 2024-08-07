import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recuperarPassword } from '../../../services/authService';

const RecuperarPass = () => {

  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    recuperarPassword(email, navigate);
  };

  return (
    <div className="recuperar-contraseña-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Recuperar Contraseña</button>
      </form>
    </div>
  );
};

export default RecuperarPass;