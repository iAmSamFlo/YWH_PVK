let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 59, lng: 18 },
    zoom: 8,
    mapTypeId: "roadmap",
    streetViewControl: true,
    
  });
}

initMap();
var drawingManager = new google.maps.drawing.DrawingManager();
drawingManager.setMap(map);