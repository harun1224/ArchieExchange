import { AppBar, Toolbar, Box, Button, SvgIcon, Typography, Link } from "@material-ui/core";
import DarkModeToggle from "react-dark-mode-toggle";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import DaiUSDBLP from "../../assets/logo-with-text.png";
import DaiUSDBLP_light from '../../assets/images/logo-with-text-light.png';
import NetworkMenu from "./NetworkMenu.jsx";
import OhmMenu from "./OhmMenu.jsx";
import ConnectMenu from "./ConnectMenu.jsx";
import { saveBannerStatus, bannerStatus } from "../../helpers";
import "./topbar.scss";
import { useDispatch } from "react-redux";
import { changeMode } from "src/slices/DarkmodeSlice";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ networkId, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  const darkmodeBtn1 = useMediaQuery('(min-width:800px)');
  const [showBanner, setShowBanner] = useState(bannerStatus());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const closeBanner = () => {
    setShowBanner(false);
    saveBannerStatus("hide");
  };
  const dispatch = useDispatch();
  const handleDarkMode = ()=>{
    setIsDarkMode(!isDarkMode);
    dispatch(changeMode());
  }
  return (
    <AppBar position="sticky" className={ classes.appBar } elevation={ 0 }>
      {/* {
        showBanner && (
          <Box className="top-banner" sx={ {
            width: "100%",
            py: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          } }>
            <Box sx={ { display: "flex", alignItems: "center" } }>
              <Box mr="10px">
                <img src={ DaiUSDBLP } alt="DAI-USDB" height="50px" />
              </Box>
              <Box sx={ { display: "flex", flexDirection: { xs: "column", sm: "row" } } }>
                <Box sx={ { display: "flex", flexDirection: "column" } }>
                  <Box>
                    <Typography variant="h5" style={ { fontWeight: 600 } } color="primary">
                      Earn up to 20% on DAI
                    </Typography>
                  </Box>
                  <Box sx={ { display: { xs: "none", sm: "block" } } }>
                    <Typography className="body2" color="primary">
                      No lockups, no hassle, plus impermanent loss protection
                    </Typography>
                  </Box>
                </Box>
                <Box sx={ { ml: { xs: "0", sm: "20px" } } }>
                  <Link
                    key="usdb-staking"
                    href="https://www.usdbalance.com/staking"
                    target="_blank"
                    rel="noreferrer">
                    <Button variant="contained" color="primary" style={ { fontWeight: 500, padding: {xs: "6px", sm: "10px"}, lineHeight: "unset" } }>
                      Learn more
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
            <Box sx={ { position: "absolute", right: "10px", top: "10px" } }>
              <SvgIcon component={ XIcon } color="primary" style={{cursor: "pointer"}} onClick={ closeBanner } />
            </Box>
          </Box>
        )
      } */}
      <Box  sx={ { width: "100%", padding: { xs: "0", sm: "10px" } } }>
        <Toolbar disableGutters className="dapp-topbar">
          {/* <Button
            id="hamburger"
            aria-label="open drawer"
            edge="start"
            size="large"
            variant="contained"
            color="secondary"
            onClick={ handleDrawerToggle }
            className={ classes.menuButton }
          >
            <SvgIcon component={ MenuIcon } />
          </Button> */}

          <Box sx={{ position: "absolute", left: "10px", top:"10px" }}>
            {/* { !isVerySmallScreen && <NetworkMenu /> }
            { !isVerySmallScreen && <OhmMenu /> } */}
            <img src={!isDarkMode ? DaiUSDBLP : DaiUSDBLP_light } className="max-lg:w-[200px] lg:w-[350px]" alt="DAI-USDB" height="60px"/>
            {/* <ConnectMenu networkId={ networkId } /> */}
          </Box>
          <div className=" absolute right-2 top-2">
            <DarkModeToggle
                onChange={handleDarkMode}
                checked={isDarkMode}
                size={darkmodeBtn1 === true ? 55 : 40} 
              />
          </div>
        </Toolbar>
      </Box>
    </AppBar>
  );
}

export default TopBar;
