<template>
  <md-card class="totalsBox mybox" v-if="running">
    <p>
      <strong><md-icon>dashboard</md-icon>&nbsp;Running Totals</strong>
    </p>
    <p>Fares: <span class="runningFare running" v-text="running.fare.toFixed(2)"></span></p>
    <p>Surcharge: <span class = "runningSurcharge running" v-text="running.surcharge.toFixed(2)"></span></p>
    <p>MTA Tax: <span class = "runningTax running" v-text="running.mtatax.toFixed(2)"></span></p>
    <p>Tips<sup>*</sup>: <span class = "runningTip running" v-text="running.tip.toFixed(2)"></span></p>
    <p class = "tolls">Tolls: <span class = "runningTolls running" v-text="running.tolls.toFixed(2)"></span></p>
    <p>Total: <span class = "runningTotal running" v-text="running.total.toFixed(2)"></span></p>
    <p>Passengers: <span class = "runningPassengers running" v-text="running.passengers"></span></p>
    <div class = "passengerGlyphs">
      <md-icon v-for="p in running.passengers" :key="'passenger'+p">directions_run</md-icon>
    </div>
  </md-card>
</template>

<script>

    export default {
        name: "TotalBox",
        props:['running']
    }
</script>

<style scoped lang="scss">
  .totalsBox {
    color:white;
    padding:5px;
    background-color:rgba(12,34,23,0.5);
    position: absolute;
    top: 65px;
    right: 15px;
    width: 300px;
    p {
      font-size: 16px;
      margin-bottom: 0;
    }
  }

  .running {
    float: right;
  }

  .tolls {
    border-bottom: 1px solid #fff;
  }

</style>
