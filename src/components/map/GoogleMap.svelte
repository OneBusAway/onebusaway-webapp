<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    PUBLIC_OBA_GOOGLE_MAPS_API_KEY as apiKey,
    PUBLIC_OBA_GOOGLE_MAPS_MAP_ID as mapID,
    PUBLIC_OBA_REGION_CENTER_LAT as initialLat,
    PUBLIC_OBA_REGION_CENTER_LNG as initialLng
  } from '$env/static/public';

  import {
    createMap,
    loadGoogleMapsLibrary
  } from "$lib/googleMaps";

  import busIcon from "$images/modes/bus.svg";

  const dispatch = createEventDispatcher();

  let map = null;

  let markers = [];

  async function loadStopsForLocation(lat, lng) {
    const response = await fetch(`/api/oba/stops-for-location?lat=${lat}&lng=${lng}`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  }

  async function initMap() {
    const element = document.getElementById("map");
    map = await createMap({ element, lat: initialLat, lng: initialLng, mapID });

    await loadStopsAndAddMarkers(initialLat, initialLng);

    const debouncedLoadMarkers = debounce(async () => {
      const center = map.getCenter();
      await loadStopsAndAddMarkers(center.lat(), center.lng());
    }, 300);

    map.addListener('dragend', debouncedLoadMarkers);
    map.addListener('zoom_changed', debouncedLoadMarkers);
  }

  async function loadStopsAndAddMarkers(lat, lng) {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const json = await loadStopsForLocation(lat, lng);
    const stops = json.data.list;

    for (const s of stops) {
      if (!markerExists(s)) {
        addMarker(s, AdvancedMarkerElement, PinElement);
      }
    }
  }

  function markerExists(s) {
    return markers.some(marker => marker.s.id === s.id);
  }

  function addMarker(s, AdvancedMarkerElement, PinElement) {
    const glyphImg = document.createElement("img");
    glyphImg.src = busIcon;

    const glyphSvgPinElement = new PinElement({ glyph: glyphImg });

    const marker = new AdvancedMarkerElement({
      map,
      position: { lat: s.lat, lng: s.lon },
      title: s.name,
      content: glyphSvgPinElement.element,
    });

    marker.addListener('click', () => {
      dispatch('stopSelected', { stop: s });
    });

    markers.push({ s, marker });
  }

  function debounce(func, wait) {
    let timeout;

    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  onMount(async () => {
    loadGoogleMapsLibrary(apiKey);
    await initMap();
  });
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>