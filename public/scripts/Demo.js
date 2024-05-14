class Demo {
    constructor() {
        this.circles = [];
        this.map = null;
        this.initMap();
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
        } catch (error) {
            console.error('Error fetching secret:', error);
        }
    }

    async initMap(){
        await this.setMapScript();

        const { Map } = await google.maps.importLibrary('maps');

        const minZoom = 10;
            this.map = new Map(document.getElementById('map'), {
            fullscreenControl: false,
            zoom: minZoom +4,
            minZoom: minZoom,
            zoomControl: false,
            center: { lat: 59.3481694, lng: 18.0747372 },
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
        this.getData();
    }


    async getData(){
        this.circles.forEach(Circle => {
            Circle.setMap(null);
        });
        this.circles = [];

        try{
  
            const response = await fetch('/get-database');
            const data = await response.json();

            data.forEach(pin => {
                let color;           
                switch (pin.rating) {
                    case 1:
                        color = 'green';
                        break;
                    case 2:
                        color = 'lightgreen';
                        break;
                    case 3:
                        color = 'orange';
                        break;
                    case 4:
                        color = 'red';
                        break;
                    default:
                        color = 'lightgray';
                        break;
                }
                let circle = new google.maps.Circle({
                    map: this.map,
                    center: { lat: pin.latitude, lng: pin.longitude },
                    radius: pin.radius,
                    fillColor: color,
                    fillOpacity: 0.5,
                    strokeWeight: 0,
                })
                circle.addListener('click', () => {
                    console.log('Circle clicked:');
                    let tags = this.decodeTags(JSON.parse(pin.tags));
                    console.log('message:', pin.message);
                    var messageForm = '';
                    if (pin.message != "" && pin.message != null) {  
                        messageForm = '<div><strong>Message:</strong><br>' + pin.message + '</div>';
                    } else {
                        console.log('no message');
                        messageForm = '';
                    }
                    var tagsForm = '<div><strong>Tags:</strong><br>' 
                    tags.forEach(tag => {
                        tagsForm += tag + '<br>';
                    });
                    tagsForm += '</div>';
                    var infoWindow = new google.maps.InfoWindow({
                        content: tagsForm + messageForm,
                    });
                    let center = circle.getCenter();
                    infoWindow.setPosition(center);
                    infoWindow.open(this.map);
                    
                });
                this.circles.push(circle);
            });

        } catch (error) {
            console.error('Error fetching database:', error);
        }
    }


    decodeTags(tags) {
        let tagArray = [];
      
        tags.forEach(tag => {
            switch(tag){
                case 0:
                    tagArray.push('Daytime');
                    break;
                case 1:
                    tagArray.push('Nighttime');
                    break;
                case 2:
                    tagArray.push('Infrastucture');
                    break;
                case 3:
                    tagArray.push('Vibes');
                    break;
                case 4:
                    tagArray.push('Navigation');
                    break;
                case 5:
                    tagArray.push('Surroundings');
                    break;
                case 6:
                    tagArray.push('Expereince');
                    break;
            }
            
        });
        return tagArray;
    }
}