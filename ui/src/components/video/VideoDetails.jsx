import makeStyles from "@mui/styles/makeStyles";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import VideoTextAttribute from "./VideoTextAttribute";
import {displayDateDistance} from "../../utils";
import {format} from "date-fns";
import SaveIcon from "@mui/icons-material/Save";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import {useEffect, useState} from "react";
import {styled} from "@mui/styles";
import {useDispatch} from "react-redux";
import {updateMetadata} from "./videoSlice";
import {deleteVideo} from "./videosSlice";
import {useNavigate} from "react-router-dom";

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

const CopyButton = styled(Button)({
    marginTop: "0"
});

const DeleteButton = styled(Button)({
    marginTop: "0"
});

function VideoDetails({ videoDetail, sources }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteFailure, setDeleteFailure] = useState(false);

    const [form, setForm] = useState({
        title: videoDetail.title,
        description: videoDetail.description,
        notes: videoDetail.notes,
        source: videoDetail.source
    });

    useEffect(() => {
        setForm({
            title: videoDetail.title,
            description: videoDetail.description,
            notes: videoDetail.notes,
            source: videoDetail.source
        })
    }, [videoDetail, setForm]);

    function handleFormTextChange(prop) {
        return (value) => setForm({ ...form, [`${prop}`]: value });
    }

    function handleDelete(perma = false) {
        setDeleteOpen(false);
        dispatch(deleteVideo([videoDetail.id, perma])).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                navigate("/videos");
            } else {
                setDeleteFailure(true);
            }
            return null;
        }).catch(() => setDeleteFailure(true));
    }

    return (
        <Paper className={classes.attributes}>
            <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={12}>
                    <VideoTextAttribute label="title" stringValue={form.title} onChange={handleFormTextChange("title")} />
                </Grid>
                <Grid item xs={12}>
                    <VideoTextAttribute label="description" stringValue={form.description} maxRows={7} onChange={handleFormTextChange("description")} />
                </Grid>
                <Grid item xs={12}>
                    <VideoTextAttribute label="notes" stringValue={form.notes} maxRows={7} onChange={handleFormTextChange("notes")} />
                </Grid>
                <Grid item xs={12}>
                    <VideoTextAttribute label="source" stringValue={form.source} onChange={handleFormTextChange("source")} useAutoComplete={true} autoCompleteValues={sources ? sources : []} />
                </Grid>
                <Grid container item xs={12} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={8}>
                        <Typography variant={"body2"}><strong>Filename:</strong></Typography>
                        <Typography variant={"body2"}>{videoDetail.videoFileInfo.filename}</Typography>
                        <Typography variant={"body2"}><strong>File size:</strong></Typography>
                        <Typography variant={"body2"}>{Math.floor(videoDetail.videoFileInfo.size / 1000000)} MB</Typography>
                        <Typography variant={"body2"}><strong>Dimensions:</strong></Typography>
                        <Typography variant={"body2"}>{videoDetail.videoFileInfo.width} x {videoDetail.videoFileInfo.height}</Typography>
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
                    <Typography variant={"body2"}><strong>Url:</strong></Typography>
                    <Typography className={classes.uri} variant={"body2"}>{videoDetail.uri}</Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={() => dispatch(updateMetadata([videoDetail.id, form]))}>Save Changes</Button>
                </Grid>
                <Grid item>
                    <CopyButton
                        variant="contained"
                        color="primary"
                        size="medium"
                        startIcon={<SaveIcon />}
                        onClick={() => navigator.clipboard.writeText(videoDetail.uri)}
                    >
                        Copy uri
                    </CopyButton>
                </Grid>
                <Grid item>
                    <Box>
                        <DeleteButton
                            color="error"
                            variant={"contained"}
                            size="large"
                            onClick={() => setDeleteOpen(true)}
                        ><DeleteForeverIcon /></DeleteButton>
                        {deleteFailure ? <Grid item xs={12}><Typography color={"indianred"} variant={"h6"}>Delete Operation failed</Typography></Grid> : ""}
                        <Dialog
                            open={deleteOpen}
                            onClose={() => setDeleteOpen(false)}>
                            <DialogTitle id="alert-dialog-title">
                                {"Delete video?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Cancel, delete or permanently delete the video?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setDeleteOpen(false)} autoFocus>Cancel</Button>
                                <Button onClick={() => handleDelete()}>
                                    Delete
                                </Button>
                                <Button onClick={() => handleDelete(true)}>
                                    Delete Permanently!
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default VideoDetails;
