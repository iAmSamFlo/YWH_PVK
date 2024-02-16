class Pin{
    constructor(advancedMarkerElement, map, position, title){
        this.advancedMarkerElement = advancedMarkerElement;
        this.position = position;
        this.title = title;
        this.map = map;
        this.MakePin();
    }

    MakePin(){
        this.advancedMarkerElement.map = this.map;
        this.advancedMarkerElement.position = this.position;
        this.advancedMarkerElement.title = this.title;
        var pin = this.advancedMarkerElement;
        return pin;
    }
} 