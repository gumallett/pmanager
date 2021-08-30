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

export { toDuration };
