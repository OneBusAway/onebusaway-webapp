<script>
  import { onMount } from 'svelte';
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

  let map = null;

  async function loadStopsForLocation(lat, lng) {
    const response = await fetch(`/api/oba/stops-for-location?lat=${lat}&lng=${lng}`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  }

  async function initMap() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = await createMap(
      document.getElementById("map"),
      lat,
      lng,
      mapID
    );

    const json = await loadStopsForLocation(lat, lng);

    const stops = json.data.list.map((s) => {return {id: s.id, lat: s.lat, lng: s.lon, name: s.name}});

    for (const s of stops) {
      const marker = new AdvancedMarkerElement({
        map: map,
        position: {lat: s.lat, lng: s.lng},
        title: s.name,
      });

      marker.addListener('click', () => {
        alert("Clicked on " + s.name);
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