import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Chip, Grid, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';

export default function AddTodo(){
    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    useEffect(() => {
        // https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
        console.log(matched)
        if(matched === null){
          navigate("/login");
        }
      }, []);

    const [name, setName] = useState("");


    const addTodo = (id, completed) => {
      dataStoreContext.setIsLoading(true);
      axios.post(process.env.REACT_APP_BACKEND_URL + '/todos', { item: name}, { withCredentials: true})
        .then(function (response) {
          console.log(response);
      
            navigate("/my-todos")
            enqueueSnackbar("Todo added", {variant: "success"})
        })
        .catch(function (error) {
          console.log(error);
          enqueueSnackbar("Error adding todo", {variant: "error"})
        })
        .finally(function () {
          dataStoreContext.setIsLoading(false);
        });
    }

    return <>
        <h1>Add todo page</h1>

        <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton>


        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField id="filled-basic" label="Name" variant="filled" value={name} onChange={ (e) => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary"  onClick={ () => addTodo()}>Add</Button>
          </Grid>
        </Grid>

    </>
}