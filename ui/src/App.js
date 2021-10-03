import './App.css';
import VideosList from "./components/directory/VideosList";
import { Route, Switch, useLocation } from "react-router-dom";
import ShowVideo from "./components/video/ShowVideo";
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
    const [sort, setSort] = useState();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === routes.video) {
            const searchParams = new URLSearchParams(location.search);
            let page = parseInt(searchParams.get('page') || 1);
            page = isNaN(page) ? 1 : page;
            setPage(page);
            setSearchQuery(searchParams.get('search') || '');
            setSort(searchParams.get('sort') || '');
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
                                        <VideosList searchQuery={searchQuery} page={page} sort={sort}/>
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
