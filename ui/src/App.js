import './App.css';
import VideosHome from "./components/directory/VideosHome";
import { BrowserRouter, HashRouter, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import ShowVideo from "./components/video/ShowVideo";
import { adaptV4Theme, createTheme, StyledEngineProvider, ThemeProvider, } from "@mui/material";
import routes from "./routes/routes";
import PMNavBar from "./components/nav/PMNavBar";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { deserializeQueryString, isElectron } from "./utils";
import { createBrowserHistory, createHashHistory } from "history";
import { appInit, locationChanged, selectAppLoaded, selectLocation } from "./appSlice";

const darkTheme = createTheme(adaptV4Theme({
    palette: {
        mode: 'dark',
    },
}));

export const history = isElectron()
    ? createHashHistory()
    : createBrowserHistory();

function RootElement() {
    const dispatch = useDispatch();
    const [search, setSearch] = useSearchParams();
    const location = useLocation();
    const appLoaded = useSelector(selectAppLoaded);
    const currentLocation = useSelector(selectLocation);

    useEffect(() => {
        dispatch(locationChanged({
            location: location,
            search: deserializeQueryString(search)
        }));
    }, [location]);

    return (
        <div className="App">
            <header className="App-header">
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={darkTheme}>
                        <PMNavBar />

                        <Routes>
                            <Route path={routes.video} element={<VideosHome />} />
                            <Route path={`${routes.video}/:id`} element={<ShowVideo />} />
                        </Routes>
                    </ThemeProvider>
                </StyledEngineProvider>
            </header>
        </div>
    );
}

function App() {
    return (
        isElectron() ? <HashRouter history={history}>
            <RootElement />
        </HashRouter> : <BrowserRouter history={history}>
            <RootElement />
        </BrowserRouter>
    );
}

export default App;
