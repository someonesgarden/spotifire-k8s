
export default{

    computed:{

    },

    methods: {
        findMe(){
            console.log("moveToMe");
        },

        trackToggle(){
            console.log("trackStart");
            this.a_mapstore(['set','tracking',null]);
        },

        trackStop(){
            console.log("trackStop");
            this.a_mapstore(['set','tracking',false]);
        },

        trackStart(){
            console.log("trackStop");
            this.a_mapstore(['set','tracking',true]);
        },

        distKmOfTwo(lat1, lng1, lat2, lng2) {
            lat1 *= Math.PI / 180;
            lng1 *= Math.PI / 180;
            lat2 *= Math.PI / 180;
            lng2 *= Math.PI / 180;
            return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
        },

        randomPointsRange(lat0,lng0,num,dist){
            // 緯度1秒の平均距離 約30.9m
            // 緯度35度上の緯度1秒の距離 約30.8m
            // 緯度1 = 111km
            const bit = 0.000008999280057595;  // 1 bit = 1 m/rad

            let rand_points = [];

            for(let i=0;i<num;i++){

                let type = Math.floor( Math.random() * 10 ); //0 - 10

                let dlat = bit*(Math.random()*dist)*Math.pow(-1,Math.floor(Math.random()*2 + 1));
                let dlng = bit*(Math.random()*dist)*Math.pow(-1,Math.floor(Math.random()*2 + 1));

                rand_points.push({
                    lat: lat0+dlat,
                    lng: lng0+dlng,
                     w:  20+type,
                     h:  20+type,
                     type:this.mapstore.marker_types[type].type,
                     title:this.mapstore.marker_types[type].title,
                     subtitle:this.mapstore.marker_types[type].subtitle,
                     body:this.mapstore.marker_types[type].body,
                     pid:this.mapstore.marker_types[type].pid,
                     icon: this.mapstore.marker_types[type].icon,
                     thumb: this.mapstore.marker_types[type].thumb,
                     id: this.mapstore.marker_types[type].id,
                })

            }

            return rand_points;

        }
    }
}
