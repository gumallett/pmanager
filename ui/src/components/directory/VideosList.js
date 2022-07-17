import { useCallback, useEffect, useState } from "react";
import VideoApi from "../../api/api";
import { Container, Grid, Pagination } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { useSearchParams } from "react-router-dom";
import SortDropdown from "./SortDropdown";
import { VideosListGrid } from "./VideosListGrid";

const useStyles = makeStyles((theme) => ({
    topPager: {
        marginTop: 15
    },
    bottomPager: {
        marginTop: 15,
        paddingBottom: 20
    },
}));

function VideosList() {
    const classes = useStyles();
    const [videos, setVideos] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [search, setSearch] = useSearchParams();

    const getPage = useCallback(() => {
        return search.get('page') ? parseInt(search.get('page')) : 1;
    }, [search]);

    useEffect(() => {
        document.title = "Videos List"
        loadVideos(search.get('search') || "", getPage(), search.get('sort') || "")
            .then(data => initList(data));
    }, [search]);

    return (
        <Container>
            <div className="App">
                <Grid container spacing={0} direction="row" alignItems="flex-start">
                    <Grid item xs={4}>
                        <Pagination className={classes.topPager} page={getPage()} count={totalPages} shape="rounded" onChange={changePage}/>
                    </Grid>
                    <Grid item xs={2}>
                        <SortDropdown sortValue={search.get('sort')} onSortChange={changeSort} />
                    </Grid>
                </Grid>
                <VideosListGrid videos={videos} />
                <Pagination className={classes.bottomPager} page={getPage()} count={totalPages} shape="rounded" onChange={changePage}/>
            </div>
        </Container>
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
        search.set('page', val);
        setSearch(search);
    }

    function changeSort(value) {
        search.set('sort', value);
        setSearch(search);
    }
}

export default VideosList;
