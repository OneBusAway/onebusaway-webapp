import { loadGoogleMapsLibrary, createMap, nightModeStyles } from '$lib/googleMaps';
/* global google */
export default class GoogleMapProvider {
	constructor(apiKey) {
		this.apiKey = apiKey;
		this.map = null;
	}

	async initMap(element, options) {
		// Load the Google Maps library
		loadGoogleMapsLibrary(this.apiKey);

		// Wait for the Google Maps API to be fully loaded
		await new Promise((resolve) => {
			const checkGoogleMaps = () => {
				if (window.google && window.google.maps) {
					resolve();
				} else {
					setTimeout(checkGoogleMaps, 100);
				}
			};
			checkGoogleMaps();
		});

		// Use the createMap function from googleMaps.js
		this.map = await createMap({
			element,
			lat: options.lat,
			lng: options.lng
		});
	}

	addMarker(options) {
		const marker = new google.maps.Marker({
			map: this.map,
			position: options.position,
			icon: {
				url:
					'data:image/svg+xml;charset=UTF-8,' +
					encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'),
				anchor: new google.maps.Point(0, 0),
				scaledSize: new google.maps.Size(1, 1)
			},
			label: {
				text: ' ',
				fontSize: '0px'
			},
			optimized: false
		});

		const overlay = new google.maps.OverlayView();
		overlay.setMap(this.map);
		overlay.draw = function () {
			const projection = this.getProjection();
			const position = projection.fromLatLngToDivPixel(marker.getPosition());
			options.element.style.left = position.x - 20 + 'px';
			options.element.style.top = position.y - 20 + 'px';
			options.element.style.position = 'absolute';
			this.getPanes().overlayMouseTarget.appendChild(options.element);
		};

		return { marker, overlay };
	}

	removeMarker(markerObj) {
		markerObj.marker.setMap(null);
		markerObj.overlay.setMap(null);
	}

	setCenter(latLng) {
		this.map.setCenter(latLng);
	}

	getCenter() {
		const center = this.map.getCenter();
		return { lat: center.lat(), lng: center.lng() };
	}

	addListener(event, callback) {
		this.map.addListener(event, callback);
	}

	setTheme(theme) {
		const styles = theme === 'dark' ? nightModeStyles() : null;
		this.map.setOptions({ styles });
	}

	setMapType(type) {
		this.map.setMapTypeId(type);
	}

	addUserLocationMarker(latLng) {
		new google.maps.Marker({
			map: this.map,
			position: latLng,
			title: 'Your Location',
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 8,
				fillColor: '#007BFF',
				fillOpacity: 1,
				strokeWeight: 2,
				strokeColor: '#FFFFFF'
			}
		});
	}
}
