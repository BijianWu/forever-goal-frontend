import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();

    // useEffect(() => {
    //     // https://stackoverflow.com/questions/5968196/how-do-i-check-if-a-cookie-exists
    //     const matched = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/)
    //     console.log(matched)
    //     if(matched === null){
    //       navigate("/login");
    //     }
    //   }, []);

    return <>
        <Typography variant="h3" fontWeight={"bold"} sx={{ mb: 1}}>Home page</Typography>

        <Grid container   
            justifyContent="center"
            alignItems="stretch" spacing={3}>

            <Grid item xs={12} md={6}>
                <Card >
                    <CardActionArea onClick={ () => navigate("/my-todos")}>
                        <CardMedia
                        component="img"
                        height="250"
                        image={require("../assets/images/todo-lists.jpg")}
                        alt="green iguana"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            My Todos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            click here to view all your todos
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card >
                    <CardActionArea onClick={ () => navigate("/my-everyday-goals")}>
                        <CardMedia
                        component="img"
                        height="250"
                        image={require("../assets/images/heaven.jpg")}
                        alt="green iguana"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            My goals
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            click here to view all your goals
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

        </Grid>




    </>
}