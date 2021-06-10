import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "video.js/dist/video-js.css"
import VideoApi from "../api/api";
import {Typography} from "@material-ui/core";
import VideoPlayer from "./VideoPlayer";

function ShowVideo() {
    let { id } = useParams();
    const [videoDetail, setVideoDetail] = useState({ videoFileInfo: {} });

    useEffect(() => {
        VideoApi.loadVideo(id).then(video => setVideoDetail(video))
    }, [id]);

    return (
        <div>
            <Typography variant="h3">{videoDetail.title}</Typography>
            <VideoPlayer videoDetail={videoDetail} />
            <Typography>{videoDetail.description}</Typography>
        </div>
    );
}

export default ShowVideo;
