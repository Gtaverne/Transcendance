import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiGetter from '../features/apicalls/apiGetter';
import UserInterface from '../interfaces/UserInterface';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { login, edit, reset } from '../features/auth/authSlice';
import {
  FaSignOutAlt,
  FaEye,
  FaLock,
  FaUnlock,
  FaHeart,
  FaHeartBroken,
} from 'react-icons/fa';

type Props = {
  targetid: number;
  blockable?: number; //0: hide, 1: display
  friendable?: number; //0: hide, 1: display
};

function UserMiniature({ targetid, blockable = 0, friendable = 0 }: Props) {
  const [fetchedProfile, setFetchedProfile] = useState<UserInterface>();
  const dispatch = useDispatch();

  const { user, iFollowList, iBlockedList } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );

  useEffect(() => {
    const fetchUser = async () => {
      const fetchuser = await apiGetter('users/profile/' + targetid);
      if (fetchuser.data) {
        setFetchedProfile({ ...fetchuser.data });
        // console.log('We fetched a profile: ');
      }
    };
    fetchUser();
  }, [targetid]);

  const onBlock = async () => {
    if (blockable > 0 && targetid !== user.id) {
      if (iBlockedList.includes(targetid)) {
        console.log('unblock');
        dispatch(
          edit({
            id: user.id,
            field: 'iBlockedList',
            value: ['unblock', targetid],
          }),
        );
        dispatch(reset);
      } else {
        console.log('block');
        dispatch(
          edit({
            id: user.id,
            field: 'iBlockedList',
            value: ['block', targetid],
          }),
        );
      }
    }
  };

  const onFollow = async () => {
    if (friendable > 0 && targetid !== user.id) {
      if (iFollowList.includes(targetid)) {
        console.log('Unfollow');
        dispatch(
          edit({
            id: user.id,
            field: 'iFollowList',
            value: ['unfollow', targetid],
          }),
        );
        dispatch(reset);
      } else {
        console.log('follow');
        dispatch(
          edit({
            id: user.id,
            field: 'iFollowList',
            value: ['follow', targetid],
          }),
        );
      }
    }
  };

  if (fetchedProfile && fetchedProfile.username && fetchedProfile.id)
    return (
      <div className="miniUser">
        <div
          className={
            fetchedProfile.isOnline ? 'miniUserLink puceverte' : 'miniUserLink'
          }
        >
          <Link
            to={'/userprofile/' + targetid}
            style={{ textDecoration: 'none' }}
          >
            <img className="profilepic" src={fetchedProfile.avatar} alt="" />
            {fetchedProfile.username}
          </Link>
        </div>
        {fetchedProfile.currentGame !== 0 ? (
          <Link
            to={'/game/' + fetchedProfile.currentGame}
            style={{ textDecoration: 'none' }}
          >
            <button
              className="actionButton"
              style={{ backgroundColor: 'blue' }}
              title="Watch the game"
            >
              <FaEye />
            </button>
          </Link>
        ) : (
          <></>
        )}
        {blockable === 1 &&
        targetid !== user.id &&
        !iBlockedList.includes(targetid) &&
        fetchedProfile.currentGame === 0 ? (
          <button className="actionButton" onClick={onBlock}>
            <FaLock />
          </button>
        ) : (
          <></>
        )}
        {blockable === 1 &&
        targetid !== user.id &&
        iBlockedList.includes(targetid) &&
        fetchedProfile.currentGame === 0 ? (
          <button
            className="actionButton"
            style={{ backgroundColor: 'lightgreen' }}
            onClick={onBlock}
          >
            <FaUnlock />
          </button>
        ) : (
          <></>
        )}

        {friendable === 1 &&
        targetid !== user.id &&
        !iFollowList.includes(targetid) ? (
          <button className="actionButton" onClick={onFollow}>
            <FaHeart />
          </button>
        ) : (
          <></>
        )}
        {friendable === 1 &&
        targetid !== user.id &&
        iFollowList.includes(targetid) ? (
          <button
            className="actionButton"
            onClick={onFollow}
            style={{ backgroundColor: 'black' }}
          >
            <FaHeartBroken />
          </button>
        ) : (
          <></>
        )}
      </div>
    );
  else return <></>;
}

export default UserMiniature;
