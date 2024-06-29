import { Container } from "@mui/material";
import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
const EmptyLayout = () => {

    return (
      <>
        <Container maxWidth="sm">
          <Outlet />
        </Container>

      </>
    );
    
  };
  
  export default EmptyLayout;