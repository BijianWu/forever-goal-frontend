import axios from "axios";
import { useContext, useEffect, useState } from "react"
import DataStoreContext from "../DataStoreContext";
import { Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, InputLabel, ListItem, MenuItem, OutlinedInput, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function MyBookmarks(){

    const dataStoreContext = useContext(DataStoreContext);
    const navigate = useNavigate();
    const matches = useMediaQuery('(min-width:600px)');
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        // https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
        // const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
        // console.log(matched)
        // if(matched === null){
        //   navigate("/login");
        // }
        if(!dataStoreContext.isInitialised){
          console.error("dataStoreContext has not yet initialized");
        }

        if(!dataStoreContext.token){
          console.error("token has not yet initialized");
        }

        console.log("MyTodos initialized");
      }, []);

      
  const [tagName, setTagName] = useState([]);
    useEffect(() => {
        getBookmarks(dataStoreContext.token);
    }, []);

    const getBookmarks = async (token) => {

      dataStoreContext.setIsLoading(true);
      const queryString = "?tags=" + tagName;
      await axios.get(process.env.REACT_APP_BACKEND_URL + '/bookmarks' + queryString, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          // handle success
          console.log(response);
          setTodos(response.data);
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            console.log("refreshing right now")
            // retry refresh
            const token = await dataStoreContext.refresh();
            await getBookmarks(token);
          } else{
            // handle error
            console.log(error);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigate("/login");
          }

        })
       
        dataStoreContext.setIsLoading(false);
    }

    const deleteBookmark = async (id, token) => {
      dataStoreContext.setIsLoading(true);

      await axios.delete(process.env.REACT_APP_BACKEND_URL + '/bookmarks/' + id, { headers: { 'Authorization': 'Bearer ' + token}, withCredentials: true })
        .then(function (response) {
          console.log(response);
    
            // Re-render with the new array
            setTodos(todos.filter(todo => todo.id !== id));
            enqueueSnackbar("bookmark deleted", {variant: "success"})
        })
        .catch(async function (error) {
          if(error.response.status === 401){
            const token = await dataStoreContext.refresh();
            await deleteBookmark(id, token);
          } else {
            console.log(error);
            enqueueSnackbar("Error deleting bookmark", {variant: "error"});
          }

        })

        dataStoreContext.setIsLoading(false);
  }

  const [open, setOpen] = useState(false);
  const [removeItem, setRemoveItem] = useState({});
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
    'MySql',
    'Java',
    'Golang',
    'Microservices',
    'AWS',
    'Multiplayer',
    'Game development',
    'CSS',
    'Backend development',
    'Frontend development',
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
    return <>


      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm the deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {removeItem.item}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            setOpen(false);
            deleteBookmark(removeItem.id, dataStoreContext.token);
          }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>My Bookmarks</Typography>
        {/* <IconButton aria-label="home" onClick={ () => navigate("/")} sx={{ mb: 3}}>
          <HomeIcon sx={{ fontSize: 40 }} />
        </IconButton> */}

        <Stack direction={"row"} spacing={3}>
            <IconButton aria-label="add bookmark" onClick={ () => navigate("/my-bookmarks/add")} sx={{ mb: 3}}>
              <AddCircleRoundedIcon sx={{ fontSize: 40 }} />
            </IconButton>

            <FormControl sx={{ m: 1, width: "70%" }}>
              <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                onClose={ () => {getBookmarks(dataStoreContext.token)}}
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
          </Stack>

        {todos != null && todos.length > 0 &&
              todos.map((row) => (
                <Box key={row.id}>
                  <Stack   direction={matches ? "row" : "column"} spacing={matches ? 4 : 0} justifyContent="space-between"
                  alignItems="center" sx={{ pb: 1}}>
                    <Typography variant="h5"  component="div" spacing={matches ? 1.5 : 0}>
                    {row.item}
                    </Typography>
                    
                      <Stack direction={"row"} spacing={1}>
      
                      <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0.5,
                            m: 0,
                          }}
                          component="ul"
                        >
                          {row.tags.map((data) => {
                            let icon;

                            // if (data.label === 'React') {
                            //   icon = <TagFacesIcon />;
                            // }

                            return (
                              <ListItem key={row.id + data}>
                                <Chip
                                  icon={icon}
                                  label={data}
                                  // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                />
                              </ListItem>
                            );
                          })}
                        </Box>
                        <IconButton aria-label="delete bookmark" onClick={ () => {
                          setOpen(true);
                          setRemoveItem({id: row.id, item: row.item});
                        }} > 
                          <DeleteForeverIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                        


                      </Stack>

                  </Stack>
                  <Divider style={{width:'100%'}} sx={{mb:3}} />
                </Box>
            //   <Card sx={{ minWidth: 275, m: 2 }}>
            //   <CardContent>

            //     <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
            //     {row.item}
            //     </Typography>
            //     {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
            //       Status {row.completed ? <Chip label="yes" color="success"/> : <Chip label="not yet"/>}
            //     </Typography> */}
            //     <Typography variant="body2">
            //       Actions  
            //     </Typography>
            //   </CardContent>
            //   <CardActions>
            //   {row.completed ?  <Button variant="contained" color="warning"  onClick={ () => markAsComplete(row.id, false)}><CheckBoxOutlineBlankIcon /></Button> : <Button variant="contained" color="success" onClick={ () => markAsComplete(row.id, true)}><CheckBoxIcon /></Button>}

            //   <IconButton aria-label="delete todo" onClick={ () => {
            //     setOpen(true);
            //     setRemoveItem({id: row.id, item: row.item});
            //   }} > 
            //     <RemoveCircleIcon sx={{ fontSize: 40 }} />
            //   </IconButton>
              
            //   </CardActions>
            // </Card>
          ))
        }

    </>
}