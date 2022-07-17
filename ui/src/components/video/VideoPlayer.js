import { useCallback, useEffect, useRef } from "react";
import VideoApi from "../../api/api";
import videojs from "video.js";
import { thumbnailUri } from "../../utils";

import './videoPlayer.css';
import { Box } from "@mui/material";


function VideoPlayer({ videoDetail = {}, preview = false, play = false }) {
    let videoRef = useRef(null);
    let playerRef = useRef(null);

    const createPlayerOptions = useCallback(() => {
        const videoUri = preview ? videoDetail.previewUri : videoDetail.uri;
        const apiStaticPath = `${VideoApi.baseUrl}/static?path=${encodeURIComponent(videoUri)}&videoId=${encodeURIComponent(videoDetail.id)}`;

        return {
            sources: [{src: process.env.NODE_ENV === 'production' ? videoUri : apiStaticPath, type: videoDetail.videoFileInfo.contentType}],
            controls: !preview,
            preload: preview ? 'auto' : 'auto',
            inactivityTimeout: 5000,
            fluid: true,
            aspectRatio: preview ? "16:9" : "16:9",
            loop: preview,
            muted: preview,
            autoplay: false,
            poster: thumbnailUri(videoDetail.thumbUri),
        };
    }, [videoDetail.id, preview])

    const setupPlayer = useCallback(() => {
        return videojs(videoRef.current, createPlayerOptions());
    }, [videoRef, createPlayerOptions]);

    useEffect(() => {
        if (!playerRef.current) {
            if (!videoRef.current) {
                return;
            }

            if (videoDetail.id) {
                playerRef.current = setupPlayer();
            }
        } else {
            const player = playerRef.current;
            const newOpts = player.options(createPlayerOptions());
            player.poster(newOpts.poster);
            player.src(newOpts.sources);
        }
    }, [videoDetail.id, videoRef, playerRef, createPlayerOptions, setupPlayer]);

    useEffect(() => {
        const player = playerRef.current;

        if (videoRef.current && player) {
            if (preview && play) {
                player.play();
            }
        }
    }, [preview, playerRef, videoRef, play]);

    // Dispose the Video.js player when the functional component unmounts
    // not working in react 18
    // useEffect(() => {
    //     return () => {
    //         if (playerRef.current) {
    //             playerRef.current.dispose();
    //             playerRef.current = null;
    //         }
    //     };
    // }, [playerRef]);


    return (
        <Box sx={{ display: "flex", width: "100%", height: preview ? "100%" : "", mt: preview ? 0 : 2 }}>
            <video className="video-js" ref={videoRef}>
                Sorry, your browser doesn't support embedded videos.
            </video>
        </Box>
    );
}

export default VideoPlayer;
