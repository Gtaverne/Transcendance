import { useState, useEffect } from 'react';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { logout } from '../features/auth/authSlice';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    if (
      user &&
      user.id &&
      user.username != 'Validate MFA' &&
      Cookies.get('jwt')
    ) {
      setLoggedIn(true);
    // } else if (user && user.username && user.username === 'Validate MFA') {
    //   dispatch(logout());
    } else {
      setLoggedIn(false);
    }
    setCheckingStatus(false);
  }, [user]);
  return { loggedIn, checkingStatus };
};
