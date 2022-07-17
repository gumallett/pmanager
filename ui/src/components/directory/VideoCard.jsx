import { Box, Card, CardContent, CardMedia, Grid, Link, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Link as RouterLink } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import GradeIcon from '@mui/icons-material/Grade';
import { displayRating, thumbnailUri, toDuration } from "../../utils";
import { useCallback, useRef, useState } from "react";
import VideoPlayer from "../video/VideoPlayer";
import routes from "../../routes/routes";


const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: 15,
        marginLeft: 15,
        maxWidth: 320,
        textAlign: "left"
    },
    viewsIcon: {
        paddingTop: 2
    },
    cardContent: {
        padding: 7,
        paddingBottom: "0 !important"
    },
    bottomRow: {

    },
}));

function VideoCard({ video }) {
    const classes = useStyles();
    const [hover, setHover] = useState(false);
    const ref = useRef();

    function isOver(event) {
        return event.target && event.target.tagName
            && (event.target.tagName.toLowerCase().indexOf("img") !== -1
                || event.target.className.toLowerCase().indexOf("muicard"));
    }

    const showPreview = useCallback((event) => {
        if (!hover && isOver(event)) {
            setHover(true);
            event.preventDefault();
            return false;
        }
    }, [hover, setHover])

    const hidePreview = useCallback((event) => {
        if (hover && isOver(event)) {
            setHover(false);
            event.preventDefault();
            return false;
        }
    }, [hover, setHover]);

    return (
        <Card className={classes.card}>
            <CardMedia ref={ref} sx={{ width: 320, height: 180, overflow: "hidden" }} onMouseOver={showPreview} onMouseOut={hidePreview}>
                <Link component={RouterLink} to={`/${routes.video}/${video.id}`}>
                    {!hover ? <img
                        src={thumbnailUri(video.thumbUri)}
                        width={320}
                        height={180}
                        alt="Preview img"/> : ""}
                    <Box sx={{ width: 320, height: 180, opacity: hover ? 1 : 0 }}>
                        <VideoPlayer videoDetail={video} preview play={hover} />
                    </Box>
                </Link>
            </CardMedia>
            <CardContent className={`${classes.cardContent}`}>
                <Link variant="body2" color="secondary" component={RouterLink}
                      to={`/${routes.video}/${video.id}`}>{video.title}</Link><br/>
                <Typography variant="caption">{`${video.source}`}</Typography>
                <Grid className={classes.bottomRow} container direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
                    <Grid container direction="row" spacing={1} item xs={3} justifyContent="flex-start" alignItems="stretch">
                        <Grid item xs={6}><VisibilityIcon className={classes.viewsIcon} fontSize="small" /></Grid>
                        <Grid item xs={6}><Typography variant="caption">{`${video.views ? video.views : "0"}`}</Typography></Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1} item xs={3} justifyContent="flex-start" alignItems="stretch">
                        <Grid item xs={6}><GradeIcon className={classes.viewsIcon} fontSize="small" /></Grid>
                        <Grid item xs={6}><Typography variant="caption">{`${displayRating(video.rating)}`}</Typography></Grid>
                    </Grid>
                    <Grid container item xs={6} justifyContent="flex-end" alignItems="stretch"><Typography variant="caption">{toDuration(video.videoFileInfo.length)}</Typography></Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default VideoCard;
