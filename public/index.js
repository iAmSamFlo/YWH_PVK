let map, infoWindow, drawingManager;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const { DrawingManager } = await google.maps.importLibrary("drawing");

  var zoom = 10;
  map = new Map(document.getElementById("map"), {
    zoom: zoom + 2,
    minZoom: zoom,
    center: { lat: 59.32944, lng: 18.06861 },
    restriction: {
      latLngBounds: {
        north: 60,
        south: 59,
        east: 20,
        west: 17,
      },
    },
    mapTypeId: "roadmap",
    streetViewControl: false,
    mapId: "DEMO_MAP_ID",
  });

  // const drawingManager = new google.maps.drawing.DrawingManager();

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: false,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    
  });



  var position = { lat: 59, lng: 18 };
  var position2 = { lat: 59.325, lng: 18.05 };

  var pins = [];
  pins.push(new Pin(new AdvancedMarkerElement(), map, position, "Här"));
  pins.push(new Pin(new AdvancedMarkerElement(), map, position2, "Hääär"));


  handleCurrentLocation();
  var btn = document.getElementById("pinSpot");
  btn.onclick = function() {pinSpot(drawingManager)};
  google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
    radius = circle.getRadius();
    coord = circle.getCenter();
  });

}


function pinSpot(dm){
  dm.drawingMode = google.maps.drawing.OverlayType.MARKER;
  dm.drawingControl = true;
  dm.drawingControlOptions = {
    drawingModes: ['marker', 'circle']
    ,
  };
  dm.markerOptions = {
    icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
  };
  dm.circleOptions = {
  };
  dm.setMap(map);
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

var radius
var coord
initMap();


document.getElementById('savePin').addEventListener('click', function() {
  
  // Send the variables to the backend
  fetch('/sendData', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ radius, coord }),
  });
});


