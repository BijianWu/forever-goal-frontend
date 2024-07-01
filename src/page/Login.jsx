import { Button, Divider, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import DataStoreContext from "../DataStoreContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const onRegisterClicked = (e) => {
        console.log("onRegisterClicked ");

        axios.post(process.env.REACT_APP_BACKEND_URL + '/login', {
            email: email,
            password: password
          }, { withCredentials: true})
          .then(function (response) {
            navigate("/my-todos");
            console.log(response);
            dataStoreContext.setId(response.data.id);
            dataStoreContext.setEmail(response.data.email);
            dataStoreContext.setFirstName(response.data.firstName);
            dataStoreContext.setLastName(response.data.lastName);
            dataStoreContext.setToken(response.data.token);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return <>
        <h1>Login page</h1>
        
        <Stack spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
          >
            <TextField label="Email" color="primary" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="New Password" color="primary" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" size="large" onClick={onRegisterClicked}>Login</Button>
        </Stack>

    </>
}