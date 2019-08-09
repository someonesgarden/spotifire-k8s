<template>
  <md-card class="areaChartBox mybox" ref="areachartbox"></md-card>
</template>

<script>
  let areaChartSvg = null;
  let markerLine = null;
  let marker = null;
  let totalAreaPath = null;
  let emptyAreaPath = null;

  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: "AreaChartBox",
    props: ['running'],
    data() {
      return {
        xScale: null,
        yScale: null,
        area: null,
        areaChartInterval: 0,
        emptyAreaData: [],
        totalAreaData: []
      }
    },
    computed: mapGetters(['mapstore']),

    mounted() {
      this.areaChartInit();
      this.calculateArea();
    },

    methods: {
      ...mapActions(['a_mapstore']),

          resetAll(){
            if(areaChartSvg) areaChartSvg.selectAll("*").remove();
            areaChartSvg  = null;
            markerLine    = null;
            marker        = null;
            totalAreaPath = null;
            emptyAreaPath = null;
            this.xScale = null;
            this.yScale = null;
            this.area   = null;
            this.areaChartInterval = 0;

            this.totalAreaData = [];
            this.emptyAreaData = [];

            this.areaChartInit();
            this.calculateArea();
          },

          calculateArea(){
            this.areaChartInterval  = 0;
            this.emptyAreaData = [];
            emptyAreaPath = areaChartSvg.append("path").datum(this.emptyAreaData).attr("class", "empty");
          },

          tweenAreaChart(d,t){
            if(this.areaChartInterval === 10){
              this.areaChartInterval = 0;
              let _decimalHour = parseInt(this.mapstore.tracking.moment.format('H')) + parseFloat(this.mapstore.tracking.moment.format('m')/60);

              if(isNaN(d.properties.fare)) d.properties.fare = 0;
              let _incrementalFare = d.properties.fare*t;

              //グラフ全体の描画
              this.totalAreaData.push({
                "time": _decimalHour,
                "runningFare": this.running.fare + parseFloat(_incrementalFare)
              });
              totalAreaPath.attr("d", this.area);

              //Nonfareタイムの描画
              if(d.properties.hasfare === false) {
                this.emptyAreaData.push({
                  "time": _decimalHour,
                  "runningFare": this.running.fare + parseFloat(_incrementalFare)
                });
               emptyAreaPath.attr("d", this.area)
              }

              //縦棒の描画
              markerLine
                .attr('x1', this.xScale(_decimalHour))
                .attr('x2', this.xScale(_decimalHour));

            } else {
              this.areaChartInterval++;
            }
          },

        areaChartInit(){
          let _margin = {top: 30, right: 20, bottom: 20, left: 40};
          let _areaChartWidth  = window.innerWidth - _margin.left - _margin.right - 40;
          let _areaChartHeight = 140 - _margin.top - _margin.bottom;

          this.xScale = d3.scale.linear()
                  .range([0, _areaChartWidth])
                  .domain([0, 24]);

          this.yScale = d3.scale.linear()
                  .range([_areaChartHeight, 0])
                  .domain([0, 600]);

          let _xAxis = d3.svg.axis()
                  .scale(this.xScale)
                  .orient("bottom");

          let _yAxis = d3.svg.axis()
                  .scale(this.yScale)
                  .orient("left").ticks(4);

          this.area = d3.svg.area()
            .x((d)=> this.xScale(d.time))
            .y0(_areaChartHeight)
            .y1((d)=> this.yScale(d.runningFare));

          areaChartSvg = d3.select(".areaChartBox").append("svg")
            .attr("width", _areaChartWidth + _margin.left + _margin.right)
            .attr("height", _areaChartHeight + _margin.top + _margin.bottom)
            .attr("class","areaChart")
            .append("g")
            .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");

          markerLine = areaChartSvg.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', _areaChartHeight)
            .attr("class","markerLine");

          totalAreaPath = areaChartSvg.append("path").datum(this.totalAreaData).attr("class", "area");

          areaChartSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _areaChartHeight + ")")
            .call(_xAxis)
            .append("text")
            .attr("y", 9)
            .attr("x", 39)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Hour");

          areaChartSvg.append("g")
            .attr("class", "y axis")
            .call(_yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Points");
        },
      }
    }
</script>

<style lang="scss">
</style>
