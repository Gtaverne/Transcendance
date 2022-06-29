import {Navigate, Outlet} from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const {loggedIn, checkingStatus} = useAuthStatus()

  if (checkingStatus) {
      return (<Spinner />)
  }

  if (localStorage.getItem("didCreate") == "true")
  {
    return <Navigate to = '/create' />;
  }

  return loggedIn ? <Outlet /> : <Navigate to = '/landing' />
}

export default PrivateRoute