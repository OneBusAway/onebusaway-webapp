import { browser } from '$app/environment';

export default class OpenStreetMapProvider {
	constructor() {
		this.map = null;
		this.L = null;
	}

	async initMap(element, options) {
		if (!browser) {
			console.log('OpenStreetMap initialization skipped on server-side.');
			return;
		}

		const leaflet = await import('leaflet');
		this.L = leaflet.default;

		// Leaflet CSS
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
		document.head.appendChild(link);

		// init map
		this.map = this.L.map(element).setView([options.lat, options.lng], 14);
		this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(this.map);
	}

	addMarker(options) {
		if (!browser || !this.map) return null;
		const marker = this.L.marker([options.position.lat, options.position.lng]).addTo(this.map);
		const container = this.L.DomUtil.create('div');
		container.appendChild(options.element);
		marker.bindPopup(container);
		return marker;
	}

	addListener(event, callback) {
		if (!browser || !this.map) return;
		this.map.on(event, callback);
	}

	addUserLocationMarker(latLng) {
		if (!browser || !this.map) return;
		this.L.circleMarker([latLng.lat, latLng.lng], {
			radius: 8,
			fillColor: '#007BFF',
			fillOpacity: 1,
			color: '#FFFFFF',
			weight: 2
		}).addTo(this.map);
	}

	setCenter(latLng) {
		if (!browser || !this.map) return;
		this.map.setView([latLng.lat, latLng.lng]);
	}

	getCenter() {
		if (!browser || !this.map) return { lat: 0, lng: 0 };
		const center = this.map.getCenter();
		return { lat: center.lat, lng: center.lng };
	}

	removeMarker(marker) {
		if (!browser || !this.map) return;
		this.map.removeLayer(marker);
	}
}
