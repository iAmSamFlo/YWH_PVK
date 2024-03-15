class MapManager {
  constructor() {
    this.map = null;
    this.infoWindow = null;
    this.drawingManager = null;
    this.markerElement = null;
    this.radius = null;
    this.coord = null;
    this.circle = null;
    this.saveBtn = document.getElementById('savePin');
    this.undoBtn = document.getElementById('undoPin');
    this.locationMenu = document.getElementById('LocationMenu');
    this.noLocationMenu = document.getElementById('NoLocationMenu');
    this.reviewBtn = document.getElementById('ReviewBtn');
    this.reviewMyLocation = document.getElementById('ReviewSpot');
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
    this.initSearch();
  }


  // Inside your MapManager class where you initialize the map
async initSearch() {
  // Your existing code for initializing the map
  
  const input = document.getElementById("InputField");
  const options = {
    bounds: this.map.restriction.latLngBounds,
    componnentRestrictions: {country: "se"},
    //fields: ["address_components", "geometry", "icon", "name", "url"],
    fields: ["geometry"],
    strictBounds: true,
  }
  const searchBox = new google.maps.places.Autocomplete(input, options);

  //Kod från stackoverflow för att ta första optionen
  /* Store original event listener */
  const _addEventListener = input.addEventListener

  const addEventListenerWrapper = (type, listener) => {
    if (type === 'keydown') {
      /* Store existing listener function */
      const _listener = listener
      listener = (event) => {
        /* Simulate a 'down arrow' keypress if no address has been selected */
        const suggestionSelected = document.getElementsByClassName('pac-item-selected').length
        if (event.key === 'Enter' && !suggestionSelected) {
          const e = new KeyboardEvent('keydown', { 
            key: 'ArrowDown', 
            code: 'ArrowDown', 
            keyCode: 40, 
          })
          _listener.apply(input, [e])
        }
        _listener.apply(input, [event])
      }
    }
    _addEventListener.apply(input, [type, listener])
  }
  input.addEventListener = addEventListenerWrapper

  //Listener if an alternative has been chosen from the dropdown list
  searchBox.addListener("place_changed", () => {
    
      //get the info from the chosen place
      const place = searchBox.getPlace();

    // if (places.length == 0) {
    //   return;
    // }
      //error handling kinda
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      // const icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25),
      // };

      //get the position and set a pin and pan to location 
        var pos = place.geometry.location;
        this.markerElement.position = pos;
        this.map.setCenter(pos);
    });
}


  setupEventListeners() {
    this.saveBtn.addEventListener('click', () => {
      this.removeBtns();
      this.saveData();
    });

    this.undoBtn.addEventListener('click', () => {
      this.deleteCircle();
    });

    this.reviewBtn.addEventListener('click', () => {
      // this.enableDrawingManager();
      this.review();
    });
    
    this.reviewMyLocation.addEventListener('click', () => {
      this.pinMyLocation();
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
    locationButton.textContent = 'Pan to Current Location';
    locationButton.classList.add('custom-map-control-button');
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

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
//exakt samma kod atm i dessa två. försökte optimisera men va för noobig 
  async pinMyLocation(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.markerElement.position = pos;
            this.review();
          },
          () => {
            this.handleLocationError(true, this.map.getCenter());
          },
        );
      } else {
        this.handleLocationError(false, this.map.getCenter());
      }
  }

  async getCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          return pos;
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
    this.locationMenu.classList.remove('hideLocationMenu');
    this.noLocationMenu.classList.add('hideLocationMenu');
    this.locationMenu.classList.add('showLocationMenu');
    this.noLocationMenu.classList.remove('showLocationMenu');

    this.markerElement.position = mapsMouseEvent.latLng;
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

  review(){
    var pos =  this.markerElement.position;
    this.circle = new google.maps.Circle({
      map: this.map,
      center: pos,
      radius: 10,
    });
  }
}


const mapManager = new MapManager();

