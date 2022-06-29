import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiGetter from '../features/apicalls/apiGetter';
import { login, edit, reset } from '../features/auth/authSlice';
import Cookies from 'js-cookie';
import UserInterface from '../interfaces/UserInterface';
import { FaSignOutAlt, FaUser, FaLock } from 'react-icons/fa';
import UserMiniature from '../components/UserMiniature';
import AchievementMiniature from '../components/AchievementMiniature';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

import '../components/Overlay.css';
import Overlay from '../components/Overlay';

const STORAGE_PATH =
  process.env.REACT_APP_STORAGE_PATH || 'http://localhost:5050/microcdn';
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
  const [achievementsList, setAchievementsList] = useState([]);
  const params = useParams();

  const { user, iFollowList, iBlockedList } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );

  const [friendList, setFriendList] = useState<Array<number>>([]);
  const [requestList, setRequestList] = useState<Array<number>>([]);
  const [stalkList, setStalkList] = useState<Array<number>>([]);

  var profile = user;
  const [fetchedProfile, setFetchedProfile] = useState(profile);
  const [fetchedFollowers, setFetchedFollowers] = useState([]);
  const [fetchedFollowing, setFetchedFollowing] = useState(iFollowList);

  useEffect(() => {
    console.log('We get in useeffect');

    if (noloop === 0) {
      noloop = 1;
      console.log('We try to fetch ', params.id);

      const fetchUser = async () => {
        try {
          const user = await apiGetter('users/profile/' + params.id);
          const userFollowerRaw = await apiGetter(
            'users/followers/' + params.id,
          );
          const userFollowingRaw = await apiGetter(
            'users/following/' + params.id,
          );
          const userFollower = userFollowerRaw.data;
          const userFollowing = userFollowingRaw.data;
          if (user.data) {
            setFetchedProfile({ ...user.data });
            setFetchedFollowers(userFollower);
            setFetchedFollowing(userFollowing);
            console.log('We fetched a profile: ');
          }
        } catch (error) {
          console.log('Could not load user');
          //Popup:
          toast.error('The user you looked for does not exist');
          navigate('/userprofile/' + user.id);
        }
      };
      fetchUser();
    }

    dispatch(reset);
  }, [params.id, iBlockedList, iFollowList]);

  useEffect(() => {
    if (!profilePic) {
      setPreview('');
    } else {
      const objectUrl = URL.createObjectURL(profilePic);
      setPreview(objectUrl);
    }
  }, [user, profilePic]);

  useEffect(() => {
    const friend: number[] = fetchedFollowers.filter((number) =>
      fetchedFollowing.includes(number),
    );

    const stalk: number[] = fetchedFollowing.filter(
      (value: number) => !friend.includes(value),
    );

    const pend: number[] = fetchedFollowers.filter(
      (value: number) => !friend.includes(value),
    );

    const req: number[] = pend.filter(
      (value: number) => !iBlockedList.includes(value),
    );

    console.log('Editing friendlists and followers');
    setFriendList(friend);
    setStalkList(stalk);
    setRequestList(req);
  }, [
    user,
    fetchedProfile,
    fetchedFollowers,
    fetchedFollowing,
    iBlockedList,
    iFollowList,
  ]);

  useEffect(() => {
    console.log('We get in fetchAchievements');
    const fetchAchievements = async () => {
      try {
        const ach = await apiGetter(`achievements/update/${params.id}`);
        setAchievementsList(ach.data);
      } catch (error) {
        console.log('Could not fetch achievements');
      }
    };
    if (fetchedProfile.id !== 0) {
      fetchAchievements();
    } else {
    }
    console.log('achievementsList: ', achievementsList);
  }, [params.id]);

  var profile = user;

  const onMutate = (e: any) => {
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
        dispatch(edit({ id: user.id, field: 'doublefa', value: 0 }));
        dispatch(reset);
      }
    }
  };

  const onEdition = async (e: any) => {
    e.preventDefault();

    console.log('In onEdition');

    if (editProfile === true && user.id === fetchedProfile.id) {
      if (fetchedProfile.username.length > 10) {
        toast.error("Please choose a shorter username")
      } else {
        dispatch(
          edit({
            id: user.id,
            field: 'username',
            value: fetchedProfile.username,
          }),
        );
      }
      if (preview !== '' && Cookies.get('jwt')) {
        // upload avatar in back
        console.log('Ready to upload: ', profilePic ? profilePic : '');
        const myData = new FormData();

        myData.append('file', profilePic ? profilePic : '');
        // console.log('Data: ', data.get('file'));

        try {
          // Axios does not work with uploadform
          console.log('STORAGE_PATH: ', STORAGE_PATH);
          await fetch(
            STORAGE_PATH + `upload/${user.id}?jwt=` + Cookies.get('jwt'),
            {
              method: 'POST',
              body: myData,
            },
          );
          console.log('Profile picture edition');
          dispatch(
            edit({
              id: user.id,
              field: 'avatar',
              value: STORAGE_PATH + `avatar/${user.id}?cache=${Math.random()}`,
            }),
          );
          //Search if there is a more elegant way to remove a picture from cache -_-
          window.location.reload();
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

  // Beginning of the result
  if (!user?.id || !fetchedProfile?.id) {
    console.log('No data fetched');
    navigate('/landing');
    return <Spinner />;
  }

  return (
    <Overlay title="User Profile" style={{ overflowY: 'scroll' }}>
      <div className="userPageWrapper">
        <div className="userDescription">
          {user && user.id && user.id === fetchedProfile?.id ? (
            <div>
              <h2>Your Profile</h2>
              <button
                className="largeButton"
                color="#f194ff"
                onClick={onEdition}
              >
                <FaSignOutAlt />
                {editProfile ? ' Validate edition' : 'Edit'}
              </button>
            </div>
          ) : (
            <>
              <div>
                <h3>{fetchedProfile.username}'s profile</h3>
                <button className="largeButton" onClick={onFollow}>
                  <FaUser />
                  {iFollowList.includes(fetchedProfile.id) ? 'un' : ''}follow
                </button>
              </div>
              <div>
                <button className="largeButton" onClick={onBlock}>
                  <FaSignOutAlt />
                  {iBlockedList.includes(fetchedProfile.id) ? 'un' : ''}block
                </button>
              </div>
            </>
          )}
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
              <input
                type="file"
                id="file"
                accept="image/jpg"
                onChange={onNewpp}
              />
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
            <div>
              <p>Username: {fetchedProfile.username}</p>
              <p>Level: {fetchedProfile.lvl}</p>
            </div>
          )}
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
        </div>

        <div className="userDescription">
          <h2>Trophys</h2>
          {achievementsList.map((c: any) => (
            <div key={c.id.toString()}>
              <AchievementMiniature achievement={c} />
            </div>
          ))}
        </div>

        <div className="userList">
          <div className="userList">
            <div>
              <h3>Friends: {friendList.length} </h3>
              {friendList.map((c: number) => (
                <div key={c.toString()}>
                  <UserMiniature targetid={c} friendable={1} blockable={1} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {user?.id === fetchedProfile?.id ? (
          <>
            <div className="userList">
              <div>
                <h3>People you follow: {stalkList.length} </h3>
                {stalkList.map((c: number) => (
                  <div key={c.toString()}>
                    <UserMiniature targetid={c} friendable={1} blockable={1} />
                  </div>
                ))}
              </div>
            </div>
            <div className="userList">
              <div>
                <h3>Friend requests: {requestList.length} </h3>
                {requestList.map((c: number) => (
                  <div key={c.toString()}>
                    <UserMiniature targetid={c} friendable={1} blockable={1} />
                  </div>
                ))}
              </div>
            </div>
            <div className="userList">
              <div>
                <h3>Blocked: {iBlockedList.length} </h3>
                {iBlockedList.map((c: number) => (
                  <div key={c.toString()}>
                    <UserMiniature targetid={c} friendable={0} blockable={1} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </Overlay>
  );
};

export default UserProfile;
