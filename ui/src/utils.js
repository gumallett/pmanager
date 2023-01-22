import { formatDistanceToNow } from "date-fns";
import VideoApi from "./api/api";

function toDuration(num) {
    if (!num) {
        return '';
    }

    const decimal = parseFloat(num) /1000 /60;

    if (isNaN(decimal)) {
        return '';
    }

    const min = Math.floor(decimal);
    let sec = Math.floor((decimal - min) * 60);

    if (sec < 10) {
        sec = `0${sec}`
    }
    return `${min}:${sec}`;
}

function displayRating(rating) {
    return rating ? rating : "Unrated";
}

function displayDateDistance(dateStr) {
    return dateStr ? formatDistanceToNow(Date.parse(dateStr), { addSuffix: true }) : dateStr;
}

function thumbnailUri(thumbUri) {
    if (!thumbUri) {
        return null;
    }
    return process.env.NODE_ENV === 'production' ? thumbUri : `${VideoApi.baseUrl}/static?path=${encodeURIComponent(thumbUri)}`;
}

const isElectron = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf('electron') !== -1 || process.env.NODE_ENV === 'production';
};

const deserializeQueryString = (search) => ({
    searchText: search.get('search') || '',
    page: search.get('page') ? parseInt(search.get('page')) : 1,
    sort: search.get('sort') || '',
    tags: search.get('tags') ? search.get('tags').split(',').map(it => ({name: it})) : [],
    tagsAsString: search.get('tags') ? search.get('tags') : "",
    excludeTags: search.get('excludeTags') ? search.get('excludeTags').split(',').map(it => ({name: it})) : [],
    excludeTagsAsString: search.get('excludeTags') ? search.get('excludeTags') : "",
    categories: search.get('categories') ? search.get('categories').split(',').map(it => ({name: it})) : [],
    categoriesAsString: search.get('categories') ? search.get('categories') : "",
});

export { toDuration, displayRating, displayDateDistance, thumbnailUri, isElectron, deserializeQueryString };
