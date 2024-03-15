class MapManager {
  constructor() {
    this.map = null;
    this.infoWindow = null;
    this.drawingManager = null;
    this.markerElement = null;
    this.radius = null;
    this.coord = null;
    this.circle = null;
    this.pinBtn = document.getElementById('ReviewBtn');
    this.saveBtn = document.getElementById('savePin');
    this.undoBtn = document.getElementById('undoPin');
    this.exitBtn = document.getElementById('ExitBtn');
    this.nextBtn = document.getElementById('NextBtn');
    this.inputField = document.getElementById('InputField');

    this.locationMenu = document.getElementById('LocationMenu');
    this.noLocationMenu = document.getElementById('NoLocationMenu');
    this.radiusSliderMenu = document.getElementById('RadiusSliderMenu');
    this.initMap();
    
  }

  async initMap() {
    const { Map } = await google.maps.importLibrary('maps');
    const { DrawingManager } = await google.maps.importLibrary('drawing');
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const minZoom = 10;
    this.map = new Map(document.getElementById('map'), {
      fullscreenControl: false,
      zoom: minZoom + 7,
      minZoom: minZoom,
      center: { lat: 59.32944, lng: 18.06861 },
      restriction: {
        latLngBounds: {
          north: 60,
          south: 59,
          east: 20,
          west: 17,
        },
      },
      mapTypeId: 'roadmap',
      streetViewControl: false,
      mapId: 'DEMO_MAP_ID',
    });

    this.drawingManager = new DrawingManager({
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
      },
    });

    this.markerElement = new AdvancedMarkerElement({
      map: this.map,
    })
    this.handleCurrentLocation();
    this.panToCurrentLocation();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.saveBtn.addEventListener('click', () => {
      this.removeBtns();
      this.saveData();
    });

    this.undoBtn.addEventListener('click', () => {
      this.deleteCircle();
    });

    this.pinBtn.addEventListener('click', () => {
      this.enableDrawingManager();
      this.setRadiusPin();
    });

    this.exitBtn.addEventListener('click', () => {
      this.exitRadius();
    });

    this.nextBtn.addEventListener('click', () => {
      window.location.href = "reviewpage.html";
    });

    google.maps.event.addListener(this.drawingManager, 'circlecomplete', (circle) => {
      this.handleCircleComplete(circle);
    });


    google.maps.event.addListener(this.map, "click", (mapsMouseEvent) => { 
      this.setTempPin(mapsMouseEvent);
    });

  }

  async handleCurrentLocation() {
    const locationButton = document.createElement('button');
    const icon = document.createElement('img');
    icon.src = 'icons/arrow.png';
    icon.classList.add('myLocationIcon');
    locationButton.appendChild(icon);
    locationButton.classList.add('myLocationButton');
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(locationButton);

    locationButton.addEventListener('click', () => {
      this.panToCurrentLocation();
    });
  }

  async panToCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map.setCenter(pos);
        },
        () => {
          this.handleLocationError(true, this.map.getCenter());
        },
      );
    } else {
      this.handleLocationError(false, this.map.getCenter());
    }
  }

  handleLocationError(browserHasGeolocation, pos) {
    this.infoWindow = new google.maps.InfoWindow();
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation.",
    );
    this.infoWindow.open(this.map);
  }

  enableDrawingManager() {
    this.drawingManager.drawingControl = true;
    this.drawingManager.drawingControlOptions = {
      drawingModes: ['circle'],
    };
    this.drawingManager.setMap(this.map);  
  }

  setTempPin(mapsMouseEvent){
    // this.pinBtn.classList.remove('tempPinBtn');
    this.locationMenu.classList.remove('hideLocationMenu');
    this.noLocationMenu.classList.add('hideLocationMenu');
    this.locationMenu.classList.add('showLocationMenu');
    this.noLocationMenu.classList.remove('showLocationMenu');

    this.markerElement.position = mapsMouseEvent.latLng;
  }

  setRadiusPin() {
    this.radiusSliderMenu.classList.remove('hideLocationMenu');
    this.locationMenu.classList.add('hideLocationMenu');
    this.radiusSliderMenu.classList.add('showLocationMenu');
    this.locationMenu.classList.remove('showLocationMenu');
    this.inputField.classList.add('hideInputField')
  }

  exitRadius() {
    this.locationMenu.classList.remove('hideLocationMenu');
    this.radiusSliderMenu.classList.add('hideLocationMenu');
    this.locationMenu.classList.add('showLocationMenu');
    this.radiusSliderMenu.classList.remove('showLocationMenu');
    this.inputField.classList.remove('hideInputField');
  }

  setupBtns() {
    this.undoBtn.classList.remove('nonVisible');
    this.saveBtn.classList.remove('nonVisible');
  }

  deleteCircle() {
    if (this.circle) {
      this.circle.setMap(null);
      this.removeBtns();
    }
  }

  removeBtns() {
    this.undoBtn.classList.add('nonVisible');
    this.saveBtn.classList.add('nonVisible');
  }

  handleCircleComplete(circle) {
    var maxRadius = 500;
    if (circle.getRadius() > maxRadius) {
      circle.setRadius(maxRadius);
    }
    this.radius = circle.getRadius();
    this.coord = circle.getCenter();
    this.circle = circle;
    this.setupBtns();
  }

  async saveData() {
    if (this.radius && this.coord) {
      // Send the variables to the backend
      await fetch('/sendData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ radius: this.radius, coord: this.coord }),
      });
      this.removeBtns();
    }
  }
}

const mapManager = new MapManager();

