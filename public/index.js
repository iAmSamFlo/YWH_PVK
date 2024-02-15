let map, infoWindow;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const { DrawingManager } = await google.maps.importLibrary("drawing");

  map = new Map(document.getElementById("map"), {
    center: { lat: 59, lng: 18 },
    zoom: 8,
    mapTypeId: "roadmap",
    streetViewControl: false,
    mapId: "DEMO_MAP_ID",
  });

  var drawingManager = new DrawingManager();
  drawingManager.setMap(map);
  drawingManager.drawingControl = true;

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

  handleCurrentLocation();


}

function handleCurrentLocation(){
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

initMap();

