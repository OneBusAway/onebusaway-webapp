
/**
 * Loads the Google Maps JavaScript library.
 * @param {string} apiKey - The API key for accessing the Google Maps API.
 */
export function loadGoogleMapsLibrary(apiKey) {
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: apiKey,
    v: "weekly",
  });
}

export async function createMap(element, lat, lng, mapID) {
  const { Map } = await google.maps.importLibrary("maps");
  return new Map(element, {
    center: { lat: parseFloat(lat), lng: parseFloat(lng) },
    zoom: 12,
    mapId: mapID
  });
}