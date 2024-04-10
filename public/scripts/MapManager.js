class MapManager {
  constructor() {
    this.map = null;
    this.infoWindow = null;
    this.markerElement = null;
    this.coord = null;
    this.circle = null;
    this.radius = null;
    this.directionsRenderer = null;
    this.directionsService = null;     
    this.exitBtn = document.getElementById('ExitBtn');
    this.nextBtn = document.getElementById('NextBtn');
    this.startBtn = document.getElementById('StartBtn');
    this.inputField = document.getElementById('InputField');

    this.locationMenu = document.getElementById('LocationMenu');
    this.noLocationMenu = document.getElementById('NoLocationMenu');
    this.radiusSliderMenu = document.getElementById('RadiusSliderMenu');
    this.reviewBtn = document.getElementById('ReviewBtn');
    this.reviewMyLocationBtn = document.getElementById('ReviewSpot');
    this.radiusSlider = document.getElementById('RadiusSliderInput');
    this.radiusSliderValue = document.getElementById('sliderValue');
    this.initMap();
  }
  
  async initMap() {
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { DirectionsService } = await google.maps.importLibrary('routes');
    const { DirectionsRenderer } = await google.maps.importLibrary('routes');

    this.directionsService = new DirectionsService();
    this.directionsRenderer = new DirectionsRenderer();

    // Define an array to hold all DirectionsRenderer instances
    this.directionsRenderers = [];
    
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

    this.directionsRenderer.setMap(this.map);

    this.markerElement = new AdvancedMarkerElement({
      map: this.map,
    })
    this.panToCurrentLocation();

    this.setUpPanToBtn();
    this.setupEventListeners();
    this.initSearch();
  }

  calcRoute(start, dest) {
    var selectedMode = 'WALKING'; //TODO: Fixa komunalt alternativ
  
    var request = {
      origin: start,
      destination: dest,
      travelMode: google.maps.TravelMode[selectedMode],
      provideRouteAlternatives: true
    };

    this.directionsService.route(request, async(result, status) => {

      if (status == 'OK') {
        if (result && result.routes) {
          // Clear previous routes if any
          for (let i = 0; i < this.directionsRenderers.length; i++) {
            const renderer = this.directionsRenderers[i];
            renderer.setMap(null); // Remove the renderer from the map
          }
          // Remove the route-info divs from the DOM
          const routeInfoDivs = document.querySelectorAll('.route-info');
          routeInfoDivs.forEach(div => div.remove());
          // Empty the directionsRenderers list
          this.directionsRenderers = [];

          let minTurns = Infinity;
          let minTurnsIndex = -1;
          // Initialize arrays to store duration times and total distances
          const durationTimes = [];
          const totalDistances = [];

          // Iterate through each route and display it
          for (let i = 0; i < result.routes.length; i++) {
            const route = result.routes[i];

            const directionsRenderer = new google.maps.DirectionsRenderer({
              polylineOptions: {
                  strokeColor: '#B48CFE', 
                  strokeOpacity: 1.0,
                  strokeWeight: 4
              }
            });
            directionsRenderer.setMap(this.map);
            directionsRenderer.setDirections(result);
            directionsRenderer.setRouteIndex(i);

            // Push each DirectionsRenderer instance to the array
            this.directionsRenderers.push(directionsRenderer);

            let totalTurns = 0;
            let totalDuration = 0;
            let totalDistance = 0;
            for (let j = 0; j < route.legs.length; j++) {
                const leg = route.legs[j];
                totalTurns += leg.steps.length - 1; // Subtract 1 because the last step doesn't require a turn
                // Calculate total duration time and total distance for the route
                totalDuration += route.legs[j].duration.value; // in seconds
                totalDistance += route.legs[j].distance.value; // in meters
            }
            if (totalTurns < minTurns) {
                minTurns = totalTurns;
                minTurnsIndex = i;
            }

            // Convert duration time from seconds to minutes
            const durationInMinutes = Math.round(totalDuration / 60);
            // Convert total distance from meters to kilometers
            const distanceInKilometers = (totalDistance / 1000).toFixed(2);
            // Push duration time and total distance to respective arrays
            durationTimes.push(durationInMinutes);
            totalDistances.push(distanceInKilometers);

            console.log(i,":  duration-", durationInMinutes, "distance-", distanceInKilometers)


            // Create a div to display route information
            const routeDiv = document.createElement('div');
            routeDiv.classList.add('route-info'); // TODO felicia måste skapa css klass
            routeDiv.id = 'route'+i;

            // Set content for the route div
            routeDiv.innerHTML = `
                <p>Duration: ${durationInMinutes} minutes</p>
                <p>Distance: ${distanceInKilometers} km</p>
            `;
            //TODO: lägg till en knapp som bekräftar rutt och tar bort resterande rutter, öppnar upp för ny navigationsvy?
            // Append the route div to a container element (e.x, a div with id "routeContainer")
            this.locationMenu.appendChild(routeDiv);

            // Add click event listeners to route divs
            //TODO: funkar ej
            routeDiv.addEventListener('click', () => {
              this.selectRoute(i);
            });

            // Add click event listeners to DirectionsRenderer objects
            google.maps.event.addListener(directionsRenderer, 'click', () => {
              this.selectRoute(i);
            });
          }
          console.log("success");

          if (minTurnsIndex !== -1) {
            console.log("Route with least turns:", minTurnsIndex);
            // Create a new <p> element
            const newParagraph = document.createElement('p');
            // Set text content for the new <p> element
            newParagraph.textContent = 'Route with least turns:';
            document.getElementById("route"+minTurnsIndex).appendChild(newParagraph);
          } else {
            console.error("No routes found or error occurred.");
          }

        } else {
          console.error("No routes found in the result.");
        }
      } else {
        console.error("Directions request failed with status:", status);
      }
    });
  }

  // Function to select the route
  selectRoute(routeIndex) {
    console.log('Route selected:', routeIndex);

    //TODO: att selecta route funkar ejj
    // Reset the stroke color for all routes and Highlight the selected route 
    this.directionsRenderers.forEach((renderer, index) => {
      const color = (index === routeIndex) ? '#7c41FA' : '#B48CFE';
      renderer.setOptions({
          polylineOptions: {
              strokeColor: color
          }
      });
    });
  }

  // getColor(index) {
  //   const colors = ['#7c41FA', '#B48CFE', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']; //TODO: felicia får bestämma färger
  //   return colors[index % colors.length];
  // }
  
  async initSearch() {
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

    this.reviewBtn.addEventListener('click', () => {
      this.review();
    });

    this.reviewMyLocationBtn.addEventListener('click', async () => {
      try {
        var pos = await this.getCurrentLocation(); // Wait for the position to be obtained
        this.markerElement.position = pos;
        this.review();
      } catch (error) {
        console.error(error);
      }
    });

    this.exitBtn.addEventListener('click', () => {
      this.exitRadius();
    });

    this.nextBtn.addEventListener('click', () => {
      window.location.href = "reviewpage.html";
    });

    google.maps.event.addListener(this.map, "click", (mapsMouseEvent) => { 
      this.setTempPin(mapsMouseEvent);
    });

    this.radiusSlider.addEventListener('input', () => {
      this.handleRadiusSlider();
    });

    this.startBtn.addEventListener('click', async () => {
      try{
        var start = await this.getCurrentLocation();
        var end = this.markerElement.position;
        this.calcRoute(start, end);
      } catch (error){
        console.error(error);
      } 
    })
  }
  
  async setUpPanToBtn() {
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

  async getCurrentLocation(){
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            resolve(pos); // Resolve the promise with the position
          },
          () => {
            this.handleLocationError(true, this.map.getCenter());
            reject("Error getting current position");
          },
        );
      } else {
        this.handleLocationError(false, this.map.getCenter());
        reject("Geolocation not supported");
      }
    });
  }

  async panToCurrentLocation(){
    try {
      var pos = await this.getCurrentLocation();
      this.map.setCenter(pos);
    } catch (error){
      console.error(error);
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
  
  setTempPin(mapsMouseEvent){
    this.locationMenu.classList.remove('nonVisible');
    this.noLocationMenu.classList.add('nonVisible');

    this.markerElement.position = mapsMouseEvent.latLng;
  }


  setupRadiusSliderMenu() {
    this.inputField.classList.add('hideInputField')
    this.locationMenu.classList.add('nonVisible');
    this.noLocationMenu.classList.add('nonVisible');

    this.radiusSliderMenu.classList.remove('nonVisible');
  }

  exitRadius() {
    this.deleteCircle();
    this.locationMenu.classList.remove('nonVisible');
    this.radiusSliderMenu.classList.add('nonVisible');
    this.inputField.classList.remove('hideInputField');
  }
  
  
  deleteCircle() {
    if (this.circle) {
      this.circle.setMap(null);
    }
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
    this.setupRadiusSliderMenu();
    var pos =  this.markerElement.position;
    this.map.setCenter(pos);
    this.coord = pos;
  }


  handleRadiusSlider(){
    var meter = 0;
    var input = +this.radiusSlider.value; //convert from string to nr
    switch (input){
      case 1:
        meter = 5;
        break;
      case 2:
        meter = 15;
        break;
      case 3:
        meter = 25;
        break;      
      case 4:
        meter = 50;
        break;
      case 5:
        meter = 75;
        break;
      case 6:
        meter = 100;
        break;
    }
    this.radius = meter;
    this.radiusSliderValue.textContent = meter + "m";
    this.deleteCircle();
    this.circle = new google.maps.Circle({
      map: this.map,
      center: this.coord,
      radius: this.radius,
    });
  }

}
