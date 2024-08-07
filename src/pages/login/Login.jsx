import {useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import './LogInStyle.css';
import { Link } from 'react-router-dom';



const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    loginUser(email, password);
  };

  return (
    <div className="login-container">
      <img className="loginLogo" src="/src/assets/tup_logo.jpg" alt="Login Logo" />
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
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
        <button class="login-button"type="submit">Acceder</button>
      </form>
      <Link to="/recuperar-password">¿Olvidaste tu contraseña?</Link>
    </div>
  );
};
    /*
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="mainContainer">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-8">
            <div className="card shadow">
              <div className="card-body">
                
                <img className="loginLogo" src="/src/assets/tup_logo.jpg" alt="Login Logo"></img>
                
                <form onSubmit={handleSubmit}>
                  
                  <div classNameName="mb-3">
                    <label>Email:</label>
                    <input 
                      type="email" 
                      name="email"
                      required />
                  </div>

                  <div className="mb-3">
                  <label>Password:</label>
                  <input 
                    type="password" 
                    name="password"
                    required />
                  </div>

                  <div className="d-grid">
                    <button type="button" className="btn btn-primary" id="submitBtn">Ingresar</button>
                  </div>
                  <span> Don't Have an Account? 
                    <Link to="/register">Register</Link>
                  </span>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    */


export default Login