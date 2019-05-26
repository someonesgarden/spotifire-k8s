<template>
    <div class="flex_v graphbase" ref="graphbase">
        <chart :type="'pie'" :data="pieData" :options="options"></chart>
    </div>
</template>

<script>
    import Chart from '../Chart/Chartjs';
    import {mapActions} from 'vuex';

    export default {
        name: "FeedGraph",
        props:['item','col'],
        components:{Chart},
        methods:{
            ...mapActions(['a_index']),

        },
        data(){
          return{
              h:250,
              labels: ['Sleeping', 'Designing', 'Coding', 'Cycling'],
              data: [20, 40, 5, 35],
              backgroundColor: [
                  '#1fc8db',
                  '#fce473',
                  '#42afe3',
                  '#ed6c63',
                  '#97cd76'
              ],
              options: {
                  segmentShowStroke: false
              },

          }
        },
        computed: {


            pieData() {
                return {
                    labels: this.labels,
                    datasets: [{
                        data: this.data,
                        backgroundColor: this.backgroundColor
                    }]
                }
            }
        },
        mounted(){

            let box_h = this.$refs.graphbase.clientHeight;
            let box_w = this.$refs.graphbase.clientWidth;

            if(box_h < box_w){
                this.h = 200;
            }else{
                this.h = box_w - 40;
            }

        },
        watch:{

        }
    }
</script>

<style scoped lang="scss">

    .graphbase{
        height:100%;

        &.wide{

        }
    }


</style>
