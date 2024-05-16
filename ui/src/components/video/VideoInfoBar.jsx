import {Grid, Rating, Tooltip, tooltipClasses, Typography} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import GradeIcon from "@mui/icons-material/Grade";
import {displayDate, displayDateDistance, displayRating, toDuration} from "../../utils";
import {useDispatch} from "react-redux";
import {updateRating} from "./videoSlice";
import {useMemo} from "react";
import {styled} from "@mui/material/styles";

const useStyles = makeStyles(theme => ({
    viewsText: {
        display: "inline-block",
        verticalAlign: "middle"
    },
    viewsIcon: {
        display: "inline-block",
        verticalAlign: "top"
    },
}));

function DateInfo({videoDetail}) {
    const dateStr = useMemo(() => displayDate(videoDetail.videoFileInfo.createDate || ""), [videoDetail.videoFileInfo.createDate]);

    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: 'rgba(0, 0, 0, 1)',
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'rgba(0, 0, 0, 1)',
            fontSize: theme.typography.pxToRem(13),
            fontWeight: theme.typography.fontWeightBold,
        },
    }));

    return (
        <BootstrapTooltip title={dateStr} placement={"top"} arrow>
            <span>{displayDateDistance(videoDetail.videoFileInfo.createDate)}</span>
        </BootstrapTooltip>
    )
}

function VideoInfoBar({ videoDetail }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <Grid container item direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={6}>
                <Typography variant="caption"><strong>
                        <span className={classes.viewsText}>{videoDetail.views} Views | {toDuration(videoDetail.videoFileInfo.length)} | <DateInfo videoDetail={videoDetail} /> |</span>
                        <GradeIcon className={classes.viewsIcon} fontSize="small" />
                        <span className={classes.viewsText}>{displayRating(videoDetail.rating)}</span>
                </strong></Typography>
            </Grid>
            <Grid item container xs={6} justifyContent="flex-end" alignItems="flex-end">
                <span className={classes.viewsText}>
                    <Rating name="size-small" value={videoDetail.rating ? videoDetail.rating : 0} max={10} size="small"
                            onChange={(event, value) => dispatch(updateRating([videoDetail.id, value]))} />
                </span>
            </Grid>
        </Grid>
    );
}

export default VideoInfoBar;
