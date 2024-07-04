import { useEffect, useState } from "react";
import DataStoreContext from "./DataStoreContext";

const DataStoreProvider = ({children}) => {
    const [id, setId]  = useState("");
    const [email, setEmail]  = useState("");
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [token, setToken]  = useState("");
    const [isLoading, setIsLoading]  = useState(false);
    useEffect(() => {
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
    };

    return(
        <DataStoreContext.Provider value={value}>
            {children}
        </DataStoreContext.Provider>
    )
}


export default DataStoreProvider;