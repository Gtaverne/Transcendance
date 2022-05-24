import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiGetter from '../features/apicalls/apiGetter';
import { login, edit, reset } from '../features/auth/authSlice';
import Cookies from 'js-cookie';
import UserInterface from '../interfaces/UserInterface';
import { FaSignOutAlt, FaUser, FaLock } from 'react-icons/fa';
import UserMiniature from '../components/UserMiniature';

const STORAGE_PATH = process.env.REACT_APP_STORAGE_PATH || '';
if (STORAGE_PATH === '') {
  console.log('Missing STORAGE_PATH in .env');
}

type Props = {};

const UserProfile = (props: Props) => {
  let noloop = 0; //Not required in production
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editProfile, setEditProfile] = useState(false);
  const [profilePic, setProfilePic] = useState<Blob>();
  const [preview, setPreview] = useState('');
  const [queryData, setQueryData] = useState({
    query: '',
  });
  const params = useParams();

  const {
    user,
    iFollowList,
    iBlockedList,
    isError,
    isLoading,
    isSuccess,
    message,
  } = useSelector((state: RootStateOrAny) => state.auth);

  var profile = user;
  const [fetchedProfile, setFetchedProfile] = useState(profile);
  const [fetchedFollowers, setFetchedFollowers] = useState([]);
  const [fetchedFollowing, setFetchedFollowing] = useState(iFollowList);

  useEffect(() => {
    console.log('We get in useeffect');

    if (noloop === 0) {
      noloop = 1;
      console.log('We try to fetch');

      const fetchUser = async () => {
        try {
          const userData = await apiGetter('users/profile/' + params.id);
          const userFollower = await apiGetter('users/followers/' + params.id);
          const userFollowing = await apiGetter('users/following/' + params.id);
          if (userData) {
            setFetchedProfile({ ...userData });
            setFetchedFollowers(userFollower);
            setFetchedFollowing(userFollowing);
            console.log('We fetched a profile: ');
          }
        } catch (error) {
          console.log('Could not load user');
        }
      };
      fetchUser();
    }

    dispatch(reset);
  }, [dispatch, params, login, user, edit, iFollowList, iBlockedList]);

  useEffect(() => {
    if (!profilePic) {
      setPreview('');
    } else {
      const objectUrl = URL.createObjectURL(profilePic);
      setPreview(objectUrl);
      //Search if there is a more elegant way to remove a picture from cache -_-
      // window.location.reload();
    }
  }, [user, profilePic]);

  var profile = user;

  const onMutate = (e: any) => {
    console.log('Mutation');
    setFetchedProfile((prevState: any) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onMfa = () => {
    if (user && fetchedProfile.id === user.id) {
      if (user.doublefa === 0) {
        // var tmp = new UserIterface
        console.log('Activate 2fa');
        navigate(`/configure2fa/${user.id}`);
        dispatch(reset);
      } else {
        console.log('Deactivate 2fa');
        //BENJAMIN: exemple de dispatch(edit(...))
        dispatch(edit({ id: user.id, field: 'doublefa', value: 0 }));
        dispatch(reset);
      }
    }
  };

  const onEdition = async (e: any) => {
    e.preventDefault();

    console.log('In onEdition');

    if (editProfile === true && user.id === fetchedProfile.id) {
      dispatch(
        edit({
          id: user.id,
          field: 'username',
          value: fetchedProfile.username,
        }),
      );
      if (preview !== '' && Cookies.get('jwt')) {
        // upload avatar in back
        console.log('Ready to upload: ', profilePic ? profilePic : '');
        const myData = new FormData();
        const config = {
          headers: {
            'Content-Type':
              'multipart/form-data; boundary=' + Math.random().toString()[2],
          },
        };

        myData.append('file', profilePic ? profilePic : '');
        // console.log('Data: ', data.get('file'));

        try {
          // Axios does not work with uploadform
          await fetch(
            STORAGE_PATH + `/upload/${user.id}?jwt=` + Cookies.get('jwt'),
            {
              method: 'POST',
              body: myData,
            },
          );
          dispatch(
            edit({
              id: user.id,
              field: 'avatar',
              value: STORAGE_PATH + `/avatar/${user.id}`,
            }),
          );
        } catch (error) {
          console.log('Avatar upload failed');
          dispatch(
            edit({
              id: user.id,
              field: 'avatar',
              value: STORAGE_PATH + `/avatar/default`,
            }),
          );
        }
      }
    }
    setEditProfile((prevState) => !prevState);
  };

  const onNewpp = (e: React.FormEvent) => {
    const files = (e.target as HTMLInputElement).files;

    console.log('We received this picture: ', files);
    if (files && files.length > 0) {
      setProfilePic(files[0]);
    }
  };

  const onBlock = async () => {
    if (user) {
      if (iBlockedList.includes(fetchedProfile.id)) {
        console.log('unblock');
        dispatch(
          edit({
            id: user.id,
            field: 'iBlockedList',
            value: ['unblock', fetchedProfile.id],
          }),
        );
        dispatch(reset);
      } else {
        console.log('block');
        dispatch(
          edit({
            id: user.id,
            field: 'iBlockedList',
            value: ['block', fetchedProfile.id],
          }),
        );
      }
    }
  };

  const onFollow = async () => {
    if (user) {
      if (iFollowList.includes(fetchedProfile.id)) {
        console.log('Unfollow');
        dispatch(
          edit({
            id: user.id,
            field: 'iFollowList',
            value: ['unfollow', fetchedProfile.id],
          }),
        );
        dispatch(reset);
      } else {
        console.log('follow');
        dispatch(
          edit({
            id: user.id,
            field: 'iFollowList',
            value: ['follow', fetchedProfile.id],
          }),
        );
      }
    }
  };

  return (
    <div className="userProfile">
      <div></div>
      {user && user.id && user.id === fetchedProfile?.id ? (
        <>
          <h2>Welcome home</h2>
          <button className="largeButton" color="#f194ff" onClick={onEdition}>
            <FaSignOutAlt />
            {editProfile ? ' Validate edition' : 'Edit'}
          </button>
        </>
      ) : (
        <>
          <h3>Another player</h3>

          <button className="largeButton" onClick={onFollow}>
            <FaUser />
            {iFollowList.includes(fetchedProfile.id) ? 'un' : ''}follow
          </button>

          <button className="largeButton" onClick={onBlock}>
            <FaSignOutAlt />
            {iBlockedList.includes(fetchedProfile.id) ? 'un' : ''}block
          </button>
        </>
      )}

      <div></div>

      {editProfile ? (
        // Upload profile picture
        <>
          {preview ? (
            <>
              <img className="profilepage" src={preview} />
            </>
          ) : (
            <>
              <img className="profilepage" src={user.avatar} />
            </>
          )}

          <div>Upload your avatar</div>
          {/* <form onSubmit={onUpload}> */}
          <input type="file" id="file" accept="image/jpg" onChange={onNewpp} />
          {/* <button type="submit">Upload</button>
          </form> */}
        </>
      ) : (
        <>
          <img className="profilepage" src={fetchedProfile.avatar} />
        </>
      )}

      {/* Name */}
      {editProfile ? (
        // How do we make spaces?
        <div>
          Change pseudo:
          <input
            type="text"
            id="username"
            value={fetchedProfile.username}
            onChange={onMutate}
            required
          />
        </div>
      ) : (
        <p>Username: {fetchedProfile.username}</p>
      )}

      <p>Level: {fetchedProfile.lvl}</p>

      <p>email: {fetchedProfile.email}</p>

      {user && user.id && editProfile && user.id === fetchedProfile.id ? (
        <p>
          Double Factor Authentication:
          <>
            <button className="largeButton" onClick={onMfa}>
              <FaLock />
              {user.doublefa === 0 ? 'Activate 2fa' : 'Deactivate 2fa'}
            </button>
          </>
        </p>
      ) : (
        <></>
      )}

      <div className="userlist">
        <h3>Following: {fetchedFollowing.length} </h3>
        {fetchedFollowing.map((c: number, i: number) => (
          <div>
            <UserMiniature id={c} key={i} />
          </div>
        ))}
      </div>
      
      <div className="userlist">
        <h3>Follower: {fetchedFollowers.length} </h3>
        {fetchedFollowers.map((c: number, i: number) => (
          <div>
            <UserMiniature id={c} key={i} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
