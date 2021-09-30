import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "video.js/dist/video-js.css"
import VideoApi from "../api/api";
import { Button, Grid, Paper, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import VideoPlayer from "./VideoPlayer";
import VideoTextAttribute from "./VideoTextAttribute";
import SaveIcon from '@mui/icons-material/Save';
import { displayDateDistance, toDuration } from "../utils";
import { format } from "date-fns";
import VideoInfoBar from "./video/VideoInfoBar";
import { styled } from "@mui/styles";
import VideoDetails from "./video/VideoDetails";

const useStyles = makeStyles(theme => ({
    attributes: {
        maxWidth: 750,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 20,
        textAlign: "left"
    },
    player: {
        maxWidth: 750,
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
    uri: {
        overflowWrap: "anywhere"
    }
}));

const CopyButton = styled(Button)({
    marginTop: "7px"
});

function ShowVideo() {
    const classes = useStyles();
    let { id } = useParams();
    const [videoDetail, setVideoDetail] = useState({ videoFileInfo: {} });
    const [detailsVisible, showDetails] = useState(false);

    useEffect(() => {
        VideoApi.loadVideo(id).then(video => setVideoDetail(video))
    }, [id]);

    function updateRating(newVal) {
        VideoApi.updateVideo(id, {rating: newVal});
        setVideoDetail({ ...videoDetail, rating: newVal })
    }

    function updateVideoMetadata(data) {
        VideoApi.updateVideo(id, data);
        setVideoDetail({ ...videoDetail, ...data });
    }

    return (
        <div>
            <div className={classes.player}><VideoPlayer videoDetail={videoDetail} /></div>
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
                        <Typography>{videoDetail.categories}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Tags:</Typography>
                        <Typography>{videoDetail.tags}</Typography>
                    </Grid>
                </Grid>
            </div>

            <Button variant="text" onClick={() => showDetails(!detailsVisible)}>{detailsVisible ? "Hide" : "Show"} Details</Button>

            {detailsVisible ? <VideoDetails videoDetail={videoDetail} onSave={updateVideoMetadata}/> : ""}
            <div><br/></div>
        </div>
    );
}

export default ShowVideo;
