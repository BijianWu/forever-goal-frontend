import { Button, Divider, Link, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import DataStoreContext from "../DataStoreContext";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { REFRESH_TOKEN_NAME, TOKEN_NAME } from "../constant/constant";

export default function Login(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const onRegisterClicked = (e) => {
      dataStoreContext.setIsLoading(true);

      axios.post(process.env.REACT_APP_BACKEND_URL + '/login', {
          email: email,
          password: password
        }, { withCredentials: true})
        .then(function (response) {
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
          // always executed
          dataStoreContext.setIsLoading(false);
        });
    }

    useEffect(() => {
      let accessToken = localStorage.getItem(TOKEN_NAME);
      // let firstName = localStorage.getItem("firstName");
      // let lastName = localStorage.getItem("lastName");

      if(accessToken != null){
        navigate("/");
      }
    }, []);

    return <>
        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>Login</Typography>
        
        <Stack spacing={2}
          divider={<Divider orientation="horizontal" flexItem />}
          >
            <Button variant="text" sx={{ alignSelf: "flex-start" }} onClick={() => navigate("/register")}>Do not have account, register now</Button>
            
            <TextField required name="email" label="Email" inputProps={{ maxLength: 50, style: { fontSize: 25} }} InputLabelProps={{shrink: true, style: {fontSize: 20} }} color="primary" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField  required name="password" label="Password" inputProps={{ maxLength: 50, style: { fontSize: 25} }} InputLabelProps={{shrink: true, style: {fontSize: 20} }} type="password" color="primary" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" size="large" onClick={onRegisterClicked}>Login</Button>
        </Stack>

    </>
}