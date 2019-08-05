<template>
  <md-card class="dateTimeBox mybox">
    <p><strong><md-icon>timelapse</md-icon>&nbsp;{{timer_date}}</strong></p>
    <h2>{{timer_time}}</h2>
    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100 md-medium-size-100 mx-auto text-center">
      <md-button  :md-ripple="false" class="md-fab text-center" @click="slowerClick">
        -
      </md-button>
      <md-button  :md-ripple="false" class="md-fab text-center" @click="fasterClick">
        +
      </md-button>
      <md-button  :md-ripple="false" class="md-fab text-center" @click="$emit('toggle')">
        |
      </md-button>
      <md-button class="md-teal" @click="$emit('reloadClick')">
        »
      </md-button>
    </div>
    <p><span v-text="mapstore.tracking.timeFactor"></span> minutes per second</p>
  </md-card>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: "DateTimeBox",
    computed: {
      ...mapGetters(['mapstore']),
      timer_time() {
        return this.mapstore.tracking.moment ? this.mapstore.tracking.moment.format('h:mm a') : '';
      },

      timer_date() {
        return this.mapstore.tracking.moment ? this.mapstore.tracking.moment.format('dddd, MMMM Do YYYY') : '';
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
  .dateTimeBox {
    padding:5px;
    color:white;
    background-color: rgba(39, 64, 125, 0.47);
    position: absolute;
    top: 65px;
    left: 45px;
    width: 300px;
  }

  .readableTime {
    position: relative;
    top: -5px;
  }

  .date {
    font-size: 18px;
  }

  .time {
    font-size: 3em;
  }

  .passengerGlyphs {
    .glyphicon {
      margin-right: 2px;
    }
    width: 170px;
    margin: 0 auto;
  }


</style>
