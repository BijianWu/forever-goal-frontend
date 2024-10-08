import { Avatar, Backdrop, CircularProgress, Container, Menu, MenuItem, Stack } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DataStoreContext from "../DataStoreContext";
import { deepOrange, grey } from "@mui/material/colors";
import logo from "../assets/images/logo_designed_by_me.png";

const EmptyLayout = () => {
  const dataStoreContext = useContext(DataStoreContext);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
      <>
        <Container maxWidth="lg">
          <Stack direction={"row"} sx={{width: "100%", mb: 2 }} justifyContent={"space-between"}  alignItems={"center"}>
            <img onClick={ () => {
              if(!dataStoreContext.token) return;
              navigate("/");
            }} style={{ height: "120px", cursor: !dataStoreContext.token ? "default": "pointer"}} src={logo} alt="logo"/>
            <Avatar ref={avatarRef}
              sx={{ bgcolor: !dataStoreContext.token ? grey :deepOrange[500], cursor: !dataStoreContext.token ? "default": "pointer" }}
              color="#fff"
              alt=""
              src="/broken-image.jpg"
              onClick={() => {
                if(!dataStoreContext.token) return;
                
                setIsMenuOpen(true)
              }}
            >
              {!dataStoreContext.token ? "" : dataStoreContext.firstName[0]}
            </Avatar>
          </Stack>

          <Menu
            id="basic-menu"
            anchorEl={avatarRef.current}
            open={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >

            <MenuItem onClick={() => {
              setIsMenuOpen(false);
              dataStoreContext.logout();
            }}>Logout</MenuItem>
          </Menu>

          {dataStoreContext.isInitialised && <Outlet />}
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