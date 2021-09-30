import { Grid, Rating, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import GradeIcon from "@mui/icons-material/Grade";
import { displayDateDistance, displayRating, toDuration } from "../../utils";

const useStyles = makeStyles(theme => ({
    viewsText: {
        display: "inline-block",
        verticalAlign: "middle"
    },
    viewsIcon: {
        display: "inline-block",
        verticalAlign: "middle"
    },
}));

function VideoInfoBar({ videoDetail }) {
    const classes = useStyles();

    return (
        <Grid container item direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={6}><Typography variant="caption"><strong><span className={classes.viewsText}>{videoDetail.views} Views |</span>
                <GradeIcon className={classes.viewsIcon} fontSize="small" /><span className={classes.viewsText}>{displayRating(videoDetail.rating)} | {displayDateDistance(videoDetail.videoFileInfo.createDate)} | {toDuration(videoDetail.videoFileInfo.length)}</span></strong></Typography>
            </Grid>
            <Grid item container xs={6} justifyContent="flex-end" alignItems="flex-end">
                <span className={classes.viewsText}><Rating name="size-small" value={videoDetail.rating} max={10} size="small" /></span>
            </Grid>
        </Grid>
    );
}

export default VideoInfoBar;
