import {
    alpha,
    AppBar,
    Box,
    Button,
    IconButton,
    InputBase,
    Link,
    ListItemIcon, ListItemText,
    Menu,
    MenuItem,
    Toolbar
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from "@mui/icons-material/Menu";
import {Link as RouterLink, useNavigate, useSearchParams} from "react-router-dom";
import routes from "../../routes/routes";
import SearchIcon from "@mui/icons-material/Search";
import {useEffect, useMemo, useState} from "react";
import debounce from 'lodash.debounce';
import {useDispatch, useSelector} from "react-redux";
import {searchTextChanged} from "./searchSlice";
import {reindex as reindexOp, selectTotalRecords} from "../video/videosSlice";
import {deserializeQueryString} from "../../utils";
import {ArrowForwardIos} from "@mui/icons-material";

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
    const totalRecords = useSelector(selectTotalRecords);
    const history = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [adminAnchorEl, setAdminAnchorEl] = useState(null);
    const dispatch = useDispatch();

    const deserializedSearchParams = useMemo(() => deserializeQueryString(search), [search]);
    const [tmpSearchQuery, setTmpSearchQuery] = useState(deserializedSearchParams.searchText);

    const debouncedSearch = useMemo(() => {
        return debounce(updateQueryParams, 250);
    }, [search]);

    const handleClose = (anchorFns) => () => {
        anchorFns.forEach(fn => fn(null));
    };

    const handleMenu = (anchorFn) => (event) => {
        anchorFn(event.currentTarget);
    };

    const back = () => {
        history(-1);
        setAnchorEl(null);
    }

    const forward = () => {
        history(1);
        setAnchorEl(null);
    }

    const reindex = () => {
        dispatch(reindexOp());
        handleClose([setAnchorEl, setAdminAnchorEl])();
    }

    const feelingLucky = () => {
        const random = Math.floor(Math.random() * totalRecords + 1);
        history(`/${routes.video}/${random}`);
    }

    useEffect(() => {
        if (tmpSearchQuery) {
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
                        onClick={handleMenu(setAnchorEl)}>
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
                        onClose={handleClose([setAnchorEl, setAdminAnchorEl])}>
                        <MenuItem onClick={back}>Back</MenuItem>
                        <MenuItem onClick={forward}>Forward</MenuItem>
                        <MenuItem onClick={handleMenu(setAdminAnchorEl)} sx={{pr: 0}}>
                            <ListItemText>Admin</ListItemText>
                            <ListItemIcon sx={{ml: 2, pl: 2}}><ArrowForwardIos fontSize={"small"} /></ListItemIcon>
                        </MenuItem>
                    </Menu>
                    <Menu
                        anchorEl={adminAnchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(adminAnchorEl)}
                        onClose={handleClose([setAnchorEl, setAdminAnchorEl])}>
                        <MenuItem><Link onClick={handleClose([setAnchorEl, setAdminAnchorEl])} color={"inherit"} underline={"none"} component={RouterLink} to={routes.adminIndex}>Index Directory</Link></MenuItem>
                        <MenuItem onClick={reindex}>Reindex</MenuItem>
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
                        <Button
                            sx={{ml: 2}}
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={feelingLucky}
                        >
                            Feeling Lucky
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
        searchChanged('');
    }

    function updateQueryParams(q) {
        search.set('page', '1');
        search.set('search', q || '');
        history(`/${routes.video}?${search.toString()}`);
        // setSearch(search);
        dispatch(searchTextChanged(q || ''));
    }
}

export default PMNavBar;
