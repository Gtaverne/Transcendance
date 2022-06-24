import React from 'react';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { edit, reset, logout } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Overlay from '../components/Overlay';

type Props = {};

function Verify2FA({}: Props) {
  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [QRCode, setQRCode] = useState('');
  const [writtenCode, setWrittenCode] = useState('');

  const onChange = (e: any) => {
    setWrittenCode(e.target.value);
  };

  const onTestMFA = async (e: any) => {
    console.log('Test MFA');

    try {
      const resMFA = await axios.get(
        process.env.REACT_APP_URL_BACK + 'users/mfaverify',
        {
          params: { jwt: Cookies.get('jwt'), code: writtenCode },
        },
      );

      console.log(location.pathname);
      const validMFA = resMFA.data.mfaverification;
      console.log('MFA: ', validMFA);
      if (validMFA) {
        toast.success('Successfully logged in')

        // dispatch(login())
      } else {
        toast.error('Wrong code, please retry');
      }
    } catch (error) {
      console.log('Request to MFA validation failed');
      toast.error('Wrong code, please retry');
    }
  };

  return (
    <Overlay title={"Verify 2FA"}>
      <div>
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
        <button className="largeButton" onClick={onTestMFA}>
          Test authenticator
        </button>
      </div>
    </Overlay>
  );
}

export default Verify2FA;
