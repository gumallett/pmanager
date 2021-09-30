import { useEffect, useState } from "react";
import VideoApi from "../api/api";
import { Grid } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Pagination } from '@mui/material';
import VideoCard from "./video/VideoCard";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../routes/routes";

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

function VideosList(props = {searchQuery: "", page: 1}) {
    const classes = useStyles();
    const [videos, setVideos] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const query = new URLSearchParams(useLocation().search);
    const history = useHistory();

    useEffect(() => {
        loadVideos(props.searchQuery, props.page)
            .then(data => initList(data));
    }, [props.searchQuery, props.page]);

    return (
        <div className="App">
            <Pagination className={classes.topPager} page={props.page} count={totalPages} shape="rounded" onChange={changePage}/>
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

    function loadVideos(q, page) {
        return VideoApi
            .loadVideos(q, page ? page - 1 : 0);
    }

    function initList(data) {
        setVideos(data.records);
        setTotalPages(data.totalPages);
    }

    function changePage(e, val) {
        query.set('page', val);
        query.set('search', props.searchQuery);
        history.push({
            pathname: routes.video,
            search: `?${query.toString()}`
        });
    }
}

export default VideosList;
