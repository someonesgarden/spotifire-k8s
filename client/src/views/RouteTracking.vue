<template>
    <div>
        <l-map id="trackmap" ref="map"
               :center="[40.7127, -74.0059]"
               :zoom="14"
               :max-zoom="18"
               :min-zoom="5">
            <l-tile-layer :url="tilePattern.night" :attribution="attribution"/>
        </l-map>

        <div class="route_overlay">
            <md-card class="info_win">
                <h3><strong>RouteTracking</strong></h3>
                How Life is fun!
                <md-button style="background-color:#62d8ff;" @click="beginClick">
                    <md-icon>play_arrow</md-icon>
                </md-button>
            </md-card>
        </div>

        <date-time-box ref="timebox" @reloadClick="reloadClick" @toggle="togglePlay"/>
        <total-box ref="totalbox" :running="running"/>
        <area-chart-box ref="areachartbox" :running="running"/>
    </div>
</template>

<script>
    let svg     = null;
    let g0      = null;
    let marker  = null;
    let path    = null;
    let points  = null;
    let d3path  = null;

    import {mapGetters,mapActions} from 'vuex';
    import moment   from 'moment';
    import axios    from 'axios/index';
    import {LMap, LTileLayer} from "vue2-leaflet";

    import mapMixin from '../mixins/map';

    import TotalBox     from '../components/Emory/Tracks/TotalBox';
    import DateTimeBox  from '../components/Emory/Tracks/DateTimeBox';
    import AreaChartBox from '../components/Emory/Tracks/AreaChartBox';

    export default {
        name: 'RouteTracking',
        bodyClass: "routetrack-page",
        mixins:[mapMixin],
        components: {
            TotalBox,
            DateTimeBox,
            AreaChartBox,
            LMap,
            LTileLayer
        },
        data() {
            return {
                tilePattern: {
                    morning: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    mono: '//{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
                    night: '//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                },
                attribution: '&copy;',
                map:    null,
                tiles:  null,
                pointsArray: [],
                timer:  null,
                tweenToggle: 0,
                count:       0,
                active:      true,
                running: {
                    fare:       0,
                    surcharge:  0,
                    mtatax:     0,
                    tolls:      0,
                    tip:        0,
                    total:      0,
                    passengers: 0
                }
            }
        },

        computed:mapGetters(['mapstore']),

        beforeDestroy() {
            this.active = false;
            clearTimeout(this.timer);
        },

        created() {
            this.tiles = L.tileLayer(this.tilePattern['mono'], {attribution: '&copy;'});

            this.a_mapstore(['tracking','moment',moment()]);
        },

        mounted() {
            this.active = true;
            //this.map = L.map('map', {zoomControl: false}).addLayer(this.tiles).setView([40.7127, -74.0059], 14)
            this.map = this.$refs.map.mapObject;
            svg = d3.select(this.map.getPanes().overlayPane).append("svg");
            this.loadTracking();
        },

        methods: {
            ...mapActions(['a_mapstore']),
            //Event Actions
            togglePlay(mode=null){

                if(mode){
                    this.active=mode;
                }else{
                    //toggle
                    this.active = !this.active;
                }

                if(this.active){
                    this.iterate();
                }else{
                    path.interrupt();
                    path.transition();
                    marker.interrupt();
                    marker.transition();
                }
            },

            beginClick() {
                $('.route_overlay').fadeOut(250);
                $('.mybox').fadeIn(250);
                setTimeout(() => {
                    this.updateTimer();
                    this.iterate();
                }, 500);
            },

            reloadClick() {
                this.resetAll();
                this.$refs.areachartbox.resetAll();

                setTimeout(() => this.loadTracking(), 500);

                setTimeout(() => {
                    this.updateTimer();
                    this.iterate();
                }, 1000);
            },


            resetAll() {
                //RESET
                this.active  = false;
                this.count   = 0;
                this.tweenToggle = 0;
                this.running = {
                    fare:       0,
                    surcharge:  0,
                    mtatax:     0,
                    tolls:      0,
                    tip:        0,
                    total:      0,
                    passengers: 0
                };

                if(marker){ // transitionをキャンセル
                    marker.interrupt();
                    marker.transition();
                    marker = null;
                }

                if(path){ // transitionをキャンセル
                    path.interrupt();
                    path.transition();
                    points = null;
                }

                d3path = null;
                if (this.timer) clearTimeout(this.timer);
                if (g0) g0.selectAll("*").remove();
                if (svg) svg.selectAll("*").remove();
            },

            loadTracking() {
                this.active = true;
                let _url  = "/api/proxy?url=https://someonesgarden.org/emory/tracks/taxiday" + Math.floor(Math.random() * 15) + '.geojson';
                let that = this;

                d3path = d3.geo.path().projection(d3.geo.transform({
                    point: function (x, y) {
                        let point = that.map.latLngToLayerPoint(new L.LatLng(y, x));
                        this.stream.point(point.x, point.y);
                    }
                }));

                g0 = svg.append("g").attr("class", "leaflet-layer-template leaflet-zoom-hide");

                axios.get(_url).then(_res => {

                    this.count = 0;
                    this.pointsArray = [];
                    points = g0.selectAll(".point").data(this.pointsArray);
                    marker = g0.append("circle").attr("id", "marker");
                    marker.attr("r", 5);

                    let _thisPath = g0.selectAll("path").data(_res.data.features);

                    //Enter
                    _thisPath
                        .enter()
                        .append("path")
                        .attr("class", d => {
                            if (d.properties.hasfare === true) return "trip" + (d.properties.key * 2) + " " + d.properties.hasfare;
                            return "trip" + ((d.properties.key * 2) + 1) + " " + d.properties.hasfare;
                        }).attr("style", "opacity:0");

                    //Exit
                    _thisPath.exit().remove();

                    let _calculate = () => {
                        let _bounds = d3path ? d3path.bounds(_res.data)  : [0,0];
                        let _TL     = _bounds[0];
                        let _BR     = _bounds[1];

                        svg.attr("width",  _BR[0] - _TL[0] + 100)
                           .attr("height", _BR[1] - _TL[1] + 100)
                           .style("left",  _TL[0] - 50 + "px")
                           .style("top",   _TL[1] - 50 + "px");

                        g0.attr("transform", "translate(" + (-_TL[0] + 50) + "," + (-_TL[1] + 50) + ")");//Pathを移動
                        _thisPath.attr("d", d3path); //経路情報を登録
                        g0.selectAll(".point").attr("transform", d => this.m_translatePoint(this.map, d)); //Path上をマーカー移動
                    };

                    if(d3path){
                        this.map.on("viewreset", _calculate);
                        this.map.on("zoomend",   _calculate);
                        _calculate();
                    }

                }).catch(error => console.log(error));
            },

            updateTimer() {

                this.mapstore.tracking.moment.add('minutes', 1);

                //this.moment.add('minutes', 1);
                this.timer = setTimeout(() => this.updateTimer(), 1000 / this.mapstore.tracking.timeFactor);
            },

            tweenDash(d){
                let _l = path.node().getTotalLength();
                let _i = d3.interpolateString("0," + _l, _l + "," + _l);

                return _t => {
                    //----------------- マーカーの移動
                    let _p = path.node().getPointAtLength(_t * _l);
                    if(marker) marker.attr("transform", "translate(" + _p.x + "," + _p.y + ")");

                    //------------------ Mapの移動
                    if (this.tweenToggle === 0) {
                        this.tweenToggle = 1;
                        let newCenter = this.map.layerPointToLatLng(new L.Point(_p.x, _p.y));
                        this.map.panTo(newCenter, 14);
                    } else {
                        this.tweenToggle = 0;
                    }

                    //----------- AreaChartの更新
                    if (this.$refs.areachartbox) this.$refs.areachartbox.tweenAreaChart(d, _t);

                    return _i(_t);
                }
            },

            transition(_path) {
                _path.transition().duration(d => {
                    let start = Date.parse(d.properties.pickuptime);
                    let finish = Date.parse(d.properties.dropofftime);

                    let duration = finish - start;
                    duration = duration / 60000; //convert to minutes
                    duration = duration * (1 /  this.mapstore.tracking.timeFactor) * 1000;

                    this.a_mapstore(['tracking','moment',moment(d.properties.pickuptime.toString())]);

                    return (duration);
                })
                    .attrTween("stroke-dasharray", this.tweenDash)
                    .each("end", d => {
                        if (d.properties.hasfare) {
                            this.running.fare += parseFloat(d.properties.fare);
                            this.running.surcharge += parseFloat(d.properties.surcharge);
                            this.running.mtatax += parseFloat(d.properties.mtatax);
                            this.running.tip += parseFloat(d.properties.tip);
                            this.running.tolls += parseFloat(d.properties.tolls);
                            this.running.total += parseFloat(d.properties.total);
                            this.running.passengers += parseFloat(d.properties.passengers);
                        }
                        this.count++;

                        let nextPath = svg.select("path.trip" + this.count);
                        if (nextPath[0][0] == null) {
                            clearTimeout(this.timer);
                        } else {
                            console.log("iterate!");
                            if (this.active) this.iterate();
                        }
                    });
            },

            iterate() {
                if (this.$refs.areachartbox) this.$refs.areachartbox.calculateArea();

                path = svg.select("path.trip" + this.count)
                    .attr("style", "opacity:.6")
                    .call(this.transition);

                let startPoint = this.m_pathStartPoint(path);

                marker.attr("transform", "translate(" + startPoint[0] + "," + startPoint[1] + ")");

                path.each(d => {
                    let _newLatLon = this.m_coordToLatLon(this.map,startPoint);
                    this.pointsArray.push([_newLatLon.lng, _newLatLon.lat, d.properties.hasfare]);

                    points = g0.selectAll(".point").data(this.pointsArray);

                    //Enter
                    points
                        .enter()
                        .append('circle')
                        .attr("r", 5)
                        .attr("class", d => {
                            if (d[2]) return "startPoint point";
                            return "endPoint point";
                        })
                        .attr("transform", d => this.m_translatePoint(this.map, d));

                    //Exit
                    points
                        .exit().remove();

                    if (d.properties.hasfare) {
                        marker
                            .transition()
                            .duration(500)
                            .attr("r", 5)
                            .attr('style', 'opacity:1');

                    } else {
                        marker
                            .transition()
                            .duration(500)
                            .attr("r", 40)
                            .attr('style', 'opacity:.3');
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    #trackmap {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        width: auto;
        height: auto;

        svg {
            position: relative;

            path {
                fill: none;
                stroke-width: 3px;

                &.true {
                    stroke: rgba(51, 255, 133, 0.87);
                }

                &.false {
                    stroke: #990099;
                    display: none;
                }
            }
        }
    }

    .route_overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 410;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;

        .info_win {
            background-color: #c97300;
            text-align: center;
            border-radius: 50%;
            width: 300px;
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .mybox {
        box-sizing: border-box;
        border-radius: 2px;
        display: none;
        z-index: 400;
    }

    .startPoint {
        fill: rgba(255, 162, 0, 0.64);
    }

    .endPoint {
        fill: rgba(57, 65, 255, 0.79);
    }

    #marker {
        fill: #ff56b8;
    }

    .markerLine {
        stroke: #ff5ff6;
    }
</style>
