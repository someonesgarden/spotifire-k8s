<template>
    <div ref="map">
        <div id="map" :style="{width: mapWidth + 'px',height: mapHeight + 'px'}"></div>
        <button class="button" @click="release">無効化</button>
    </div>
</template>

<script>

    import {mapGetters, mapActions} from 'vuex';

    let GoogleMapsLoader = require("google-maps");
    GoogleMapsLoader.KEY = 'AIzaSyCKLKkjFM9Q8YyCpALce51eEC0hcSnHURA';
    GoogleMapsLoader.LANGUAGE = "ja";

    export default {
        name: "MapView",
        props: {},
        data() {
            return {
                zoom: 15,
                lat: 34.722677,
                lng: 135.492364,
                map: null,
                formattedMarkers: [],
                markers: [],
                userMarker: null,
                mapWidth: window.innerWidth,
                mapHeight: window.innerHeight
            };
        },
        computed: mapGetters(['mapstore']),
        watch: {
            markers() {
                // マーカーを全削除
                this.formattedMarkers.forEach(marker => {
                    marker.setMap(null);
                });
                // propsからも削除
                this.formattedMarkers.splice(0, this.formattedMarkers.length);

                // 再描画
                this.addMarker();
            },

            'mapstore.tracking': {
                handler: function (lat) {
                    this.geolocation();
                }
            }
        },
        mounted() {
            GoogleMapsLoader.load(this.loadMap);
            this.initMap();
            this.a_mapstore(['set', 'tracking', null]);

            this.resetDivSize();
            window.addEventListener('resize', this.resetDivSize);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resetDivSize)
        },
        methods: {
            ...mapActions(['a_mapstore']),
            resetDivSize() {
                this.mapWidth = window.innerWidth;
                if (window.innerHeight > 768) {
                    this.mapHeight = window.innerHeight - 100;
                } else {
                    this.mapHeight = 300;
                }
            },

            initMap() {
                if (!navigator.geolocation) {
                    alert('Geolocation APIに対応していません');
                    return false;
                }

                // 現在地の取得
                navigator.geolocation.getCurrentPosition((position) => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                }, function () {
                    alert('位置情報取得に失敗しました');
                });
            },


            geolocation() {
                if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError);
            },

            buildUrl(position) {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;

                console.log("watch!");
                console.log(this.lat, this.lng);
                if (!!this.map) {
                    let latLng = new google.maps.LatLng(this.lat, this.lng);
                    this.map.panTo(latLng);
                    this.usermarker.setPosition(latLng);
                }
                //this.getWeather(API + '&lat=' + lat + '&lon=' + lon + KEY);
            },
            geoError(error) {
                console.log(error);
                //this.getWeather(API + '&lat=0&lon=0' + KEY);
            },

            addMarker() {
                this.markers.forEach(markerInfo => {
                    let contentString =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        "</div>" +
                        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
                        '<div id="bodyContent">' +
                        "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
                        "sandstone rock formation in the southern part of the " +
                        "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
                        "south west of the nearest large town, Alice Springs; 450&#160;km " +
                        "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
                        "features of the Uluru - Kata Tjuta National Park. Uluru is " +
                        "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
                        "Aboriginal people of the area. It has many springs, waterholes, " +
                        "rock caves and ancient paintings. Uluru is listed as a World " +
                        "Heritage Site.</p>" +
                        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
                        "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
                        "(last visited June 22, 2009).</p>" +
                        "</div>" +
                        "</div>";

                    // マーカー
                    let marker = new google.maps.Marker({
                        position: markerInfo.position,
                        icon:
                            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                        map: this.map,
                        // ポップなアニメーションを付与
                        animation: google.maps.Animation.DROP
                    });

                    let infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    // マーカークリック時にwindow表示
                    marker.addListener("click", function () {
                        infowindow.open(this.map, marker);
                    });
                    this.formattedMarkers.push(marker);
                });
            },

            loadMap(google) {
                // googleMapを初期化
                let centerPosition = {lat: this.lat, lng: this.lng};
                this.map = new google.maps.Map(document.getElementById("map"), {
                    center: centerPosition,
                    zoom: this.zoom,
                    // スワイプ判定を強めに設定(地図を移動させるには..問題)
                    gestureHandling: "greedy"
                });
                this.addMarker();
                this.usermarker = new google.maps.Marker({map: this.map, position: centerPosition});
                this.formattedMarkers.push(this.usermarker);
            },

            release() {
                GoogleMapsLoader.release(function () {
                    console.log("No google maps api around");
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
