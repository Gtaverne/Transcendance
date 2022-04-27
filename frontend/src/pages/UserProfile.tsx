import {RootStateOrAny, useSelector, useDispatch} from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import apiGetter from '../features/apicalls/apiGetter'

import React from 'react'

type Props = {}

const UserProfile = (props: Props) => {
  let noloop = 0;


  const {user, isError, isLoading, isSuccess, message} = useSelector(
    (state : RootStateOrAny) => state.auth
    )

  var profile = user
  const [fetchedProfile, setfetchedProfile] = useState(profile)
  const [queryData, setQueryData] = useState({
    query: ''
  })


  const params = useParams()

  useEffect(() => {
    if (noloop === 0) {
      noloop = 1

      const fetchUser = async() => {
        console.log('We try to fetch this profile: ' + params.id);
        const userData = await apiGetter('users/' + params.id )
        console.log('Fetched username: ' + userData.username);
        setfetchedProfile(userData)
      }
      fetchUser()
      console.log('We fetched: ' + fetchedProfile.username);
    }
  }, [params.login])


  console.log(fetchedProfile && 'id: ' + fetchedProfile.id);


  const onSubmit = async(e :any) => {
    e.preventDefault()
    console.log('Query launched')
    const results = await apiGetter(queryData.query)

    console.log(results);
  }

  const onChange = async(e :any) => {
    e.preventDefault()
    setQueryData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <>
    <div></div>
    <div>User Profile account</div>

    <div>
      <form onSubmit={onSubmit}>
        <input type='string' placeholder='route to query' id = 'query' onChange={onChange} />


      </form>
      <button onClick={onSubmit} >Send Request</button>
    </div>
    </>
  )
}

export default UserProfile