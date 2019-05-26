<template>
    <mu-list-item avatar button :ripple="false" class="range user" v-if="user" :class="{disconnected:!ws.you.connected, you:user.name===ws.you.name}">
<!--        <mu-list-item-action>-->
<!--            <mu-avatar>-->
<!--                <img src="/static/img/a1.jpg">-->
<!--            </mu-avatar>-->
<!--        </mu-list-item-action>-->
        <mu-list-item-title>{{user.name}}</mu-list-item-title>
<!--        <mu-list-item-action>-->
<!--            <mu-icon value="location_on" :size="15"></mu-icon>-->
<!--        </mu-list-item-action>-->
    </mu-list-item>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "MapUserItem",
        props:['user'],
        computed:mapGetters(['ws'])

    }
</script>

<style scoped lang="scss">


    li.user{

        &.disconnected{
            opacity:0.3;
            pointer-events: none;
        }

        &.you{
            background-color: #e6004c;
            color:white;
            font-weight:bold;
            margin:3px;
            border-radius:3px;
        }
    }



</style>
