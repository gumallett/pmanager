import { AppBar, Button, alpha, IconButton, InputBase, Link, Toolbar, Menu, MenuItem, Box } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

function PMNavBar() {
    const classes = useStyles();
    const [search, setSearch] = useSearchParams();
    const history = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const [tmpSearchQuery, setTmpSearchQuery] = useState(search.get('search') || '');

    const debouncedSearch = useMemo(() => {
        return debounce(updateQueryParams, 250);
    }, [search]);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const back = () => {
        history(-1);
        handleClose();
    }

    const forward = () => {
        history(1);
        handleClose();
    }

    useEffect(() => {
        if (tmpSearchQuery && tmpSearchQuery.length > 2) {
            debouncedSearch(tmpSearchQuery);
        }
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
                        size="large"
                        onClick={handleMenu}>
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                        <MenuItem onClick={back}>Back</MenuItem>
                        <MenuItem onClick={forward}>Forward</MenuItem>
                    </Menu>
                    <Link variant="h6" color="primary" component={RouterLink} to={routes.video}>Home</Link>
                    <Toolbar>
                        <Box className={classes.search} component="form" noValidate autoComplete="off" onSubmit={(event) => searchSubmit(event)}>
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
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={clear}
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

    function searchSubmit(event) {
        event.preventDefault();
        updateQueryParams(tmpSearchQuery);
        return false;
    }

    function clear() {
        setTmpSearchQuery('');
        if (location.pathname.endsWith('/videos')) {
            updateQueryParams('');
        }
    }

    function updateQueryParams(q) {
        setTmpSearchQuery(q);
        search.set('page', '1');
        search.set('search', q || '');
        history(`/${routes.video}?${search.toString()}`);
    }
}

export default PMNavBar;
