import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";

export default function MyTodos(){
    const dataStoreContext = useContext(DataStoreContext);

    const [todos, setTodos] = useState([]);
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/todos', { headers: { 'Authorization': 'Bearer ' +dataStoreContext.token}})
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }, [])

    return <>
        <h1>MyTodos page</h1>
    </>
}