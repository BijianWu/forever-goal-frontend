import { Button, Divider, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Register(){

    const [email, setEmail]  = useState("");
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [newPassword, setNewPassword]  = useState("");
    const [confirmPassword, setConfirmPassword]  = useState("");
    const onRegisterClicked = (e) => {
        console.log("onRegisterClicked ");

        axios.post('http://localhost:9090/register', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: newPassword
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return <>
        <h1>Register page</h1>
        
        <Stack spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
          >
            <TextField label="Email" color="primary" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="First Name" color="primary" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <TextField label="Last Name" color="primary" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <TextField label="New Password" color="primary" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <TextField label="Confirm Password" color="primary" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button variant="contained" size="large" onClick={onRegisterClicked}>Register</Button>
        </Stack>

    </>
}