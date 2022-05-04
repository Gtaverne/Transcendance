import {useState, useEffect} from 'react'
import {RootStateOrAny, useSelector } from 'react-redux'

const JWT_Secret = process.env.REACT_APP_JWT_Secret || 'defaultSecret'

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const {user} = useSelector((state: RootStateOrAny) => state.auth)

    useEffect(() => {
        if (user && user.id) {
            //Token proof
            if (user.token && (user.token).substring(JWT_Secret.length) === (user.id).toString(10)) {
                console.log('Token validated')
            }
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
        setCheckingStatus(false)

    }, [user])
    return {loggedIn, checkingStatus}
}