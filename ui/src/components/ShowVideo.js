import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "video.js/dist/video-js.css"
import VideoApi from "../api/api";
import {Button, Grid, Link, makeStyles, Paper, Typography} from "@material-ui/core";
import VideoPlayer from "./VideoPlayer";
import VideoTextAttribute from "./VideoTextAttribute";
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
    attributes: {
        maxWidth: 750,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 20,
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
            <Typography variant="h3">{videoDetail.title}</Typography>
            <VideoPlayer videoDetail={videoDetail} />

            <Paper className={classes.attributes}>
                <Grid container spacing={2}>
                    <Grid container xs={12} direction="row" justify="flex-start" alignItems="flex-start">
                        <VideoTextAttribute label="description" stringValue={videoDetail.description} />
                    </Grid>
                    <Grid container xs={12} direction="row" justify="flex-start" alignItems="flex-start">
                        <VideoTextAttribute label="notes" stringValue={videoDetail.notes} />
                    </Grid>
                    <Grid container xs={6} sm direction="column" justify="flex-start" alignItems="flex-start">
                        <Grid item xs={6}>
                            <Typography>Categories:</Typography>
                            <Typography>{videoDetail.categories}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Tags:</Typography>
                            <Typography>{videoDetail.tags}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container xs={6} sm direction="column" justify="flex-start" alignItems="flex-start">
                        <Grid item xs={6}>
                            <Typography>Last Accessed:</Typography>
                            <Typography>{videoDetail.lastAccessed}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Last Modified:</Typography>
                            <Typography>{videoDetail.lastModified}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container xs={12} justify="flex-start" alignItems="flex-start">
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
