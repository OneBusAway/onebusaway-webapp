import PopupContent from '$components/map/PopupContent.svelte';
import { MapSource } from '$config/mapSource';

let globalInfoWindow = null;
let popupContentComponent = null;

let stopMarkers = [];

export function addStopMarker(mapProvider, mapSource, stop, stopTime = null) {
	const popupContainer = document.createElement('div');

	switch (mapSource) {
		case MapSource.Google: {
			const marker = new google.maps.Marker({
				position: { lat: stop.lat, lng: stop.lon },
				map: mapProvider.map,
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
				if (globalInfoWindow) {
					globalInfoWindow.close();
				}

				if (popupContentComponent) {
					popupContentComponent.$destroy();
				}

				popupContentComponent = new PopupContent({
					target: popupContainer,
					props: {
						stopName: stop.name,
						arrivalTime: stopTime ? stopTime.arrivalTime : null
					}
				});

				globalInfoWindow = new google.maps.InfoWindow({
					content: popupContainer
				});

				globalInfoWindow.open(mapProvider.map, marker);
			});

			stopMarkers.push(marker);
			break;
		}

		case MapSource.OpenStreetMap: {
			const customIcon = L.divIcon({
				html: `<svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"/></svg>`,
				className: '',
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			});

			const marker = L.marker([stop.lat, stop.lon], { icon: customIcon }).addTo(mapProvider.map);

			stopMarkers.push(marker);

			marker.on('click', () => {
				if (globalInfoWindow) {
					mapProvider.map.closePopup(globalInfoWindow);
				}

				if (popupContentComponent) {
					popupContentComponent.$destroy();
				}

				popupContentComponent = new PopupContent({
					target: popupContainer,
					props: {
						stopName: stop.name,
						arrivalTime: stopTime ? stopTime.arrivalTime : null
					}
				});

				globalInfoWindow = L.popup()
					.setLatLng([stop.lat, stop.lon])
					.setContent(popupContainer)
					.openOn(mapProvider.map);
			});
			break;
		}
	}
}

export function cleanupInfoWindow() {
	if (globalInfoWindow) {
		globalInfoWindow.close();
	}
}

export function cleanupStopMarkers(mapSource) {
	stopMarkers.forEach((marker) => {
		switch (mapSource) {
			case MapSource.Google:
				marker.setMap(null);
				break;
			case MapSource.OpenStreetMap:
				marker.remove();
				break;
		}
	});

	stopMarkers = [];
}
