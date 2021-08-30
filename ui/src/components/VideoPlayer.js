import {useEffect, useRef, Fragment} from "react";
import VideoApi from "../api/api";
import videojs from "video.js";

function VideoPlayer({ videoDetail = {} }) {
    let videoRef = useRef(null);
    let playerRef = useRef(null);

    useEffect(() => {
        if (!playerRef.current) {
            if (!videoRef.current) {
                return;
            }

            if (videoDetail.id) {
                playerRef.current = videojs(videoRef.current);
            }
        }
    }, [videoDetail]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    const apiStaticPath = `${VideoApi.baseUrl}/static?path=${encodeURIComponent(videoDetail.uri)}&videoId=${encodeURIComponent(videoDetail.id)}`;
    return (
        <div className="show-video-video">
            <video id="player" controls width="660" preload="auto" className="video-js" ref={videoRef}>
                {videoDetail.id ? <source src={apiStaticPath} type={videoDetail.videoFileInfo.contentType} /> : <Fragment />}
                Sorry, your browser doesn't support embedded videos.
            </video>
        </div>
    );
}

export default VideoPlayer;
