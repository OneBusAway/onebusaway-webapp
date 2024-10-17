import { loadGoogleMapsLibrary, createMap, nightModeStyles } from '$lib/googleMaps';
import StopMarker from '$components/map/StopMarker.svelte';
import { faBus } from '@fortawesome/free-solid-svg-icons';
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
		try {
			const container = document.createElement('div');
			document.body.appendChild(container);

			new StopMarker({
				target: container,
				props: {
					stop: options.stop,
					icon: faBus,
					onClick: () => {
						options.onClick && options.onClick();
					}
				}
			});

			const overlay = new google.maps.OverlayView();
			overlay.onAdd = function () {
				this.getPanes().overlayMouseTarget.appendChild(container);
			};
			overlay.draw = function () {
				const projection = this.getProjection();
				const position = projection.fromLatLngToDivPixel(options.position);
				container.style.left = position.x - 20 + 'px';
				container.style.top = position.y - 20 + 'px';
				container.style.position = 'absolute';
				container.style.zIndex = '1000';
			};
			overlay.onRemove = function () {
				container.parentNode.removeChild(container);
			};
			overlay.setMap(this.map);

			return { overlay, element: container };
		} catch (error) {
			console.error('Error adding marker:', error);
			return null;
		}
	}

	removeMarker(markerObj) {
		if (!markerObj) return;

		if (markerObj.marker) {
			markerObj.marker.setMap(null);
		}
		if (markerObj.overlay) {
			markerObj.overlay.setMap(null);
		}
		if (markerObj.element && markerObj.element.parentNode) {
			markerObj.element.parentNode.removeChild(markerObj.element);
		}
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
