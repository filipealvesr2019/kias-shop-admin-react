import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPage from '../AdminPage';
import EmployeePage from '../EmployeePage';
import LogoutIcon from '@mui/icons-material/Logout';
import './Login.css';
import ManagerPage from '../ManagerPage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const Login = () => {
  const { loggedIn, isAdmin, isManager, login, logout, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  const [messageErrorBorder, setMessageErrorBorder] = useState(null);
  const handleLogin = () => {
    if (validateForm()) {
      login(email, password);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Campo obrigatório';
    }

    if (!password.trim()) {
      errors.password = 'Campo obrigatório';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  if (loggedIn) {
    return (
      <div className='logout-container'>
        {isAdmin ? <AdminPage /> : (isManager ? <ManagerPage /> : <EmployeePage />)}
        <div className='button' onClick={logout}>
          <LogoutIcon />
          <span>Sair</span>
        </div>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="container">
        <div className='loginStyle'>
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            placeholder="Digite o email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors((prevErrors) => ({ ...prevErrors, email: '' }));
            }}
            className={formErrors.email ? 'error' : ''}
            style={{
              border: error ? "2px solid red" : ""
            }}
            
          />
          {formErrors.email && <span className='error-message'>{formErrors.email}</span>}
          <br />
          {error && <p>{error}</p>} {/* Exibe a mensagem de erro */}
          <div style={{
              position: "relative"
            }}>
          <label htmlFor="password">Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Digite a senha..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormErrors((prevErrors) => ({ ...prevErrors, password: '' }));
            }}
            className={formErrors.password ? 'error' : ''}
            style={{
              border: error ? "2px solid red" : ""
            }}
            
          />

<div 
                onClick={() => setShowPassword(!showPassword)}  // Alterna o estado de showPassword
                style={{
                  position: "absolute",
                  right: "30px",
                  top: "75%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
   
          </div>
         
          {formErrors.password && <span className='error-message'>{formErrors.password}</span>}
          <br />
          <button className="loginButton" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
