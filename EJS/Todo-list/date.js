
exports.getDate = function() {
    let today = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    let day = today.toLocaleDateString("en-UK", options);
    return day;
}

exports.getDay = function() {
    let today = new Date();
    let options = {
        weekday: 'long'
    };
    let day = today.toLocaleDateString("en-UK", options);
    return day;
}