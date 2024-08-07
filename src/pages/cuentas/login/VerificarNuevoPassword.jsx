import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarPassword } from '../../../services/authService';

const VerificarNuevoPassword = () => {

    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        
        e.preventDefault();
        validarPassword(password, password2, otp,navigate);
      };

      return (
        <div className="recuperar-contraseña-container">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="otp">Codigo</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Nueva Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password2">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>
            <button type="submit">Actualizar Contraseña</button>
          </form>
        </div>
    );
};

export default VerificarNuevoPassword;