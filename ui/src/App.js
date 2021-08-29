import './App.css';
import VideosList from "./components/VideosList";
import {BrowserRouter as Router, Link as RouterLink, Route, Switch} from "react-router-dom";
import ShowVideo from "./components/ShowVideo";
import {
    AppBar, Button,
    Container,
    createMuiTheme,
    fade,
    IconButton,
    InputBase,
    Link,
    makeStyles,
    MuiThemeProvider,
    Toolbar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import {useState} from "react";
import SaveIcon from "@material-ui/icons/Save";

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

function App() {
    const classes = useStyles();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="App">
            <header className="App-header">
                <MuiThemeProvider theme={darkTheme}>
                    <Router>
                        <div className={classes.grow}>
                            <AppBar position="static">
                                <Toolbar>
                                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                        <MenuIcon />
                                    </IconButton>
                                    <Link variant="h6" color="secondary" component={RouterLink} to="/">Home</Link>
                                    <Toolbar>
                                        <div className={classes.search}>
                                            <div className={classes.searchIcon}><SearchIcon /></div>
                                            <InputBase
                                                placeholder="Search…"
                                                classes={{
                                                    root: classes.inputRoot,
                                                    input: classes.inputInput,
                                                }}
                                                value={searchQuery}
                                                onChange={(event) => setSearchQuery(event.target.value)}
                                                inputProps={{ 'aria-label': 'search' }}
                                            />
                                        </div>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            Clear
                                        </Button>
                                        <div className={classes.grow} />
                                    </Toolbar>
                                </Toolbar>
                            </AppBar>
                        </div>

                        <Switch>
                            <Route exact path="/">
                                <Container>
                                    <VideosList searchQuery={searchQuery} />
                                </Container>
                            </Route>
                            <Route path="/videos/:id">
                                <Container>
                                    <ShowVideo />
                                </Container>
                            </Route>
                        </Switch>
                    </Router>
                </MuiThemeProvider>
            </header>
        </div>
    );
}

export default App;
