<template>
  <md-card class="totalsBox mybox" v-if="running">
    <p>
      <strong><md-icon>dashboard</md-icon>&nbsp;{{timer_time}}</strong>
    </p>
    <hr>
    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100 md-medium-size-100 mx-auto text-center">
      <md-button  :md-ripple="false" class="md-fab text-center" @click="slowerClick">
        -
      </md-button>
      <md-button  :md-ripple="false" class="md-fab text-center" @click="fasterClick">
        +
      </md-button>
      <md-button  :md-ripple="false" class="md-fab text-center" @click="$emit('toggle')">
        x
      </md-button>
      <md-button :md-ripple="false" class="md-fab text-center md-teal" @click="$emit('reloadClick')">
        {{mapstore.tracking.timeFactor}}
      </md-button>
    </div>
    <p>Points: <span class = "runningTotal running" v-text="parseInt(running.total)"></span></p>
    <p>Members: <span class = "runningPassengers running" v-text="running.passengers"></span></p>
    <div class = "passengerGlyphs">
      <md-icon v-for="p in running.passengers" :key="'passenger'+p">directions_run</md-icon>
    </div>
  </md-card>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex';
    export default {
        name: "TotalBox",
        props:['running'],
      computed: {
        ...mapGetters(['mapstore']),
        timer_time() {
          return this.mapstore.tracking.moment ? this.mapstore.tracking.moment.format('h:mm a') : '';
        }
      },
      methods: {
        ...mapActions(['a_mapstore']),
        reloadClick() {
          location.reload();
        },
        slowerClick() {
          if (this.mapstore.tracking.timeFactor > 1) this.a_mapstore(['tracking', 'minus_timefactor']);
        },

        fasterClick() {
          this.a_mapstore(['tracking', 'add_timefactor']);
        },
      }
    }
</script>

<style scoped lang="scss">
  .totalsBox {
    color:white;
    padding:8px;
    background-color:rgba(12,34,23,0.5);
    position: absolute;
    top: 65px;
    right: 15px;
    width: 200px;
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
