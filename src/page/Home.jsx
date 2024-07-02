import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();

    return <>
        <h1>Home page</h1>

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
                    <CardActionArea onClick={ () => navigate("/my-todos")}>
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