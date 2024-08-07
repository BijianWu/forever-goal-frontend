import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Chip, Grid, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FirstPageIcon from '@mui/icons-material/FirstPage';


export default function AddEverydayGoal(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    // useEffect(() => {
    //     // https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
    //     const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
    //     console.log(matched)
    //     if(matched === null){
    //       navigate("/login");
    //     }
    //   }, []);

    const [name, setName] = useState("");


    const addNewEverydayGoal = async (token) => {
      dataStoreContext.setIsLoading(true);
      
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/everyday-goals', { item: name}, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
      
            navigate("/my-everyday-goals")
            enqueueSnackbar("Goal added", {variant: "success"})
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            // retry refresh
            const token = await dataStoreContext.refresh();
            await addNewEverydayGoal(token);
          } else {
            console.log(error);
            enqueueSnackbar("Error adding goal", {variant: "error"});
          }

        });

        dataStoreContext.setIsLoading(false);
    }

    return <>
        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>Add goal</Typography>

        {/* <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton> */}

        <IconButton aria-label="back to everyday goal" onClick={ () => navigate("/my-everyday-goals")} sx={{ mb: 3}}>
          <FirstPageIcon sx={{ fontSize: 40 }} />
        </IconButton>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField id="filled-basic" inputProps={{ maxLength: 30, style: { fontSize: 25} }} InputLabelProps={{style: {fontSize: 20}}} label="Name" variant="filled" value={name} onChange={ (e) => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary"  onClick={ () => addNewEverydayGoal(dataStoreContext.token)}>Add</Button>
          </Grid>
        </Grid>

    </>
}