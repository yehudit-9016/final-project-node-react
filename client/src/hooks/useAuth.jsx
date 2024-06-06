
import {jwtDecode} from "jwt-decode"

const useAuth=()=>{
    const token = localStorage.getItem("token")
    let isAdmin = false
    let isUser = false
    if(token){
        const userDecoded = jwtDecode(token)
        const {_id, username, roles, phone, name, favourites, email, address, password} = userDecoded
        isAdmin = roles==="admin"
        isUser = roles==="user"
        return {_id, username, roles, phone, name, favourites, email, address, password, isAdmin, isUser}
    }

    return {username:'', isAdmin, isUser, name:'', favourites:null, email:'',address:'', phone:'' , roles:'', _id:'', password:'' }
}

export default useAuth