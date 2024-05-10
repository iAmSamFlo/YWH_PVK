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
            zoom: minZoom + 7,
            minZoom: minZoom,
            zoomControl: false,
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
                this.circles.push( new google.maps.Circle({
                    map: this.map,
                    center: { lat: pin.latitude, lng: pin.longitude },
                    radius: pin.radius,
                    fillColor: color,
                    fillOpacity: 0.5,
                    strokeWeight: 0,
                }));
            });

        } catch (error) {
            console.error('Error fetching database:', error);
        }
    }


}