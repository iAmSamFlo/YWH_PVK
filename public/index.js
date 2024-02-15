let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");


  map = new Map(document.getElementById("map"), {
    center: { lat: 59, lng: 18 },
    zoom: 8,
    mapTypeId: "roadmap",
    streetViewControl: false,
    mapId: "DEMO_MAP_ID",
  });

  var position = { lat: 59, lng: 18 };
  var position2 = { lat: 59.325, lng: 18.05 };

  var pins = [];

  pins.push(new AdvancedMarkerElement({
    map: map, 
    position: position,
    title: "här"
  }));

  pins.push(new AdvancedMarkerElement({
    map: map, 
    position: position2,
    title: "Här"
  }));

  pins.push(new Pin(map, position, "Här"));



}

initMap();