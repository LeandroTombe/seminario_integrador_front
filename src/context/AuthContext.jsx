import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";


const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem("authTokens") ? 
        JSON.parse(localStorage.getItem("authTokens"))
        : null
    );

    const [user, setUser] = useState(
        localStorage.getItem("authTokens") ? 
        jwtDecode(localStorage.getItem("authTokens"))
        : null
    )

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const loginUser = async (email, password) => {
        let url = "http://127.0.0.1:8000/api/v1/auth/login/"
        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })
        const data = await response.json()

        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/")
            swal.fire({
                title: "Login Success",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            })
        } else {
            console.log(response.status)
            console.log("An Error Occured")
            swal.fire({
                title: "Email - Password does not exist",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false
            })
        }

    }
    const contextData = {
        user,setUser,
        authTokens, setAuthTokens,
        loginUser
    }

    useEffect(()=>{

        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}