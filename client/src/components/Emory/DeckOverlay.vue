<template>
    <mu-flex justify-content="center" align-items="center" direction="column">
        <canvas id="deckmap"></canvas>
    </mu-flex>
</template>
<script>
    import { Deck } from '@deck.gl/core'
    import { GeoJsonLayer } from '@deck.gl/layers'
    import mapboxgl from 'mapbox-gl'

    const GEOJSON = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson';
    const AIR_PORTS = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';
    const INITIAL_VIEW_STATE = {
        latitude: 35,
        longitude: -115,
        zoom: 3,
        bearing: 30,
        pitch: 30
    };

    //mapboxgl.accessToken = process.env.MapboxAccessToken;


    export default {
        name: "DeckOverlay",
        data () {
            return {
                deck: '',

            }
        },
        methods: {
            deck_geojson() {
                this.deck = new Deck({
                    canvas: 'deckmap',
                    initialViewState: INITIAL_VIEW_STATE,
                    controller: true,
                    layers: [
                        new GeoJsonLayer({
                            visible: true,
                            data: GEOJSON,
                            stroked: true,
                            filled: true,
                            lineWidthMinPixels: 2,
                            opacity: 0.4,
                            getLineColor: () => [255, 100, 100],
                            getFillColor: () => [200, 160, 0, 180]
                        })
                    ]
                })
            },
            deckInit() {
                this.deck_geojson()
            },
            deckDestory () {
                this.deck.finalize()
            }
        },
        mounted () {
            this.deckInit()
            console.log("process.env");
            console.log(process.env);
            alert(JSON.stringify(process.env));
        },
        beforeDestroy () {
            this.deckDestory()
        }
    }
</script>
