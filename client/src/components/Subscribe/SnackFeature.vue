<template>
    <div class="snack_feature">
        <p>「{{lyric.song}}」{{lyric.artist}} (A D E L V)</p>
        <chart ref="bchart" type="bar" :data="chartData" :options="options" :height="25" />
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Chart from '../Chart/Chartjs';
    export default {
        name: "SnackFeature",
        props:['lyric'],
        components:{Chart},
        computed:{
            ...mapGetters(['spotify']),
            chartData(){

                return {
                    labels: ['a', 'd', 'e', 'l', 'v'],
                    datasets: [
                        {
                            backgroundColor:  this.spotify.backgroundColors[0],
                            data: [
                                this.lyric.acousticness * 100,
                                this.lyric.danceability * 100,
                                this.lyric.energy * 100,
                                this.lyric.liveness * 100,
                                this.lyric.valence * 100
                            ]
                        }
                    ]
                }
            },
        },
        data () {
            return {

                options: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.yLabel;
                            }
                        }
                    },
                    title: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            display : false,
                            gridLines: {
                                drawBorder: false,
                                display : false
                            }
                        }]
                    }


                }
            }
        },

    }
</script>

<style scoped>

</style>
