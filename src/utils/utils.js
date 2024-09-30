import Cookies from 'js-cookie'
export const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    //setLoggedIn(false);
    //setIsAdmin(false);
  };