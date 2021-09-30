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

const useStyles = makeStyles(theme => ({
    attributes: {
        maxWidth: 750,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 20,
        textAlign: "left"
    },
    player: {
        marginTop: 20
    },
    titleRow: {
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

function ShowVideo() {
    const classes = useStyles();
    let { id } = useParams();
    const [videoDetail, setVideoDetail] = useState({ videoFileInfo: {} });

    useEffect(() => {
        VideoApi.loadVideo(id).then(video => setVideoDetail(video))
    }, [id]);

    return (
        <div>
            <div className={classes.player}><VideoPlayer videoDetail={videoDetail} /></div>
            <div className={classes.titleRow}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={12}><Typography>{videoDetail.title}</Typography></Grid>
                    <VideoInfoBar videoDetail={videoDetail} />
                </Grid>
            </div>

            <Paper className={classes.attributes}>
                <Grid container spacing={2}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                        <VideoTextAttribute label="description" stringValue={videoDetail.description} />
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                        <VideoTextAttribute label="notes" stringValue={videoDetail.notes} />
                    </Grid>
                    <Grid container item xs={6} direction="column" justifyContent="flex-start" alignItems="flex-start">
                        <Grid item xs={6}>
                            <Typography>Categories:</Typography>
                            <Typography>{videoDetail.categories}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Tags:</Typography>
                            <Typography>{videoDetail.tags}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={6} direction="column" justifyContent="flex-start" alignItems="flex-start">
                        <Grid item xs={6}>
                            <Typography>Length:</Typography>
                            <Typography>{toDuration(videoDetail.videoFileInfo.length)}</Typography>
                            <Typography>Last Accessed:</Typography>
                            <Typography>{displayDateDistance(videoDetail.lastAccessed)}</Typography>
                            <Typography>Last Modified:</Typography>
                            <Typography>{videoDetail.lastModified ? format(Date.parse(videoDetail.lastModified), 'MM/dd/yyyy HH:mm:ss') : videoDetail.lastModified}</Typography>
                            <Typography>Created:</Typography>
                            <Typography>{videoDetail.videoFileInfo.createDate ? format(Date.parse(videoDetail.videoFileInfo.createDate), 'MM/dd/yyyy HH:mm:ss') : videoDetail.videoFileInfo.createDate}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item justifyContent="flex-start" alignItems="flex-start">
                        <Grid item>
                            <div className={classes.uri}>
                                <Typography>{videoDetail.uri}</Typography>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<SaveIcon />}
                                onClick={() => navigator.clipboard.writeText(videoDetail.uri)}
                            >
                                Copy
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Paper>
        </div>
    );
}

export default ShowVideo;
