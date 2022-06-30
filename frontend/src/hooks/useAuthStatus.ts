import { useState, useEffect } from 'react';
import { RootStateOrAny, useSelector, useDispatch} from 'react-redux';
import Cookies from 'js-cookie';
import { login, edit, reset, logout } from '../features/auth/authSlice';
import UserInterface from '../interfaces/UserInterface';


// import Cookies from 'js-cookie';
// import { logout, reset } from '../features/auth/authSlice';
// import { useNavigate } from 'react-router-dom';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const dispatch = useDispatch();


  const { user } = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    if (
      user &&
      user.id && user.username && Cookies.get("jwt")
    ) {
      setLoggedIn(true);
    } else {
      console.log('Forbidden route, no user found');
      localStorage.removeItem('user');
      dispatch(logout())
      // dispatch(edit({user: {}, iFollowList: [], iBlockedList: []}));
      setLoggedIn(false);
    }
    setCheckingStatus(false);
  }, [user]);
  return { loggedIn, checkingStatus };
};
