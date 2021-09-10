const baseUrl = "/gum/videos/1.0.0/videos";

const loadVideos = (query, page = 0, size = 10) => {
    return fetch(`${baseUrl}?q=${query}&page=${page}&size=${size}`)
        .then(res => res.json())
        .then(json => json.data);
};

const loadVideo = (id) => {
    return fetch(`${baseUrl}/${id}/view`).then(res => res.json()).then(json => json.data)
};

const updateVideo = (id, data) => {
    return fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }).then(res => res.json());
}

const VideoApi = {
    baseUrl,
    loadVideos,
    loadVideo,
    updateVideo
}

export default VideoApi
