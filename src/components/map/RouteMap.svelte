<script>
    import { onMount, onDestroy } from 'svelte';
    import { loadGoogleMapsLibrary } from '$lib/googleMaps';

    export let map;
    export let tripId;
    export let shapeId;

    let polyline;
    let stopMarkers = [];
    let infoWindow;
    let tripData = null;
    let shapeData = null;

    onMount(async () => {
        await loadGoogleMapsLibrary();
        await loadRouteData();
    });

    onDestroy(() => {
        if (polyline) polyline.setMap(null);
        stopMarkers.forEach(marker => marker.setMap(null));
        if (infoWindow) infoWindow.close();
    });

    async function loadRouteData() {
        const shapeResponse = await fetch(`/api/oba/shape/${shapeId}`);
        shapeData = await shapeResponse.json();
        console.log('shapeData:', shapeData);

        const tripResponse = await fetch(`/api/oba/trip-details/${tripId}`);
        tripData = await tripResponse.json();
        console.log('tripData:', tripData);

        if (shapeData && shapeData.data && shapeData.data.entry && shapeData.data.entry.points) {
            drawPolyline(shapeData.data.entry.points);
        }

        if (tripData && tripData.data && tripData.data.entry && tripData.data.entry.schedule && tripData.data.entry.schedule.stopTimes && tripData.data.references && tripData.data.references.stops) {
            addStopMarkers(tripData.data.entry.schedule.stopTimes, tripData.data.references.stops);
        }
    }

    function drawPolyline(points) {
        const path = points.map(point => ({ lat: point.lat, lng: point.lon }));
        polyline = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 1
        });
        polyline.setMap(map);
    }

    function addStopMarkers(stopTimes, stops) {
        stopTimes.forEach(stopTime => {
            const stop = stops.find(s => s.id === stopTime.stopId);
            if (stop) {
                const marker = new google.maps.Marker({
                    position: { lat: stop.lat, lng: stop.lon },
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5,
                        fillColor: '#FFFFFF',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: '#000000'
                    }
                });

                marker.addListener('click', () => {
                    if (infoWindow) infoWindow.close();
                    infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div>
                                <h3>${stop.name}</h3>
                                <p>Arrival time: ${new Date(stopTime.arrivalTime * 1000).toLocaleTimeString()}</p>
                            </div>
                        `
                    });
                    infoWindow.open(map, marker);
                });

                stopMarkers.push(marker);
            }
        });
    }
</script>