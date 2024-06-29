import { Button, Divider, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Login(){

    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const onRegisterClicked = (e) => {
        console.log("onRegisterClicked ");

        axios.post('http://localhost:9090/login', {
            email: email,
            password: password
          })
          .then(function (response) {
            console.log(response);
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