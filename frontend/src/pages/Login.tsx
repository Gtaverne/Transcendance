import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { login, loginmfa, reset } from '../features/auth/authSlice';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Overlay from '../components/Overlay';

type Props = {};

function Login({}: Props) {
  const [searchParams] = useSearchParams();
  const code: string = searchParams.get('code') || '';
  const [firstLoop, setFirstLoop] = useState(true);
  let noloop = 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mfaRequired, setMFARequired] = useState(false);
  const [writtenCode, setWrittenCode] = useState('');

  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );

  const onChange = (e: any) => {
    setWrittenCode(e.target.value);
  };

  const onCheckMFA = async (e: any) => {
    console.log('Login 2fa');

    try {
      const MFAParams = {
        jwt: Cookies.get('jwt'),
        code: writtenCode,
      };
      dispatch(loginmfa(MFAParams));

      if (!user || !user.username) {
        //popup: Please retry code
      } else {
      }
    } catch (error) {
      console.log('Request to MFA validation failed');
    }
  };

  useEffect(() => {
    noloop = noloop + 1;

    if (firstLoop === false || noloop > 1) {
      console.log('Already looped');
      setFirstLoop(false);
    }

    if (user && user.username) {
      // toast.success('Login successful');
      navigate('/');
    } else if (code !== '' && user && !user.username) {
      console.log('From login, login with code: ', code);
      dispatch(login(code));
      setFirstLoop(false);
      if (user && user.username) {
        console.log('Navigate to home');
        navigate('/');
      }
    } else {
      console.log('No code provided');
      // navigate('/');
    }

    if (user && user.username !== '' && user.doublefa === 0) {
      //is it synchronous ?
      console.log('User logged, no 2fa');

      navigate('/');
    } else if (user && user.doublefa > 0) {
      setMFARequired(true);
      console.log('got through 2fa');
    } else {
      console.log('No username');
    }

    dispatch(reset());
    //Voir si une de ces conditions doit être virée
  }, [dispatch, user, isError, isLoading, isSuccess, message]);

  if (!code) {
    return <div>Intra 42 denied your login</div>;
  }

  if (isError) {
    return <div>The backend denied your login</div>;
  }

  if (mfaRequired) {
    return (
      <Overlay title={"2FA"}>
        <div className="userProfile">
          <div className="marginTop">
            <input
              type="text"
              id="username"
              value={writtenCode}
              onChange={onChange}
              required
              placeholder="Type 6 digits"
            />
          </div>
          <div>
            <button className="largeButton" onClick={onCheckMFA}>
              Send code
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  return <div>Welcome</div>;
}

export default Login;
