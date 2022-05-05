import { useState, useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

// const JWT_Secret = process.env.REACT_APP_JWT_Secret || 'defaultSecret'

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    if (user && user.id && Cookies.get('jwt')) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setCheckingStatus(false);
  }, [user]);
  return { loggedIn, checkingStatus };
};
