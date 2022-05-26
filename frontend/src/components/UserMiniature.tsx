import { useEffect, useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import apiGetter from '../features/apicalls/apiGetter';
import UserInterface from '../interfaces/UserInterface';

type Props = {
  id: any;
}

function UserMiniature({id}: Props) {
  const [fetchedProfile, setFetchedProfile] = useState<UserInterface>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiGetter('users/profile/' + id);
      if (user.data) {
        setFetchedProfile({ ...user.data });
        console.log('We fetched a profile: ');
      }
    };
    fetchUser();
  }, [id]);

  if (fetchedProfile && fetchedProfile.username && fetchedProfile.id)
    return (
      <>
        <Link to={'/userprofile/' + id} >
          <img className="profilepic" src={fetchedProfile.avatar} alt="" /> 
          {fetchedProfile.username} | {fetchedProfile.id}
        </Link>
      </>
    );
  else return <></>;
}

export default UserMiniature;
