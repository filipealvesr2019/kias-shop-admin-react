// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAtom } from 'jotai';
import { isAdminAtom, loggedInAtom } from '../store/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useConfig } from './ConfigContext';

const AuthContext = createContext();





export const AuthProvider = ({ children }) => {
  const storedToken = Cookies.get('token');
  const storedRole = Cookies.get('role');
  
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [isManager, setIsManager] = useState(storedRole === 'Gerente');
  const [error, setError] = useState(null); // Estado para armazenar a mensagem de erro

  const credentials = Cookies.get('role'); // Obtenha as credenciais do cookie

      const token = Cookies.get('token'); // Obtenha o token do cookie
      const { apiUrl } = useConfig();
  useEffect(() => {

    setLoggedIn(Boolean(storedToken));
    setIsAdmin(storedRole === 'administrador');
  }, [storedToken, storedRole]);

 
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Credentials: credentials,
        },
      });
      
      if (response.data.user.role === 'administrador') {
        setLoggedIn(true);
        setIsAdmin(true);
        setIsManager(false);
      } else if (response.data.user.role === 'funcionario') {
        setLoggedIn(true);
        setIsAdmin(false);
        setIsManager(false);
      } else if (response.data.user.role === 'Gerente') {
        setLoggedIn(true);
        setIsAdmin(false);
        setIsManager(true);
      } else {
        alert('Credenciais inválidas');
      }
  
      Cookies.set('token', response.data.token);
      Cookies.set('role', response.data.user.role);
      
    } catch (error) {
      setError(error.response.data.error); // Define a mensagem de erro do backend

      if (error.response && error.response.status === 401) {
        toast.error('Erro, email ou senha invalidas!', { position: toast.POSITION.TOP_CENTER });
      } else {
        console.error('Erro na solicitação de login', error);
      }
    }
  };
  
  
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    setLoggedIn(false);
    setIsAdmin(false);
  };

  const values = {
    loggedIn,
    isAdmin,
    isManager,
    login,
    logout,
    error // Inclui o estado de erro no contexto de autenticação

  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
