import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { getQueryParams } from "./helpers";
import { dark as darkTheme } from "src/themes/dark.js";
import { loadSwapMetaData } from "./slices/SwapSlice";

import { Dex } from "./views";
import TopBar from "./components/TopBar/TopBar.jsx";
import Messages from "./components/Messages/Messages";
import NotFound from "./views/404/NotFound";

import { v4 as uuidv4 } from "uuid";
import "./style.scss";
import { withLDProvider, useLDClient } from "launchdarkly-react-client-sdk";
import {LocalStorage} from "./helpers/LocalStorage";

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  useSegmentAnalytics();
  const dispatch = useDispatch();
  const classes = useStyles();
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [theme, setTheme] = useState(darkTheme);
  const params = getQueryParams(window.location.search);
  const darkmodeStatus = useSelector(state => state.darkmode.DarkState);

  const client = useLDClient();
  useEffect(() => {
    dispatch(loadSwapMetaData());
    if (client) {
      const user = {
        key: "anonymous",
        anonymous: true,
        custom: params,
      };

      client.identify(user);
    }
  }, []);

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <div className={ `app ${ isSmallerScreen && "tablet" } ${ isSmallScreen && "mobile" } 
        ${darkmodeStatus === false ? 'bg-[#f9f9f9]' : 'bg-[#000]'}` }>
        <Messages />
        <TopBar />
        <div className={ `${ classes.content } ${ isSmallerScreen && classes.contentShift }
          ${darkmodeStatus === false ? 'bg-[#f7f7f7]' : 'bg-[#000]'}` }
            style={{marginLeft:0}}>
          <Switch>
            <Route exact path="/">
              <Dex />
            </Route>
            <Route component={ NotFound } />
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );
}

// Update the export default to use your environment-specific client ID and a sample user:
export default withLDProvider({
  clientSideID: "6206da63bf32891414b7031f",
  user: {
    key: LocalStorage.getOrCreate("launchDarklyUser", () => uuidv4())
  }
})(App);
