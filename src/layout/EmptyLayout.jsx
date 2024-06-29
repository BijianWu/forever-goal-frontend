import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
const EmptyLayout = () => {

    return (
      <>
          <Outlet />
      </>
    );
    
  };
  
  export default EmptyLayout;