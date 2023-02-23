import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "video.js/dist/video-js.css"
import VideoApi from "../../api/api";
import { Button, Container, Grid, IconButton, TextField, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import VideoPlayer from "./VideoPlayer";
import VideoInfoBar from "./VideoInfoBar";
import VideoDetails from "./VideoDetails";
import { AddCircleOutline } from "@mui/icons-material";
import { VideosListGrid } from "../directory/VideosListGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos, selectVideos } from "./videosSlice";
import {fetchVideo, selectVideoDetails, updateCategories, updateTags} from "./videoSlice";

const useStyles = makeStyles(theme => ({
    attributes: {
        maxWidth: 750,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 20,
        textAlign: "left"
    },
    player: {
        maxWidth: 1000,
        margin: "auto",
        marginTop: 20
    },
    titleRow: {
        borderBottom: "1px solid",
        maxWidth: 750,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 0,
        textAlign: "left"
    },
    catsAndTags: {
        maxWidth: 750,
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

function AddTagControl({addTag}) {
    let [editing, setEditing] = useState(false);
    let [theTag, setTheTag] = useState("");

    function onChange(event) {
        setTheTag(event.target.value);
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
                {editing ? <TextField autoFocus={true} variant={"outlined"} size={"small"} value={theTag} onChange={onChange} /> : ""}
                <IconButton onClick={() => setEditing(!editing)}>
                    <AddCircleOutline />
                </IconButton>
            </form>
        </Fragment>
    )
}

function EditableTagControl({editTag, tagValue}) {
    const classes = useStyles();
    let [editing, setEditing] = useState(false);
    let [theTag, setTheTag] = useState(tagValue);

    function onChange(event) {
        setTheTag(event.target.value);
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
                {editing ? <TextField autoFocus={true} variant={"outlined"} size={"small"} value={theTag} onChange={onChange} /> : <span className={classes.tag} onClick={clicked}>{theTag}</span>}
            </form>
        </Fragment>
    )
}

function ShowVideo() {
    const classes = useStyles();
    const { id } = useParams();
    const [detailsVisible, showDetails] = useState(false);
    const videos = useSelector(selectVideos);
    const videoDetails = useSelector(selectVideoDetails);
    const dispatch = useDispatch();

    const recommendedVideos = useMemo(() => videos && videos.length ? videos.filter(rec => `${rec.id}` !== id) : [], [videos]);

    useEffect(() => {
        document.title = `${videoDetails.source} - ${videoDetails.title}`;
    }, [videoDetails]);

    useEffect(() => {
        const promise = dispatch(fetchVideo(id));
        return () => promise.abort();
    }, [id]);

    useEffect(() => {
        if (!videoDetails.id) {
            return
        }

        const searchQuery = `${videoDetails.title} ${videoDetails.description} ${videoDetails.tags.map(t => t.name).join(' ')}`;

        const promise = dispatch(fetchVideos([searchQuery, 0, 13, "_score,rating", [], [], [], '', '']));
        return () => promise.abort();
    }, [videoDetails, id]);

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
        <Container>
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
                            {videoDetails.categories ? videoDetails.categories.map(cat => <Grid key={cat.name} item><EditableTagControl editTag={(value) => updateExistingCat(value, cat.name)} tagValue={cat.name} /></Grid>) : ''}
                            <Grid item><AddTagControl addTag={addCat} /></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Tags:</Typography>
                        <Grid container>
                            {videoDetails.tags ? videoDetails.tags.map((tag, idx) => <Grid key={tag.name} item><EditableTagControl editTag={(value) => updateExistingTag(value, tag.name)} tagValue={tag.name} /></Grid>) : ''}
                            <Grid item><AddTagControl addTag={addTag} /></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            <Button variant="text" onClick={() => showDetails(!detailsVisible)}>{detailsVisible ? "Hide" : "Show"} Details</Button>

            {detailsVisible ? <VideoDetails videoDetail={videoDetails} /> : ""}

            <Typography variant={"h5"} sx={{textAlign: "left", p: 2}}>Related Videos:</Typography>
            <VideosListGrid videos={recommendedVideos} />

            <div><br/></div>
        </Container>
    );
}

export default ShowVideo;
