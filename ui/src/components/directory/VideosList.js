import { useEffect, useState } from "react";
import VideoApi from "../../api/api";
import { Grid } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Pagination } from '@mui/material';
import VideoCard from "./VideoCard";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../../routes/routes";
import SortDropdown from "./SortDropdown";

const useStyles = makeStyles((theme) => ({
    topPager: {
        marginTop: 15
    },
    bottomPager: {
        marginTop: 15,
        paddingBottom: 20
    },
    noResults: {
        textAlign: "left"
    }
}));

function VideosList(props = {searchQuery: "", page: 1, sort: ""}) {
    const classes = useStyles();
    const [videos, setVideos] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const search = useLocation().search;
    const query = new URLSearchParams(search);
    const history = useHistory();

    useEffect(() => {
        document.title = "Videos List"
        loadVideos(props.searchQuery, props.page, props.sort)
            .then(data => initList(data));
    }, [props.searchQuery, props.page, props.sort]);

    return (
        <div className="App">
            <Grid container spacing={0} direction="row" alignItems="flex-start">
                <Grid item xs={4}>
                    <Pagination className={classes.topPager} page={props.page} count={totalPages} shape="rounded" onChange={changePage}/>
                </Grid>
                <Grid item xs={2}>
                    <SortDropdown sortValue={props.sort} onSortChange={changeSort} />
                </Grid>
            </Grid>
            <Grid container spacing={0} direction="row" alignItems="flex-start">
                {videos.length > 0 ? videos.map(video => (
                    <Grid item xs={3} key={video.id}>
                        <VideoCard video={video} />
                    </Grid>
                )) : <Grid item xs={12}><p className={classes.noResults}>No results found.</p></Grid> }
            </Grid>
            <Pagination className={classes.bottomPager} page={props.page} count={totalPages} shape="rounded" onChange={changePage}/>
        </div>
    );

    function loadVideos(q, page, sort) {
        return VideoApi
            .loadVideos(q, page ? page - 1 : 0, 12, sort ? sort : undefined);
    }

    function initList(data) {
        setVideos(data.records);
        setTotalPages(data.totalPages);
    }

    function changePage(e, val) {
        query.set('page', val);
        history.push({
            pathname: routes.video,
            search: `?${query.toString()}`
        });
    }

    function changeSort(value) {
        query.set('sort', value);
        history.push({
            pathname: routes.video,
            search: `?${query.toString()}`
        });
    }
}

export default VideosList;
