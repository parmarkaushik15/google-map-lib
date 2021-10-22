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
function decode(t) {
    let points = [];
    for (let step of t) {
        let encoded = step.polyline.points;
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;
        while (index < len) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
        }
    }
    return points;
}
async function getDirectionRoutePath(key, origin, destination, waypoints) {
    let url = 'https://maps.googleapis.com/maps/api/directions/json';
    url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    let routes = [];
    let precision = "low"
    for (const route of data.routes) {
        let r = {
            distance: route.legs.reduce((carry, curr) => {
                return carry + curr.distance.value;
            }, 0) / 1000,
            duration: route.legs.reduce((carry, curr) => {
                return carry + (curr.duration_in_traffic ? curr.duration_in_traffic.value : curr.duration.value);
            }, 0) / 60,
            coordinatesList: (
                (precision === 'low') ?
                    decode([{ polyline: route.overview_polyline }]) :
                    route.legs.reduce((carry, curr) => {
                        return [
                            ...carry,
                            ...decode(curr.steps),
                        ];
                    }, [])
            ),
            fare: route.fare,
            waypointOrder: route.waypoint_order,
        };
        routes.push(r);
    }
    return routes;
};


module.exports = {
    getNearByPlaceTextSearch,
    getNearByPlaceSearch,
    getLocationDetail,
    getDirectionRoutePath
}