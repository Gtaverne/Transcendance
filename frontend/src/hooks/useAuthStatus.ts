import { useState, useEffect } from 'react';
import { RootStateOrAny, useSelector} from 'react-redux';
// import Cookies from 'js-cookie';
// import { logout, reset } from '../features/auth/authSlice';
// import { useNavigate } from 'react-router-dom';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);



  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    if (
      user &&
      user.id //&&
      // Cookies.get('jwt')
    ) {
      setLoggedIn(true);
    } else {
      console.log('Forbidden route, no user found')
      setLoggedIn(false);
    }
    setCheckingStatus(false);
  }, [user]);
  return { loggedIn, checkingStatus };
};
