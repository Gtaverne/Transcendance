import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';

type Props = {};

function Login({}: Props) {
  const [searchParams] = useSearchParams();
  const code: string = searchParams.get('code') || '';
  const [profileLoaded, setProfileLoaded] = useState(false);
  let noloop = 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );

  useEffect(() => {
    if (profileLoaded === false && noloop === 0) {
      noloop = noloop + 1;
      setProfileLoaded(true);
      dispatch(login(code));
    }

    if (profileLoaded || user.username !== '') {
      navigate('/');
    }

    dispatch(reset());
    //Voir si une de ces conditions doit être virée
  }, [user, isError, isLoading, isSuccess, message]);

  if (!code) {
    return <div>Intra 42 denied your login</div>;
  }

  if (isError) {
    return <div>Our backend denied your login</div>;
  }

  return <div>Welcome, {user.username}</div>;
}

export default Login;
