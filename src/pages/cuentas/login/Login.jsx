import {useContext} from 'react'
import AuthContext from '../../../context/AuthContext'
import './LogInStyle.css';
import { Link } from 'react-router-dom';



const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const legajo = e.target.legajo.value;
    const password = e.target.password.value;

    loginUser(legajo, password);
  };

  return (
    
    <div className="login-container">
      <img className="loginLogo" src="/src/assets/tup_logo.png" alt="Login Logo" />
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="legajo">legajo</label>
          <input
            type="legajo"
            id="legajo"
            name="legajo"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <button className="login-button"type="submit">Acceder</button>
      </form>
      <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
    </div>
  );
};


export default Login