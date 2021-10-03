import makeStyles from "@mui/styles/makeStyles";
import { Button, Grid, Paper, Typography } from "@mui/material";
import VideoTextAttribute from "./VideoTextAttribute";
import { displayDateDistance } from "../../utils";
import { format } from "date-fns";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
    attributes: {
        maxWidth: 750,
        padding: theme.spacing(2),
        margin: "auto",
        marginTop: 20,
        textAlign: "left"
    },
    uri: {
        overflowWrap: "anywhere"
    },
}));

function VideoDetails({ videoDetail, onSave }) {
    const classes = useStyles();

    const [form, setForm] = useState({
        title: videoDetail.title,
        description: videoDetail.description,
        notes: videoDetail.notes,
        source: videoDetail.source
    });

    function handleFormTextChange(prop) {
        return event => setForm({ ...form, [`${prop}`]: event.target.value });
    }

    return (
        <Paper className={classes.attributes}>
            <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={12}>
                    <VideoTextAttribute label="title" stringValue={form.title} onChange={handleFormTextChange("title")} />
                </Grid>
                <Grid item xs={12}>
                    <VideoTextAttribute label="description" stringValue={form.description} maxRows={3} onChange={handleFormTextChange("description")} />
                </Grid>
                <Grid item xs={12}>
                    <VideoTextAttribute label="notes" stringValue={form.notes} onChange={handleFormTextChange("notes")} />
                </Grid>
                <Grid item xs={12}>
                    <VideoTextAttribute label="source" stringValue={form.source} onChange={handleFormTextChange("source")} />
                </Grid>
                <Grid container item xs={12} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={8}>
                        <Typography variant={"body2"}><strong>Filename:</strong></Typography>
                        <Typography variant={"body2"}>{videoDetail.videoFileInfo.filename}</Typography>
                        <Typography variant={"body2"}><strong>File size:</strong></Typography>
                        <Typography variant={"body2"}>{Math.floor(videoDetail.videoFileInfo.size / 1000000)} MB</Typography>
                        <Typography variant={"body2"}><strong>Dimensions:</strong></Typography>
                        <Typography variant={"body2"}>{videoDetail.videoFileInfo.width} x {videoDetail.videoFileInfo.height}</Typography>
                        <Typography variant={"body2"}><strong>Url:</strong></Typography>
                        <Typography variant={"body2"}>{videoDetail.uri}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant={"body2"}><strong>Last Accessed:</strong></Typography>
                        <Typography variant={"body2"}>{displayDateDistance(videoDetail.lastAccessed)}</Typography>
                        <Typography variant={"body2"}><strong>Last Modified:</strong></Typography>
                        <Typography variant={"body2"}>{videoDetail.lastModified ? format(Date.parse(videoDetail.lastModified), 'MM/dd/yyyy HH:mm:ss') : videoDetail.lastModified}</Typography>
                        <Typography variant={"body2"}><strong>Created:</strong></Typography>
                        <Typography variant={"body2"}>{videoDetail.videoFileInfo.createDate ? format(Date.parse(videoDetail.videoFileInfo.createDate), 'MM/dd/yyyy HH:mm:ss') : videoDetail.videoFileInfo.createDate}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={() => onSave(form)}>Save Changes</Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default VideoDetails;
