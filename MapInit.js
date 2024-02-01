class MapInit {
    constructor(mapid){

        this.map = L.map(mapid);
        var osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
        var osm = new L.TileLayer(osmUrl, { maxZoom: 19, attribution: osmAttrib});
        this.GetAllPins();

        this.map.setView(new L.LatLng(59.334591, 18.063240), 13);
        this.map.addLayer(osm);

        this.ClickHandler();
    }

    GetAllPins(){
        var pins = [];
        pins.push(new Pin(59.334591, 18.063240, 'här är första pin', this.map));
        pins.push(new Pin(59.31000, 18.063050, 'här är andra pin', this.map));
        pins.push(new Pin(59.35000, 18.073050, 'här är tredje pin', this.map));
        return pins;
    }

    ClickHandler() {
        var popup = L.popup();
        this.map.on('click', (e) => {
            popup.setLatLng(e.latlng);
            popup.setContent("You clicked the map at " + e.latlng.toString());
            popup.openOn(this.map);
        });
    }
}