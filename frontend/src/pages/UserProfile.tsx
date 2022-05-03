import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiGetter from '../features/apicalls/apiGetter';
import { login, reset } from '../features/auth/authSlice';

import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';

import React from 'react';

import * as qs from 'qs';

type Props = {};

const UserProfile = (props: Props) => {
  let noloop = 0; //Not required in production
  const dispatch = useDispatch();
  const [editProfile, setEditProfile] = useState(false);

  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state: RootStateOrAny) => state.auth,
  );

  var profile = user;
  const [fetchedProfile, setfetchedProfile] = useState(profile);
  const [queryData, setQueryData] = useState({
    query: '',
  });

  const [results, setResults] = useState('');

  const params = useParams();

  useEffect(() => {
    if (noloop === 0) {
      noloop = 1;

      const fetchUser = async () => {
        const userData = await apiGetter('users/' + params.id);
        if (userData) {
          setfetchedProfile({ ...userData });
        }
      };
      fetchUser();
    }
  }, [params, login, user]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setQueryData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onBlock = async () => {

  }

  const onFollow = async () => {
    
  }

  return (
    <>
      <div></div>
      {user && user.id && user.id === fetchedProfile.id ? (
        <>
          <h2>Welcome home</h2>
          <button className="logButton" color="#f194ff" onClick={() => {
          editProfile && console.log('ready to edit')
          setEditProfile((prevState) => !prevState)
        }}>
            <FaSignOutAlt />
            Edit
          </button>
        </>
      ) : (
        <>
          <h2>Add as contact</h2>
          <button className="logButton" onClick={onFollow}>
            <FaUser />
            Follow
          </button>
          <button className="logButton" onClick={onBlock}>
            <FaSignOutAlt />
            Block
          </button>
        </>
      )}

      <div></div>
      <img className="profilepage" src={fetchedProfile.avatar} />

      <div>Username: {fetchedProfile.username}</div>
      <div>email: {fetchedProfile.email}</div>
    </>
  );
};

export default UserProfile;
