import {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import './Login.css'

const Login = () => {
    const { loginUser } = useContext(AuthContext);
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const email = e.target.email.value;
      const password = e.target.password.value;
  
      loginUser(email, password);
    }
  
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-avatar">
            <div className="avatar"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="email" className="login-input" required />
            <input type="password" name="password" placeholder="password" className="login-input" required />
            <button type="submit" className="login-button">Iniciar Sesion</button>
          </form>
        </div>
      </div>
    );
}

export default Login