import { useCallback, useEffect, useState } from "react";
import VideoApi from "../../api/api";
import { Box, Container, Grid, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SortDropdown from "./SortDropdown";
import { VideosListGrid } from "./VideosListGrid";
import FilterPanel from "./FilterPanel";

function PaginationAndSort({showSort = false, totalPages, mt, pb: pb}) {
    const [search, setSearch] = useSearchParams();

    const getPage = useCallback(() => {
        return search.get('page') ? parseInt(search.get('page')) : 1;
    }, [search]);

    return (
        <Grid container spacing={0} direction="row" alignItems="flex-start">
            <Grid item xs={4}>
                <Pagination sx={{mt: mt, pb: pb}} page={getPage()} count={totalPages} shape="rounded" onChange={changePage}/>
            </Grid>
            {showSort ? <Grid item xs={2}>
                <SortDropdown sortValue={search.get('sort')} onSortChange={changeSort}/>
            </Grid> : ""}
        </Grid>
    )

    function changeSort(value) {
        search.set('sort', value);
        setSearch(search);
    }

    function changePage(e, val) {
        search.set('page', val);
        setSearch(search);
    }
}

function VideosList({videos = [], totalPages}) {
    return (
        <Box>
            <PaginationAndSort showSort={true} mt={"15px"} totalPages={totalPages} />
            <VideosListGrid videos={videos} />
            <PaginationAndSort mt={"15px"} pb={"20px"} totalPages={totalPages} />
        </Box>
    );
}

function VideosHome() {
    const [videos, setVideos] = useState([]);
    const [tags, setTags] = useState([]);
    const [cats, setCats] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [search, setSearch] = useSearchParams();

    const getPage = useCallback(() => {
        return search.get('page') ? parseInt(search.get('page')) : 1;
    }, [search]);

    useEffect(() => {
        document.title = "Videos List"
        loadVideos(search.get('search') || "",
            getPage(),
            search.get('sort') || "",
            search.get('tags') || "",
            search.get('excludeTags') || "",
            search.get('categories') || "").then(data => initList(data));
        VideoApi.fetchTags(search.get('search') || "").then(data => setTags(data.records));
        VideoApi.fetchCategories(search.get('search') || "").then(data => setCats(data.records));
    }, [search]);

    return (
        <Container maxWidth="xl">
            <div className="App">
                <Grid container spacing={2} direction="row" alignItems="flex-start">
                    <Grid item xs={9}>
                        <VideosList videos={videos} totalPages={totalPages} />
                    </Grid>
                    <Grid item xs={3}>
                        <FilterPanel tags={tags} categories={cats} />
                    </Grid>
                </Grid>
            </div>
        </Container>
    );

    function loadVideos(q, page, sort, tags, excludeTags, categories) {
        return VideoApi
            .loadVideos(q, page ? page - 1 : 0, 12, sort ? sort : undefined, tags, excludeTags, categories);
    }

    function initList(data) {
        setVideos(data.records);
        setTotalPages(data.totalPages);
    }
}

export default VideosHome;
