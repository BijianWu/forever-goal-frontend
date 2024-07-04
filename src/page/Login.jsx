import { Button, Divider, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import DataStoreContext from "../DataStoreContext";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

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
      // https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
      const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
      console.log(matched)
      if(matched !== null){
        navigate("/");
      }
    }, []);

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