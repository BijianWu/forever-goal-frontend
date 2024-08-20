import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataStoreContext from "../DataStoreContext";
import { enqueueSnackbar } from "notistack";
import { REFRESH_TOKEN_NAME, TOKEN_NAME } from "../constant/constant";

export default function Register(){
    const dataStoreContext = useContext(DataStoreContext);
    const [email, setEmail]  = useState("");
    const [firstName, setFirstName]  = useState("");
    const [lastName, setLastName]  = useState("");
    const [newPassword, setNewPassword]  = useState("");
    const [confirmPassword, setConfirmPassword]  = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      let accessToken = localStorage.getItem(TOKEN_NAME);
      // let firstName = localStorage.getItem("firstName");
      // let lastName = localStorage.getItem("lastName");

      if(accessToken != null){
        navigate("/");
      }
    }, []);

    const onRegisterClicked = (e) => {
      if(!firstName){
        enqueueSnackbar("first name cannot be empty", {variant: "error"});
        return;
      }

      if(!lastName){
        enqueueSnackbar("first name cannot be empty", {variant: "error"});
        return;
      }

      if(!email){
        enqueueSnackbar("email cannot be empty", {variant: "error"});
        return;
      }


      if(!newPassword || newPassword.length <= 6){
        enqueueSnackbar("password needs to be at least 6 characters long", {variant: "error"});
        return;
      }

      if(newPassword !== confirmPassword){
        enqueueSnackbar("password and confirm passward mistmatch", {variant: "error"});
        return;
      }

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
            dataStoreContext.setRefreshToken(response.data.refreshToken);
            localStorage.setItem(TOKEN_NAME, response.data.token);
            localStorage.setItem(REFRESH_TOKEN_NAME, response.data.refreshToken);
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
        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>Register</Typography>
        
        <Stack spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
          >
            <Button variant="text" sx={{ alignSelf: "flex-start" }} onClick={() => navigate("/login")}>Already got an account, go to login</Button>
            <TextField required name="firstName" label="First Name" inputProps={{ maxLength: 50, style: { fontSize: 25} }} InputLabelProps={{shrink: true, style: {fontSize: 20} }} color="primary" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            
            <TextField required name="lastName" label="Last Name" inputProps={{ maxLength: 50, style: { fontSize: 25} }} InputLabelProps={{shrink: true, style: {fontSize: 20} }} color="primary" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <TextField required name="email" label="Email" inputProps={{ maxLength: 50, style: { fontSize: 25} }} InputLabelProps={{shrink: true, style: {fontSize: 20} }} color="primary" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField required name="password" label="New Password" inputProps={{ maxLength: 50, minLength: 6, style: { fontSize: 25} }} InputLabelProps={{shrink: true, style: {fontSize: 20} }} color="primary" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <TextField required name="passwordConfirm" label="Confirm Password" inputProps={{ maxLength: 50, minLength: 6, style: { fontSize: 25} }} InputLabelProps={{shrink: true, style: {fontSize: 20} }} color="primary" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button variant="contained" size="large" onClick={onRegisterClicked}>Register</Button>
        </Stack>

    </>
}