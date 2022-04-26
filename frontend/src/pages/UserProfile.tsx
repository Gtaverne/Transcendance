import axios, {AxiosRequestConfig, AxiosResponse,
  AxiosError,} from 'axios'
import * as qs from 'qs'
import {useSelector, useDispatch} from 'react-redux'
import {login, reset} from '../features/auth/authSlice'

import React from 'react'

type Props = {}

const UserProfile = (props: Props) => {
  return (
    <div>UserProfile account</div>
  )
}

export default UserProfile