import { useEffect, useState } from "react";
import VideoApi from "../api/api";
import { Grid, makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import VideoCard from "./video/VideoCard";


const useStyles = makeStyles((theme) => ({
    topPager: {
        marginTop: 15
    },
    bottomPager: {
        marginTop: 15,
        paddingBottom: 20
    }
}));

function VideosList(props = {searchQuery: ""}) {
    const classes = useStyles();
    const [videos, setVideos] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadVideos(props.searchQuery, 1).then(() => setPage(1));
    }, [props.searchQuery]);

    useEffect(() => {
        loadVideos(props.searchQuery, page);
    }, [page]);

    return (
        <div className="App">
            <Pagination className={classes.topPager} page={page} count={totalPages} shape="rounded" onChange={changePage}/>
            <Grid container spacing={0} direction="row" alignItems="flex-start" justify="flex-start">
                {videos.map(video => (
                    <Grid item xs={3} key={video.id}>
                        <VideoCard video={video} />
                    </Grid>
                ))}
            </Grid>
            <Pagination className={classes.bottomPager} page={page} count={totalPages} shape="rounded" onChange={changePage}/>
        </div>
    );

    function loadVideos(q, page) {
        return VideoApi
            .loadVideos(q, page ? page - 1 : 0)
            .then(data => initList(data));
    }

    function initList(data) {
        setVideos(data.records);
        setTotalPages(data.totalPages);
    }

    function changePage(e, val) {
        setPage(val);
    }
}

export default VideosList;
