import './App.css';
import VideosList from "./components/VideosList";
import { Route, Switch, useLocation } from "react-router-dom";
import ShowVideo from "./components/ShowVideo";
import {
    Container,
    createTheme,
    ThemeProvider,
    StyledEngineProvider,
    adaptV4Theme,
} from "@mui/material";
import { useEffect, useState } from "react";
import routes from "./routes/routes";
import PMNavBar from "./components/nav/PMNavBar";

const darkTheme = createTheme(adaptV4Theme({
    palette: {
        mode: 'dark',
    },
}));

function App() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === routes.video) {
            const searchParams = new URLSearchParams(location.search);
            let page = parseInt(searchParams.get('page') || 1);
            page = isNaN(page) ? 1 : page;
            setPage(page);
            setSearchQuery(searchParams.get('search') || '');
        }
    }, [location]);

    return (
        <div className="App">
            <header className="App-header">
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={darkTheme}>
                            <PMNavBar searchQuery={searchQuery} />

                            <Switch>
                                <Route exact path={routes.video}>
                                    <Container>
                                        <VideosList searchQuery={searchQuery} page={page}/>
                                    </Container>
                                </Route>

                                <Route path={`${routes.video}/:id`}>
                                    <Container>
                                        <ShowVideo/>
                                    </Container>
                                </Route>
                            </Switch>
                    </ThemeProvider>
                </StyledEngineProvider>
            </header>
        </div>
    );
}

export default App;
