import { Button, Divider, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataStoreContext from "../DataStoreContext";
import { enqueueSnackbar } from "notistack";

export default function Register(){
    const dataStoreContext = useContext(DataStoreContext);
    const [email, setEmail]  = useState("");
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [newPassword, setNewPassword]  = useState("");
    const [confirmPassword, setConfirmPassword]  = useState("");
    const navigate = useNavigate();

    // useEffect(() => {
    //     const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
    //     console.log(matched)
    //     if(matched !== null){
    //       navigate("/");
    //     }
    //   }, []);

    const onRegisterClicked = (e) => {
        dataStoreContext.setIsLoading(true);

        axios.post(process.env.REACT_APP_BACKEND_URL + '/register', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: newPassword
          }, { withCredentials: true})
          .then(function (response) {
            console.log(response);
            navigate("/");
            console.log(response);
            dataStoreContext.setId(response.data.id);
            dataStoreContext.setEmail(response.data.email);
            dataStoreContext.setFirstName(response.data.firstName);
            dataStoreContext.setLastName(response.data.lastName);
            dataStoreContext.setToken(response.data.token);
            enqueueSnackbar("Welcome back " + response.data.firstName, {variant: "success"})
          })
          .catch(function (error) {
            console.log(error);
            enqueueSnackbar("Error during login, please try again", {variant: "error"})
          })
          .finally(function () {
            dataStoreContext.setIsLoading(false);
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
            <TextField label="New Password" color="primary" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <TextField label="Confirm Password" color="primary" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button variant="contained" size="large" onClick={onRegisterClicked}>Register</Button>
        </Stack>

    </>
}