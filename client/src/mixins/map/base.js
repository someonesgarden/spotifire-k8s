
export default{

    computed:{
        sortedMarkers(){
            let result = {};
            if(this.mapstore.markers){
                Object.keys(this.mapstore.markers).forEach(key=> {
                    let marker = this.mapstore.markers[key];
                    marker.id = key;
                    if(marker.project === 'mainuser' || (marker.project===this.mapstore.emory.project)) result[key]= marker;
                });
            }
            return result;
        }
    },

    methods: {

        resetAllPods(){
            this.mp3.pods.forEach((p, i) => {
                setTimeout(() =>  this.a_mp3(['pod', i, 'file', null]), 20);
                setTimeout(() => this.a_mp3(['pod', i, 'volume', 0]), 20);
                setTimeout(() => this.a_mp3(['pod', i, 'playing',false]), 20);
            });
        },

        callPlayerFromMap(val){
            if (val.markertype === 'mp3') {
                //mp3プレイヤーを開く
                this.a_mp3(['pod', 0, 'playing',false]);
                setTimeout(()=> this.a_mp3(['pod',0,'file',val.mp3]),100);
                setTimeout(()=> this.a_mp3(['pod',0,'volume',75]),100);
                setTimeout(()=> this.a_mp3(['pod',0,'playing', true+Math.floor(Math.random() * 3)]),100);

            } else if (val.markertype === 'pod') {

                //StoryModalを開く。
                this.a_index(['storyModal','set',{
                    open:true,
                    thumb: val.thumb,
                    title: val.title,
                    content: val.desc,
                    spotifyid:val.spotifyid,
                    spotifytype:val.spotifytype
                }]);

            } else if (val.markertype === 'track') {
                //Spotifyプレイヤーを開く（これもすべてWidgetにする！）
                this.c_getTrack(val.spotifyid,(res)=>{
                    if(!!res.data){
                        this.a_spotify(['player','track',res.data]);
                        this.a_spotify(['player','play',{id:val.spotifyid,type:'track'}]);
                    }
                });
                this.a_index(['bottom','open']);
            }
        },


        bottomAvatarClick(mkr){
            this.a_mapstore(['set','tracking',false]);
            let marker = this.mapstore.markers[mkr.id];
            if(marker) this.a_mapstore(['center','map',this.mapstore.markers[mkr.id].center]);
        },

        geoError(error) { console.log(error);},

        findMe(){
            console.log("moveToMe");
        },

        trackStart(){
            this.a_mapstore(['set','tracking',true]);
        },

        trackToggle(){
            this.a_mapstore(['toggle','tracking']);
        },

        distKmOfTwo(lat1, lng1, lat2, lng2) {
            lat1 *= Math.PI / 180;
            lng1 *= Math.PI / 180;
            lat2 *= Math.PI / 180;
            lng2 *= Math.PI / 180;
            return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
        },

        drawPoly(){
            let polys = [];
            //実際のユーザー以外のポイントでポリゴンを作る
            if(this.mapstore.markerDists){
                this.mapstore.markerDists.forEach(mkr=>{ if(this.mapstore.markers[mkr.id].type!=='mainuser') polys.push(this.mapstore.markers[mkr.id].center) });
                polys.sort((a, b)=> a.lat > b.lat ? 1 : -1);
                polys.sort((a, b)=> a.lng > b.lng ? 1 : -1);
                this.a_mapstore(['set','poly',polys]);
            }

        },

        distKmofCenters(center1,center2){
            return this.distKmOfTwo(center1.lat,center1.lng,center2.lat,center2.lng);
        },

        distOfProjPoints(){

            if(this.mapstore.mainuser){
                //自分と現在のプロジェクトのpointの距離を測る
                let mainuser = this.mapstore.mainuser.id==="GUEST" ? this.mapstore.mainuser : this.mapstore.markers[this.mapstore.mainuser.id];

               // let mainuser = this.mapstore.markers[this.mapstore.mainuser.id];

                if(this.sortedMarkers && mainuser){
                    let dists = Object.keys(this.sortedMarkers).map(k=> {
                        return {id:k, dist:this.distKmofCenters(mainuser.center, this.sortedMarkers[k].center)}
                    });
                    dists.sort((a, b)=> a.dist > b.dist ? 1 : -1);
                    this.a_mapstore(['set','markerdists',dists]);
                }
            }
        },

        randomPointsRange(lat0,lng0,num,near,far){
            // 緯度1秒の平均距離 約30.9m
            // 緯度35度上の緯度1秒の距離 約30.8m
            // 緯度1 = 111km
            //near: 下限(m)
            //far : 上限(m)
            //num : 生成するマーカーの数
            const bit = 0.000008999280057595;  // 1 bit = 1 m/rad

            let rand_points = [];

            for(let i=0;i<num;i++){

                let type = Math.floor( Math.random() * 10 ); //0 - 10

                let dlat = (bit*(Math.random()*far)+bit*near)*Math.pow(-1,Math.floor(Math.random()*2 + 1));
                let dlng = (bit*(Math.random()*far)+bit*near)*Math.pow(-1,Math.floor(Math.random()*2 + 1));

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
                     tid:this.mapstore.marker_types[type].tid,
                     thumb: this.mapstore.marker_types[type].thumb,
                     id: this.mapstore.marker_types[type].id,
                })
            }

            return rand_points;

        }
    }
}
