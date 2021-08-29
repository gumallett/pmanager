const baseUrl = "/gum/videos/1.0.0/videos";

const loadVideos = (query, page = 0, size = 10) => {
    return fetch(`${baseUrl}?q=${query}&page=${page}&size=${size}`)
        .then(res => res.json())
        .then(json => json.data);
};

const loadVideo = (id) => {
    return fetch(`${baseUrl}/${id}`).then(res => res.json()).then(json => json.data)
};

const VideoApi = {
    baseUrl,
    loadVideos,
    loadVideo
}

export default VideoApi
