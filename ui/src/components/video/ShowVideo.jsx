import {Fragment, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import "video.js/dist/video-js.css"
import {Autocomplete, Button, Container, Grid, IconButton, TextField, Typography} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import VideoPlayer from "./VideoPlayer";
import VideoInfoBar from "./VideoInfoBar";
import VideoDetails from "./VideoDetails";
import {AddCircleOutline} from "@mui/icons-material";
import {VideosListGrid} from "../directory/VideosListGrid";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchCategories,
    fetchRelatedVideos, fetchSources, fetchTags,
    fetchVideo,
    selectCategories, selectRelatedVideos,
    selectSources,
    selectTags,
    selectVideoDetails,
    updateCategories,
    updateTags
} from "./videoSlice";

const useStyles = makeStyles(theme => ({
    attributes: {
        maxWidth: 1000,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 20,
        textAlign: "left"
    },
    titleRow: {
        borderBottom: "1px solid",
        maxWidth: 1000,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 0,
        textAlign: "left"
    },
    catsAndTags: {
        maxWidth: 1000,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 0,
        textAlign: "left"
    },
    button: {
        margin: "0 0 0 -15",
    },
    tag: {
        display: "inline-block",
        backgroundColor: theme.palette.primary.main,
        backgroundRepeat: "repeat",
        backgroundAttachment: "scroll",
        backgroundPosition: "0% 0%",
        color: "rgba(0, 0, 0, 0.87)",
        margin: "5px 5px 0 0",
        padding: "0.2em 0.8125em",
        borderRadius: "30px",
        fontWeight: "500",
    }
}));

function AddTagControl({addTag, values}) {
    let [editing, setEditing] = useState(false);
    let [theTag, setTheTag] = useState("");

    function onChange(event, value) {
        setTheTag(value);
    }

    function onSubmit(event) {
        addTag(theTag);
        setEditing(false);
        setTheTag("");
        event.preventDefault();
    }

    return (
        <Fragment>
            <form noValidate autoComplete={"off"} onSubmit={onSubmit}>
                {editing ? <Autocomplete sx={{minWidth: '240px'}} disablePortal selectOnFocus clearOnBlur freeSolo value={theTag || ""} onInputChange={onChange}
                                         renderInput={(params) => <TextField {...params} autoFocus size={"small"} variant={"outlined"} />}
                                         options={values ? values : []} /> : ""}
                <IconButton onClick={() => setEditing(!editing)}>
                    <AddCircleOutline />
                </IconButton>
            </form>
        </Fragment>
    )
}

function EditableTagControl({editTag, tagValue, values}) {
    const classes = useStyles();
    let [editing, setEditing] = useState(false);
    let [theTag, setTheTag] = useState(tagValue);

    function onChange(event, value) {
        setTheTag(value);
    }

    function onSubmit(event) {
        editTag(theTag);
        setEditing(false);
        setTheTag(theTag);
        event.preventDefault();
    }

    function clicked() {
        setEditing(!editing);
    }

    return (
        <Fragment>
            <form noValidate autoComplete={"off"} onSubmit={onSubmit}>
                {editing ? <Autocomplete sx={{minWidth: '240px'}} disablePortal selectOnFocus clearOnBlur freeSolo value={theTag || ""} onInputChange={onChange}
                                         renderInput={(params) => <TextField {...params} autoFocus size={"small"} variant={"outlined"} />}
                                         options={values ? [...values.filter(it => it !== theTag), theTag] : []} />
                    : <span className={classes.tag} onClick={clicked}>{theTag}</span>}
            </form>
        </Fragment>
    )
}

function ShowVideo() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [detailsVisible, showDetails] = useState(false);
    const videos = useSelector(selectRelatedVideos);
    const videoDetails = useSelector(selectVideoDetails);
    const tags = useSelector(selectTags);
    const cats = useSelector(selectCategories);
    const sources = useSelector(selectSources);
    const sourcesValues = useMemo(() => sources && sources ? sources.map(it => it.name) : [], [sources]);

    const recommendedVideos = useMemo(() => videos && videos.length ? videos.filter(rec => `${rec.id}` !== id) : [], [videos, id]);
    const filteredTags = useMemo(() => tags && tags.length
        ? tags.filter(it => (videoDetails.tags || []).map(it => it.name).indexOf(it.name) === -1).map(it => it.name)
        : [], [videoDetails.tags, tags]);
    const filteredCats = useMemo(() => cats && cats.length
        ? cats.filter(it => (videoDetails.categories || []).map(it => it.name).indexOf(it.name) === -1).map(it => it.name)
        : [], [videoDetails.categories, cats]);

    useEffect(() => {
        document.title = `${videoDetails.source} - ${videoDetails.title}`;
    }, [videoDetails]);

    useEffect(() => {
        const promise = dispatch(fetchVideo(id));
        return () => promise.abort();
    }, [id, dispatch]);

    useEffect(() => {
        if (!videoDetails.id) {
            return
        }

        const searchQuery = `${videoDetails.title} ${videoDetails.categories.map(t => t.name).join(' ')} ${videoDetails.tags.map(t => t.name).join(' ')}`;

        const videoPromise = dispatch(fetchRelatedVideos([searchQuery, 0, 13, "_score,rating", '', '', '', '', '', '']));
        const catsPromise = dispatch(fetchCategories(""));
        const tagsPromise = dispatch(fetchTags(""));
        const sourcesPromise = dispatch(fetchSources(""));

        return () => {
            videoPromise.abort();
            catsPromise.abort();
            tagsPromise.abort();
            sourcesPromise.abort();
        };
    }, [videoDetails, dispatch]);

    function addTag(newTag) {
        const currentTags = videoDetails.tags || [];
        if (newTag && currentTags.map(tag => tag.name).indexOf(newTag) === -1) {
            dispatch(updateTags([id, [...currentTags, {name: newTag}]]))
        }
    }

    function updateExistingTag(newTag, oldTag) {
        const currentTags = videoDetails.tags.filter(tag => tag.name !== oldTag) || [];
        const newTags = newTag ? [...currentTags, {name: newTag}] : currentTags;
        dispatch(updateTags([id, newTags]))
    }

    function addCat(newCat) {
        const currentCats = videoDetails.categories || [];
        if (newCat && currentCats.map(cat => cat.name).indexOf(newCat) === -1) {
            const newCats = [...currentCats, {name: newCat}];
            dispatch(updateCategories([id, newCats]));
        }
    }

    function updateExistingCat(newCat, oldCat) {
        const currentCats = videoDetails.categories.filter(cat => cat.name !== oldCat) || [];
        const newCats = newCat ? [...currentCats, {name: newCat}] : currentCats;
        dispatch(updateCategories([id, newCats]));
    }

    return (
        <Container maxWidth={"xl"}>
            <VideoPlayer videoDetail={videoDetails} />
            <div className={classes.titleRow}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={12}><Typography>{videoDetails.title}</Typography></Grid>
                    <VideoInfoBar videoDetail={videoDetails} />
                </Grid>
            </div>
            <div className={classes.catsAndTags}>
                <Grid container item xs={12} spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Categories:</Typography>
                        <Grid container>
                            {videoDetails.categories ? videoDetails.categories.map(cat => <Grid key={cat.name} item><EditableTagControl editTag={(value) => updateExistingCat(value, cat.name)} tagValue={cat.name} values={filteredCats} /></Grid>) : ''}
                            <Grid item><AddTagControl addTag={addCat} values={filteredCats} /></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Tags:</Typography>
                        <Grid container>
                            {videoDetails.tags ? videoDetails.tags.map((tag, idx) => <Grid key={tag.name} item><EditableTagControl editTag={(value) => updateExistingTag(value, tag.name)} tagValue={tag.name} values={filteredTags} /></Grid>) : ''}
                            <Grid item><AddTagControl addTag={addTag} values={filteredTags} /></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            <Button variant="text" onClick={() => showDetails(!detailsVisible)}>{detailsVisible ? "Hide" : "Show"} Details</Button>

            {detailsVisible ? <VideoDetails videoDetail={videoDetails} sources={sourcesValues} /> : ""}

            <Typography variant={"h5"} sx={{textAlign: "left", p: 2}}>Related Videos:</Typography>
            <VideosListGrid videos={recommendedVideos} />

            <div><br/></div>
        </Container>
    );
}

export default ShowVideo;
