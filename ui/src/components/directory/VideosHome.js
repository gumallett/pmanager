import { memo, useEffect, useMemo } from "react";
import { Box, Container, Grid, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SortDropdown from "./SortDropdown";
import { VideosListGrid } from "./VideosListGrid";
import FilterPanel from "./FilterPanel";
import {
    fetchCategories,
    fetchTags,
    fetchVideos,
    selectCategories,
    selectTags,
    selectTotalPages,
    selectVideos
} from "../video/videosSlice";
import { useDispatch, useSelector } from "react-redux";
import { pageChanged, sortChanged } from "../nav/searchSlice";
import { deserializeQueryString } from "../../utils";

function PaginationAndSort({showSort = false, totalPages, currentPage, mt, pb: pb}) {
    const [search, setSearch] = useSearchParams();
    const dispatch = useDispatch();
    const deserializedParams = useMemo(() => deserializeQueryString(search), [search]);

    return (
        <Grid container spacing={0} direction="row" alignItems="flex-start">
            <Grid item xs={5}>
                <Pagination sx={{mt: mt, pb: pb}} page={currentPage} count={totalPages} shape="rounded" onChange={changePage}/>
            </Grid>
            {showSort ? <Grid item xs={2}>
                <SortDropdown sortValue={deserializedParams.sort} onSortChange={changeSort}/>
            </Grid> : ""}
        </Grid>
    )

    function changeSort(value) {
        search.set('sort', value);
        setSearch(search);
        dispatch(sortChanged(value));
    }

    function changePage(e, val) {
        search.set('page', val);
        setSearch(search);
        dispatch(pageChanged(val));
    }
}

function VideosListComp({videos = [], totalPages, currentPage}) {
    return (
        <Box>
            <PaginationAndSort showSort={true} mt={"15px"} currentPage={currentPage} totalPages={totalPages} />
            <VideosListGrid videos={videos} />
            <PaginationAndSort mt={"15px"} pb={"20px"} currentPage={currentPage} totalPages={totalPages} />
        </Box>
    );
}

const VideosList = memo(VideosListComp);

function VideosHome() {
    const dispatch = useDispatch();
    const totalPages = useSelector(selectTotalPages);
    const videos = useSelector(selectVideos);
    const cats = useSelector(selectCategories);
    const tags = useSelector(selectTags);
    const [searchParams,] = useSearchParams();

    const deserializedParams = useMemo(() => deserializeQueryString(searchParams), [searchParams]);

    useEffect(() => {
        document.title = `Videos List - ${searchParams.get("search") || ''}`;
    }, [searchParams]);

    useEffect(() => {
        const params = deserializedParams;
        const promises = loadVideos(params.searchText,
            params.page,
            params.sort,
            params.tagsAsString,
            params.excludeTagsAsString,
            params.categoriesAsString,
            params.lengthFrom,
            params.lengthTo
        );
        return () => promises.forEach(it => it.abort())
    }, [deserializedParams]);

    return (
        <Container maxWidth="xl">
            <div className="App">
                <Grid container spacing={2} direction="row" alignItems="flex-start">
                    <Grid item xs={9}>
                        <VideosList videos={videos} currentPage={deserializedParams.page} totalPages={totalPages} />
                    </Grid>
                    <Grid item xs={3}>
                        <FilterPanel tags={tags} categories={cats} />
                    </Grid>
                </Grid>
            </div>
        </Container>
    );

    function loadVideos(q, page, sort, tags, excludeTags, categories, lengthFrom, lengthTo) {
        if (q.length !== 1 && q.length !== 2) {
            return [
                dispatch(fetchVideos([q, page ? page - 1 : 0, 12, sort ? sort : undefined, tags, excludeTags, categories, lengthFrom, lengthTo])),
                dispatch(fetchTags(q)),
                dispatch(fetchCategories(q)),
            ];
        }

        return [];
    }
}

export default VideosHome;
