async function getNearByPlaceSearch(key, location, radius, type) {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    url += `?location=${location}&radius=${radius}&type=${type}&key=${key}`;
    return await fetch(url, {
        method: GET,
        body: null,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

module.exports = {
    getNearByPlaceSearch
}