<template>
    <mu-flex justify-content="center" align-items="center" direction="column">
<!--        <canvas id="deckmap"></canvas>-->

        <div id="container">
            <div id="map"></div>
            <canvas id="deckmap"></canvas>
        </div>

        <p v-if="test" style="font-size:3px;position:absolute;bottom:75px;color:#aaa;">{{test}}</p>
    </mu-flex>
</template>
<script>
    import { Deck } from '@deck.gl/core'
    import { GeoJsonLayer, ArcLayer} from '@deck.gl/layers'
    import axios from 'axios';
    import mapboxgl from 'mapbox-gl'

    const GEOJSON = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson';
    const AIR_PORTS = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';
    // const INITIAL_VIEW_STATE = {
    //     latitude: 35,
    //     longitude: -115,
    //     zoom: 3,
    //     bearing: 30,
    //     pitch: 30
    // };
    const INITIAL_VIEW_STATE = {
        latitude: 51.47,
        longitude: 0.45,
        zoom: 4,
        bearing: 0,
        pitch: 30
    };



    export default {
        name: "DeckOverlay",
        data () {
            return {
                map:null,
                deck: '',
                test:null
            }
        },
        methods: {
            deck_geojson() {


                this.map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/light-v9',
                    // Note: deck.gl will be in charge of interaction and event handling
                    interactive: false,
                    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
                    zoom: INITIAL_VIEW_STATE.zoom,
                    bearing: INITIAL_VIEW_STATE.bearing,
                    pitch: INITIAL_VIEW_STATE.pitch
                });

                // this.deck = new Deck({
                //     canvas: 'deckmap',
                //     initialViewState: INITIAL_VIEW_STATE,
                //     controller: true,
                //     layers: [
                //         new GeoJsonLayer({
                //             visible: true,
                //             data: GEOJSON,
                //             stroked: true,
                //             filled: true,
                //             lineWidthMinPixels: 2,
                //             opacity: 0.4,
                //             getLineColor: () => [255, 100, 100],
                //             getFillColor: () => [200, 160, 0, 180]
                //         })
                //     ]
                // })

                this.deck = new Deck({
                    canvas: 'deckmap',
                    width: '100%',
                    height: '100%',
                    interactive: false,
                    initialViewState: INITIAL_VIEW_STATE,
                    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
                    zoom: INITIAL_VIEW_STATE.zoom,
                    bearing: INITIAL_VIEW_STATE.bearing,
                    pitch: INITIAL_VIEW_STATE.pitch,
                    controller: true,
                    onViewStateChange: ({viewState}) => {
                        this.map.jumpTo({
                            center: [viewState.longitude, viewState.latitude],
                            zoom: viewState.zoom,
                            bearing: viewState.bearing,
                            pitch: viewState.pitch
                        });
                    },
                    layers: [
                        new GeoJsonLayer({
                            id: 'airports',
                            data: AIR_PORTS,
                            // Styles
                            filled: true,
                            pointRadiusMinPixels: 2,
                            opacity: 1,
                            pointRadiusScale: 2000,
                            getRadius: f => 11 - f.properties.scalerank,
                            getFillColor: [200, 0, 80, 180],
                            // Interactive props
                            pickable: true,
                            autoHighlight: true,
                            onClick: info =>
                                // eslint-disable-next-line
                                info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
                        }),
                        new ArcLayer({
                            id: 'arcs',
                            data: AIR_PORTS,
                            dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
                            // Styles
                            getSourcePosition: f => [-0.4531566, 51.4709959], // London
                            getTargetPosition: f => f.geometry.coordinates,
                            getSourceColor: [0, 128, 200],
                            getTargetColor: [200, 0, 80],
                            getWidth: 1
                        })
                    ]
                });
            },
            deckInit() {
                this.deck_geojson()
            },
            deckDestory () {
                this.deck.finalize()
            }
        },
        mounted () {
            axios.get('/api/props/tokens').then( res =>{

                mapboxgl.accessToken = res.data.mapbox;

                this.deckInit();

            }).catch(error => console.log(error))
        },
        beforeDestroy () {
            this.deckDestory()
        }
    }
</script>
<style lang="scss" scoped>
    #container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        & > * {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

</style>
