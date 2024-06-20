<script>
  import { onMount } from 'svelte';
  import {
    PUBLIC_OBA_GOOGLE_MAPS_API_KEY as apiKey,
    PUBLIC_OBA_GOOGLE_MAPS_MAP_ID as mapID,
    PUBLIC_OBA_REGION_CENTER_LAT as lat,
    PUBLIC_OBA_REGION_CENTER_LNG as lng
  } from '$env/static/public';

  let map = null;

  async function loadStopsForLocation(lat, lng) {
    const response = await fetch(`/api/oba/stops-for-location?lat=${lat}&lng=${lng}`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  }

  async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      zoom: 12,
      mapId: mapID
    });

    const json = await loadStopsForLocation(lat, lng);

    const stops = json.data.list.map((s) => {return {id: s.id, lat: s.lat, lng: s.lon, name: s.name}});

    for (const s of stops) {
      const marker = new AdvancedMarkerElement({
        map: map,
        position: {lat: s.lat, lng: s.lng},
        title: s.name,
      });

      marker.addListener('click', () => {
        const bubble = new InfoWindow();
        bubble.setContent(s.name);
        bubble.open({
          anchor: marker,
          map: map,
        });
      });
    }
  }

  onMount(async () => {
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: apiKey,
      v: "weekly",

      // Add other bootstrap parameters as needed, using camel case.
      });

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