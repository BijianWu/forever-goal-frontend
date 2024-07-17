import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Chip, FormControl, Grid, IconButton, InputLabel, Link, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import FirstPageIcon from '@mui/icons-material/FirstPage';

export default function AddBookmark(){
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
    const [content, setContent] = useState("");
    const [tagName, setTagName] = useState([]);
    const theme = useTheme();
    const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
    const names = [
      'mysql',
      'java',
      'golang',
      'microservices',
      'aws',
      'multiplayer',
      'game development',
      'css',
      'backend development',
      'frontend development',
    ];
  
    function getStyles(name, personName, theme) {
      return {
        fontWeight:
          personName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
      };
    }
  
  
    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setTagName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };


    const addTodo = async (token) => {
      let newArray = [];
      for (let i = 0; i < tagName.length; i++) {
        newArray.push(tagName[i].toLowerCase());
        // tagName[i] = tagName[i].toLowerCase();
      }
      dataStoreContext.setIsLoading(true);
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/bookmarks', { item: name, tags: newArray, content: content}, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
      
            navigate("/my-bookmarks")
            enqueueSnackbar("Bookmark added", {variant: "success"})
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            // retry refresh
            const token = await dataStoreContext.refresh();
            await addTodo(token);
          } else {
            console.log(error);
            enqueueSnackbar("Error adding bookmark", {variant: "error"})
          }

        });

        dataStoreContext.setIsLoading(false);
    }

    return <>
        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>Add bookmark</Typography>
{/* 
        <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton> */}

        <IconButton aria-label="back to todos" onClick={ () => navigate("/my-bookmarks")} sx={{ mb: 3}}>
          <FirstPageIcon sx={{ fontSize: 40 }} />
        </IconButton>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField id="filled-basic" inputProps={{ maxLength: 30, style: { fontSize: 25} }} InputLabelProps={{style: {fontSize: 20}}}  label="Name" variant="filled" value={name} onChange={ (e) => setName(e.target.value)} />
          </Grid>

          <Grid item xs={12}>
            <TextField id="filled-basic" sx={{ width: "100%" }} inputProps={{ maxLength: 300, style: { fontSize: 25} }} InputLabelProps={{style: {fontSize: 20}}}  label="Content" variant="filled" value={content} onChange={ (e) => setContent(e.target.value)} />
          </Grid>
          <Grid item xs={12}>

          <FormControl sx={{ m: 1, width: "70%" }}>
              <InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                // onClose={ () => {getBookmarks(dataStoreContext.token)}}
                value={tagName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, tagName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* <TextField id="filled-basic" inputProps={{ maxLength: 30, style: { fontSize: 25} }} InputLabelProps={{style: {fontSize: 20}}}  label="Tags" variant="filled" value={tags} onChange={ (e) => setTags(e.target.value)} /> */}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary"  onClick={ () => addTodo(dataStoreContext.token)}>Add</Button>
          </Grid>
        </Grid>

    </>
}