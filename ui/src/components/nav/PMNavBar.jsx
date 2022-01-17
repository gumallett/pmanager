import { AppBar, Button, alpha, IconButton, InputBase, Link, Toolbar } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import routes from "../../routes/routes";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";
import debounce from 'lodash.debounce';

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
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(5),
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
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '75ch',
        },
    },
}));

function PMNavBar(props) {
    const classes = useStyles();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const history = useHistory();

    const [tmpSearchQuery, setTmpSearchQuery] = useState(query.get("search"));

    const debouncedSearch = useMemo(() => {
        return debounce(updateQueryParams, 250);
    }, [tmpSearchQuery]);

    useEffect(() => {
        debouncedSearch();
        return () => debouncedSearch.cancel();
    }, [tmpSearchQuery]);

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        size="large">
                        <MenuIcon/>
                    </IconButton>
                    <Link variant="h6" color="primary" component={RouterLink} to={routes.video}>Home</Link>
                    <Toolbar>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}><SearchIcon/></div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                value={tmpSearchQuery}
                                onChange={(event) => searchChanged(event.target.value)}
                                inputProps={{'aria-label': 'search'}}
                            />
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => searchChanged("")}
                        >
                            Clear
                        </Button>
                        <div className={classes.grow}/>
                    </Toolbar>
                </Toolbar>
            </AppBar>
        </div>
    );

    function searchChanged(q) {
        setTmpSearchQuery(q || '');
    }

    function updateQueryParams() {
        if (tmpSearchQuery && tmpSearchQuery.length > 2) {
            query.set('page', '1');
            query.set('search', tmpSearchQuery || '');
            history.push({
                pathname: routes.video,
                search: `?${query.toString()}`
            });
        } else if (!tmpSearchQuery || tmpSearchQuery.length === 0) {
            query.set('page', '1');
            query.set('search', '');
            history.push({
                pathname: routes.video,
                search: `?${query.toString()}`
            });
        }
    }
}

export default PMNavBar;
