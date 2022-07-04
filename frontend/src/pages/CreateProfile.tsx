import { RootStateOrAny, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import logo from './assets/logo.svg';

function CreateProfile() {
  const { user } = useSelector((state: RootStateOrAny) => state.auth);
  const navigate = useNavigate();

  const goProfile = () => {
    localStorage.setItem("didCreate", "false");
    navigate('/userprofile/' + user.id);
  }

  const validate = () => {
    localStorage.setItem("didCreate", "false");
    navigate('/');
  }

  return (
    <div className="landingPage">
      <img src={logo} style={{width: "300px"}} alt=""></img>

      <div style={{padding: "40px"}}>
        <p>Please complete your profile on your profile page or continue</p>
      </div>

      <button className="createButton" title="Complete Profile" onClick={goProfile}>Profile page</button>
      <br/>
      <button className="createButton" title="Continue" onClick={validate}>Continue</button>

    </div>
  );
}

export default CreateProfile;
