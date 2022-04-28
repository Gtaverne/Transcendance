import {RootStateOrAny, useSelector, useDispatch} from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import apiGetter from '../features/apicalls/apiGetter'

import * as qs from 'qs'


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
  const [results, setResults] = useState('')


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
    let str = qs.stringify(await apiGetter(queryData.query))
    console.log('Query launched')

    setResults(str)
    console.log('Results: ' + results);

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
    <div>
      {results && {results}}
    </div>
    </>
  )
}

export default UserProfile