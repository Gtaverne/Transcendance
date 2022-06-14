import { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

var API_42 =
  'https://api.intra.42.fr/oauth/authorize?client_id=defe35a8d7ed70945036caa7f7b042c6c98ab8f01b768c3adcd9e54d5d301d9f&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code';

const Client_ID = process.env.REACT_APP_CLIENT_ID;

if (Client_ID) {
  API_42 =
    'https://api.intra.42.fr/oauth/authorize?client_id=' +
    Client_ID +
    '&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code';
}


type Props = {};

function Landing({}: Props) {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username ) {
      navigate('/');
    }
  }, [user]);

  // const plop = jwt.sign('','')

  return (
    <div className="landingPage">
      <h2>Landing Page</h2>
      <p>You are not logged in</p>
      <p>Use 42 authentication by clicking this button</p>
      <button className="logButton">
        <a href={API_42}>
          Login
        </a>
      </button>
    </div>
  );
}

export default Landing;
