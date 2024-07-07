import { useEffect, useState } from "react";
import DataStoreContext from "./DataStoreContext";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const DataStoreProvider = ({children}) => {
    const [id, setId]  = useState("");
    const [email, setEmail]  = useState("");
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [token, setToken]  = useState("");
    const [isLoading, setIsLoading]  = useState(true);
    const [isInitialised, setIsInitialised] = useState(false);

    useEffect(() => {
        let accessToken = localStorage.getItem("token");
        // let firstName = localStorage.getItem("firstName");
        // let lastName = localStorage.getItem("lastName");

        if(accessToken == null){
            console.log("DataStoreProvider initialized because no access token");
            setIsInitialised(true);
            setIsLoading(false);
        } else{
            async function authenticate(){
                await axios.post(process.env.REACT_APP_BACKEND_URL + '/authenticate', {
                    token: accessToken
                  }, { withCredentials: true})
                  .then(function (response) {
                    // navigate("/");
                    console.log(response);
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    enqueueSnackbar("Welcome back " + response.data.firstName, {variant: "success"})
                  })
                  .catch(function (error) {
                    console.log(error);
                    localStorage.removeItem("token");
                    enqueueSnackbar("Error during login, please try again", {variant: "error"})
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
        isInitialised
    };

    return(
        <DataStoreContext.Provider value={value}>
            {children}
        </DataStoreContext.Provider>
    )
}


export default DataStoreProvider;