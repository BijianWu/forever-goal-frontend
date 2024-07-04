import { Backdrop, CircularProgress, Container } from "@mui/material";
import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import DataStoreContext from "../DataStoreContext";

const EmptyLayout = () => {
  const dataStoreContext = useContext(DataStoreContext);
    return (
      <>
        <Container maxWidth="lg">
          <Outlet />
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={dataStoreContext.isLoading}
            // onClick={() => dataStoreContext.setIsLoading(false)}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>

      </>
    );
    
  };
  
  export default EmptyLayout;