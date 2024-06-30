import { createContext } from "react";

//TODO: might not need to create this one separately
const DataStoreContext = createContext({
    token: "",
    email: "",
    firstName: "",
    lastName: "",
});

export default DataStoreContext;