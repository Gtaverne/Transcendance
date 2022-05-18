import { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import jwt from 'jsonwebtoken'

type Props = {};

function Landing({}: Props) {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id ) {
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
        <a href="https://api.intra.42.fr/oauth/authorize?client_id=f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code">
          Login
        </a>
      </button>
    </div>
  );
}

export default Landing;
