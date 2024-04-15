class MapManager {

    constructor() {
      this.secret = null;

      this.map = null;
      this.infoWindow = null;
      this.markerElement = null;
      this.coord = null;
      this.circle = null;
      this.radius = null;
      this.exitBtn = document.getElementById('ExitBtn');
      this.nextBtn = document.getElementById('NextBtn');
      this.inputField = document.getElementById('InputField');
  
      this.locationMenu = document.getElementById('LocationMenu');
      this.noLocationMenu = document.getElementById('NoLocationMenu');
      this.radiusSliderMenu = document.getElementById('RadiusSliderMenu');
      this.reviewBtn = document.getElementById('ReviewBtn');
      this.reviewMyLocationBtn = document.getElementById('ReviewSpot');
      this.radiusSlider = document.getElementById('RadiusSliderInput');
      this.radiusSliderValue = document.getElementById('sliderValue');
      
      
      this.initMap();
      this.getDatabase();
    }

    async setMapScript() {
      await this.getSecret();
      const API_KEY = this.secret;
      (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});
      var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));
      e.set("libraries", [...r] + ",drawing,places");
      for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);
      e.set("callback",c+".maps."+q);
      a.src=`https://maps.${c}apis.com/maps/api/js?`+e;
      console.log(a.src);
      d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));
      a.nonce=m.querySelector("script[nonce]")?.nonce||"";
      m.head.append(a)}));
      d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
      ({key: API_KEY, v: "weekly"});
    }

    async getSecret() {
      try {
          const response = await fetch('/get-secret');
          const recived = await response.text();
          this.secret = recived;
          // console.log('Key recived:',this.secret);
          // Now you can use the secret in your client-side code
      } catch (error) {
          console.error('Error fetching secret:', error);
      }
    }

    async getDatabase() {
      try {
          const response = await fetch('/get-database');
          const recived = await response.text();
          console.log('Data recived:', recived);
          // Now you can use the secret in your client-side code
      } catch (error) {
          console.error('Error fetching secret:', error);
      }
  }
  
    async initMap() {
      await this.setMapScript();
      const { Map } = await google.maps.importLibrary('maps');
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
  
      this.reviewBtn.addEventListener('click', () => {
        this.review();
      });
  
      this.reviewMyLocationBtn.addEventListener('click', () => {
        this.pinMyLocation();
      });
  
      this.exitBtn.addEventListener('click', () => {
        this.exitRadius();
      });
  
      this.nextBtn.addEventListener('click', () => {
        localStorage.setItem('coord', JSON.stringify(this.coord));
        localStorage.setItem('coord', JSON.stringify(this.coord));
        console.log(this.coord);
        window.location.href = "reviewpage.html";
      });
  
      google.maps.event.addListener(this.map, "click", (mapsMouseEvent) => { 
        this.setTempPin(mapsMouseEvent);
      });
  
      this.radiusSlider.addEventListener('input', () => {
        this.handleRadiusSlider();
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
      //TODO: om du var på din egna plats får du nu ändå alternativet start
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
      this.coord =  this.markerElement.position;
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
