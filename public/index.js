let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { DrawingManager } = await google.maps.importLibrary("drawing");

  map = new Map(document.getElementById("map"), {
    center: { lat: 59, lng: 18 },
    zoom: 8,
    mapTypeId: "roadmap",
    streetViewControl: false,
  });

  var drawingManager = new DrawingManager();
  drawingManager.setMap(map);
  drawingManager.drawingControl = true;
}

initMap();
