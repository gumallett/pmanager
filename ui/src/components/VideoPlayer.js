import {useEffect, useRef, Fragment} from "react";
import VideoApi from "../api/api";
import videojs from "video.js";

function VideoPlayer({ videoDetail = {} }) {
    const videoRef = useRef()
    const playerRef = useRef();

    useEffect(() => {
        if (videoDetail.id) {
            if (playerRef.current) {
                playerRef.current.dispose();
            }
            playerRef.current = videojs(videoRef.current)
            return () => {
                if (playerRef.current) {
                    playerRef.current.dispose();
                }
            }
        }
    }, [videoDetail, playerRef, videoRef]);

    return (
        <div className="show-video-video">
            <video id="player" controls width="650" className="video-js" ref={videoRef}>
                {videoDetail.id ? <source src={`${VideoApi.baseUrl}/${videoDetail.id}/download`} type={videoDetail.videoFileInfo.contentType} /> : <Fragment />}
                Sorry, your browser doesn't support embedded videos.
            </video>
        </div>
    );
}

export default VideoPlayer;
