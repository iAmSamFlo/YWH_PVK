let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 59, lng: 18 },
    zoom: 8,
    mapTypeId: "roadmap",
    streetViewControl: false,
    
  });
}

initMap();

