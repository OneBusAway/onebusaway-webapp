<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    PUBLIC_OBA_GOOGLE_MAPS_API_KEY as apiKey,
    PUBLIC_OBA_GOOGLE_MAPS_MAP_ID as mapID,
    PUBLIC_OBA_REGION_CENTER_LAT as lat,
    PUBLIC_OBA_REGION_CENTER_LNG as lng
  } from '$env/static/public';

  import {
    createMap,
    loadGoogleMapsLibrary
  } from "$lib/googleMaps";

  import busIcon from "$images/modes/bus.svg"

  const dispatch = createEventDispatcher();

  let map = null;

  async function loadStopsForLocation(lat, lng) {
    const response = await fetch(`/api/oba/stops-for-location?lat=${lat}&lng=${lng}`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  }

  async function initMap() {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const element = document.getElementById("map");
    map = await createMap({element, lat, lng, mapID});

    const json = await loadStopsForLocation(lat, lng);
    const stops = json.data.list;

    for (const s of stops) {
      const glyphImg = document.createElement("img");
      glyphImg.src = busIcon;
      const glyphSvgPinElement = new PinElement({glyph: glyphImg});

      const marker = new AdvancedMarkerElement({
        map: map,
        position: {lat: s.lat, lng: s.lon},
        title: s.name,
        content: glyphSvgPinElement.element,
      });

      marker.addListener('click', () => {
        dispatch('stopSelected', { stop: s });
      });
    }
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