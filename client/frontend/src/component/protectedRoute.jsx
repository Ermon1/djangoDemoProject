import {navigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import api from '../App'
import {  useState,useEffect } from 'react'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constant'

function ProtectedRout({children}) {
    const  [isAuthorized,  setAuthorized]=useState(null)
useEffect(()=>{
    auth().catch(()=>{setAuthorized(false)})
})


    const refreshToken= async ()=>{
    const refreshToken = localStorage.getItem(REFRESH_TOKEN)
    try{
    const response = await api.post('/api/token/refresh/', {refreshToken})
    if(response.status === 200){
        localStorage.setItem(ACCESS_TOKEN, response.data.access)
        setAuthorized(true)
    }else{
        setAuthorized(false)
    }
    }
    catch(error){
    console.log(error);
    setAuthorized(false)
    }
    }
    const auth =async( )=>{
    const token =localStorage.getItem(ACCESS_TOKEN)

        if(!token){
        setAuthorized(false)
        return
    }
 
        const decodedToken = jwtDecode(token)
        const tokenExpiration=decodedToken.exp
        const now=Date.now / 1000
    
    if(tokenExpiration < now){

        await refreshToken()
    }else{
        setAuthorized(true)
    }

    if(isAuthorized === null){
        return <div>LOADING...</div>
    }
    return isAuthorized ? children:<navigate to="/login"/>
}
}
export default ProtectedRout