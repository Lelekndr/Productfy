import {useAuth} from '@clerk/clerk-react'
import {useEffect} from 'react'
import api from '../lib/api'

function useAuthReq() {
    const {isSignedIn,getToken, isLoaded} = useAuth()

    //include auth token in api requests
    useEffect(() => {
        const interceptor = api.interceptors.request.use(async(config) => {
            if (isSignedIn) {
                const token = await getToken()
                if(token) {
                    config.header.Authorization = `Bearer ${token}`
                }
            }
            return config 

        })
        return () => api.interceptors.request.eject(interceptor);
    },[isSignedIn, getToken])

 return {isSignedIn, isClerkLoaded: isLoaded};
}

export default useAuthReq
