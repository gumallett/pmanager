import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "video.js/dist/video-js.css"
import VideoApi from "../../api/api";
import { Button, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import VideoPlayer from "./VideoPlayer";
import VideoTextAttribute from "./VideoTextAttribute";
import SaveIcon from '@mui/icons-material/Save';
import { displayDateDistance, toDuration } from "../../utils";
import { format } from "date-fns";
import VideoInfoBar from "./VideoInfoBar";
import { styled } from "@mui/styles";
import VideoDetails from "./VideoDetails";
import { AddCircleOutline } from "@mui/icons-material";
import { VideosListGrid } from "../directory/VideosListGrid";

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

const CopyButton = styled(Button)({
    marginTop: "7px"
});

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
    let { id } = useParams();
    const [videoDetail, setVideoDetail] = useState({ videoFileInfo: {} });
    const [detailsVisible, showDetails] = useState(false);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        VideoApi.loadVideo(id).then(video => {
            setVideoDetail(video);
            document.title = `${video.source} - ${video.title}`;
        })
    }, [id]);

    useEffect(() => {
        if (!videoDetail.id) {
            return
        }

        const searchQuery = `${videoDetail.title} ${videoDetail.description} ${videoDetail.tags.map(t => t.name).join(' ')}`;
        VideoApi
            .loadVideos(searchQuery, 0, 13, "_score,rating")
            .then(data => data.records ? setVideos(data.records.filter(rec => `${rec.id}` !== id)) : []);
    }, [videoDetail, id]);

    function updateRating(newVal) {
        VideoApi.updateVideo(id, {rating: newVal});
        setVideoDetail({ ...videoDetail, rating: newVal })
    }

    function updateVideoMetadata(data) {
        VideoApi.updateVideo(id, data);
        setVideoDetail({ ...videoDetail, ...data });
    }

    function addTag(newTag) {
        const currentTags = videoDetail.tags || [];
        if (newTag && currentTags.map(tag => tag.name).indexOf(newTag) === -1) {
            const newTags = [...currentTags, {name: newTag}];
            VideoApi.updateVideo(id, {tags: newTags});
            setVideoDetail({ ...videoDetail, tags: newTags })
        }
    }

    function updateExistingTag(newTag, oldTag) {
        const currentTags = videoDetail.tags.filter(tag => tag.name !== oldTag) || [];
        const newTags = newTag ? [...currentTags, {name: newTag}] : currentTags;
        VideoApi.updateVideo(id, {tags: newTags});
        setVideoDetail({ ...videoDetail, tags: newTags });
    }

    function addCat(newCat) {
        const currentCats = videoDetail.categories || [];
        if (newCat && currentCats.map(cat => cat.name).indexOf(newCat) === -1) {
            const newTags = [...currentCats, {name: newCat}];
            VideoApi.updateVideo(id, {categories: newTags});
            setVideoDetail({ ...videoDetail, categories: newTags })
        }
    }

    function updateExistingCat(newCat, oldCat) {
        const currentCats = videoDetail.categories.filter(cat => cat.name !== oldCat) || [];
        const newCats = newCat ? [...currentCats, {name: newCat}] : currentCats;
        VideoApi.updateVideo(id, {categories: newCats});
        setVideoDetail({ ...videoDetail, categories: newCats });
    }

    return (
        <Container>
            <VideoPlayer videoDetail={videoDetail} />
            <div className={classes.titleRow}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={12}><Typography>{videoDetail.title}</Typography></Grid>
                    <VideoInfoBar videoDetail={videoDetail} onRatingUpdate={updateRating} />
                    <Grid item xs={12}>
                        <CopyButton
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            onClick={() => navigator.clipboard.writeText(videoDetail.uri)}
                        >
                            Copy uri
                        </CopyButton>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.catsAndTags}>
                <Grid container item xs={12} spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={12}>
                        <Typography>Categories:</Typography>
                        <Grid container>{videoDetail.categories ? videoDetail.categories.map(cat => <Grid key={cat.name} item><EditableTagControl editTag={(value) => updateExistingCat(value, cat.name)} tagValue={cat.name} /></Grid>) : ''}</Grid>
                        <AddTagControl addTag={addCat} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Tags:</Typography>
                        <Grid container>{videoDetail.tags ? videoDetail.tags.map((tag, idx) => <Grid key={tag.name} item><EditableTagControl editTag={(value) => updateExistingTag(value, tag.name)} tagValue={tag.name} /></Grid>) : ''}</Grid>
                        <AddTagControl addTag={addTag} />
                    </Grid>
                </Grid>
            </div>

            <Button variant="text" onClick={() => showDetails(!detailsVisible)}>{detailsVisible ? "Hide" : "Show"} Details</Button>

            {detailsVisible ? <VideoDetails videoDetail={videoDetail} onSave={updateVideoMetadata}/> : ""}

            <Typography variant={"h5"} sx={{textAlign: "left", p: 2}}>Related Videos:</Typography>
            <VideosListGrid videos={videos} />

            <div><br/></div>
        </Container>
    );
}

export default ShowVideo;
