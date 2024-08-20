import { useEffect, useState } from "react";
import DataStoreContext from "./DataStoreContext";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { REFRESH_TOKEN_NAME, TOKEN_NAME } from "./constant/constant";

const DataStoreProvider = ({children}) => {
    const [id, setId]  = useState("");
    const [email, setEmail]  = useState("");
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [token, setToken]  = useState("");
    const [refreshToken, setRefreshToken]  = useState("");
    const [isLoading, setIsLoading]  = useState(true);
    const [isInitialised, setIsInitialised] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        let accessToken = localStorage.getItem(TOKEN_NAME);
        let refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME);

        if(accessToken == null){
            console.log("DataStoreProvider initialized because no access token");
            setIsInitialised(true);
            setIsLoading(false);
            navigate("/login");
        } else{
            async function authenticate(){
                await axios.post(process.env.REACT_APP_BACKEND_URL + '/authenticate', {
                    token: accessToken, refreshToken: refreshToken
                  }, { withCredentials: true})
                  .then(function (response) {
                    // navigate("/");
                    console.log(response);
                    setToken(response.data.token);
                    setRefreshToken(response.data.refreshToken);
                    localStorage.setItem(TOKEN_NAME, response.data.token)
                    localStorage.setItem(REFRESH_TOKEN_NAME, response.data.refreshToken)

                    const decoded = jwtDecode(response.data.token);
                    const fullNameArray = decoded.aud[1].split(" ");
                    setFirstName(fullNameArray[0]);
                    setLastName(fullNameArray[1]);
                    localStorage.setItem(TOKEN_NAME, response.data.token);
                    enqueueSnackbar("Welcome back " + fullNameArray[0], {variant: "success"})
                  })
                  .catch(function (error) {
                    console.log(error);
                    localStorage.removeItem(TOKEN_NAME);
                    localStorage.removeItem(REFRESH_TOKEN_NAME);
                    navigate("/login");
                    enqueueSnackbar("Error during login, session expired", {variant: "error"})
                  })
                  .finally(function () {
                    // always executed
                    console.log("DataStoreProvider initialized because authenticate request");
                    setIsInitialised(true);
                    setIsLoading(false);
                  });
            }

            authenticate();

        }

    }, [])
    
    const refresh = async () => {
        let accessToken = localStorage.getItem(TOKEN_NAME);
        let refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME);
        let token = "";
        await axios.post(process.env.REACT_APP_BACKEND_URL + '/authenticate', {
            token: accessToken, refreshToken: refreshToken
          }, { withCredentials: true})
          .then(function (response) {
            // navigate("/");
            console.log(response);
            setToken(response.data.token);
            setRefreshToken(response.data.refreshToken);
            localStorage.setItem(TOKEN_NAME, response.data.token)
            localStorage.setItem(REFRESH_TOKEN_NAME, response.data.refreshToken)

            const decoded = jwtDecode(response.data.token);
            const fullNameArray = decoded.aud[1].split(" ");
            setFirstName(fullNameArray[0]);
            setLastName(fullNameArray[1]);
            localStorage.setItem(TOKEN_NAME, response.data.token);

            token = response.data.token;
          })
          .catch(function (error) {
            console.log(error);
            localStorage.removeItem(TOKEN_NAME);
            localStorage.removeItem(REFRESH_TOKEN_NAME);
            token = ""
          });
        
        return token;
    }

    const logout = () => {
        setToken("");
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(REFRESH_TOKEN_NAME);
        navigate("/login");
    }
    const value = {
        id,
        firstName,
        lastName,
        email,
        token,
        setId,
        setEmail,
        setFirstName,
        setLastName,
        setToken,
        isLoading,
        setIsLoading,
        isInitialised,
        logout,
        refresh,
        refreshToken,
        setRefreshToken
    };

    return(
        <DataStoreContext.Provider value={value}>
            {children}
        </DataStoreContext.Provider>
    )
}


export default DataStoreProvider;