class Pin{
    constructor(lat, lng, message, map){
        this.lat = lat;
        this.lng = lng;
        this.message = message;
        this.map = map;
        this.MakePin();
    }


    MakePin(){
        var marker = L.marker([this.lat, this.lng]).addTo(this.map);
        marker.bindPopup(this.message).openPopup();
        return marker;
    }

}