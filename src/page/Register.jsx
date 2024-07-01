import { Button, Divider, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataStoreContext from "../DataStoreContext";

export default function Register(){
    const dataStoreContext = useContext(DataStoreContext);
    const [email, setEmail]  = useState("");
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [newPassword, setNewPassword]  = useState("");
    const [confirmPassword, setConfirmPassword]  = useState("");
    const navigate = useNavigate();

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