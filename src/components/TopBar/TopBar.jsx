import { AppBar, Toolbar, Box, Button } from "@material-ui/core";
import DarkModeToggle from "react-dark-mode-toggle";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useState } from "react";
import DaiUSDBLP from "../../assets/logo-with-text.png";
import DaiUSDBLP_light from '../../assets/images/logo-with-text-light.png';
import "./topbar.scss";
import { useDispatch } from "react-redux";
import { changeMode } from "src/slices/DarkmodeSlice";
import WalletModal from "../../views/Dex/WalletModal";
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

function TopBar() {
  const classes = useStyles();
  const darkmodeBtn1 = useMediaQuery('(min-width:800px)');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletOpen, SetwalletOpen] = useState(false);
  const dispatch = useDispatch();
  const handleDarkMode = ()=>{
    setIsDarkMode(!isDarkMode);
    dispatch(changeMode());
  }

  const handleWallet=()=>{
    SetwalletOpen(false);
  }
  return (
    
    <AppBar position="sticky" className={ classes.appBar } elevation={ 0 }>
      <WalletModal open={walletOpen} onClose={handleWallet}/>
      <Box  sx={ { width: "100%", padding: { xs: "0", sm: "10px" } } }>
        <Toolbar disableGutters className="dapp-topbar">

          <Box sx={{ position: "absolute", left: "10px", top:"10px" }}>
            <img src={!isDarkMode ? DaiUSDBLP : DaiUSDBLP_light } className="max-lg:w-[200px] lg:w-[350px]" alt="DAI-USDB" height="60px"/>
          </Box>
          <Box sx={{ position: "absolute", right:"70px", top: "5px"}}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              bgcolor="#2F8AF5"
              onClick={()=> SetwalletOpen(true)}
            ><p className="text-[12px] sm:text-[16px] font-medium self-center">Connect</p></Button>
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
