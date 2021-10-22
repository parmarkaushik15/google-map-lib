async function getNearByPlaceSearch(key, location, radius, type) {
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    url += `?location=${location}&radius=${radius}&type=${type}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};
async function getNearByPlaceTextSearch(key, location, radius, type) {
    let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    url += `?location=${location}&radius=${radius}&query=${type}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};
async function getLocationDetail(key, location) {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json';
    url += `?address=${location}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};
async function getDirectionRoutePath(key, origin, destination, waypoints) {
    let url = 'https://maps.googleapis.com/maps/api/directions/json';
    url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};


module.exports = {
    getNearByPlaceTextSearch,
    getNearByPlaceSearch,
    getLocationDetail,
    getDirectionRoutePath
}