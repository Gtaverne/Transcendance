import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { edit, reset, logout } from '../features/auth/authSlice';
import qrcode from 'qrcode';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

type Props = {};

function Configure2FA({}: Props) {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [QRCode, setQRCode] = useState('');
  const [writtenCode, setWrittenCode] = useState('');

  //   useEffect(() => {

  //   }, []);

  const onChange = (e: any) => {
    setWrittenCode(e.target.value);
  };

  const onMFA = async () => {
    setQRCode('');
    dispatch(reset);

    if (user.doublefa !== 0) {
      console.log('User already configurated 2fa');
    } else {
      const code = await axios.get(
        process.env.REACT_APP_URL_BACK + 'users/mfasetup',
        {
          params: { jwt: Cookies.get('jwt') },
        },
      );

      if (!code.data || code.data === 'logout') {
        dispatch(logout);
        console.log('Invalid login credentials, user has been logout');
        navigate('/');
      } else {
        qrcode.toDataURL(code.data.secret, function (err, data) {
          if (err) {
            console.log('Error in que qrcode generation: ', err);
          } else {
            setQRCode(data);
          }
        });
      }
    }
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

      const validMFA = resMFA.data.mfaverification;
      if (validMFA) {
        dispatch(
          edit({
            id: user.id,
            field: 'doublefa',
            // to activate google mfa: last digit is 1
            value: user.doublefa % 10 === 0 ? user.doublefa + 1 : user.doublefa,
          }),
        );
        //Popup, MFA activated
        toast.success('Google Authenticator has been successfully activated')
        navigate(`/userprofile/${user.id}`)
      } else {
        toast.error('Wrong code, please retry')

        dispatch(
          edit({
            id: user.id,
            field: 'doublefa',
            // we remove doublefa
            value: 0,
          }),
        );

      }
    } catch (error) {
      console.log('Request to MFA validation failed');
    }
  };

  return (
    <div className="userProfile">
      <div>Configure2FA</div>
      <button className="largeButton" onClick={onMFA}>
        2FA Google
      </button>
      {QRCode !== '' ? (
        <>
          <div>Scan this code with google authenticator</div>
          <img src={QRCode} alt="QR Code" />
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
              Send code
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Configure2FA;
