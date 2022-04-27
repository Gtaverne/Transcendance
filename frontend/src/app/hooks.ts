import {useState, useEffect} from 'react'
import {RootStateOrAny, useSelector } from 'react-redux'

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const {user} = useSelector((state: RootStateOrAny) => state.auth)

    useEffect(() => {
        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
        setCheckingStatus(false)

    }, [user])
    return {loggedIn, checkingStatus}
}

