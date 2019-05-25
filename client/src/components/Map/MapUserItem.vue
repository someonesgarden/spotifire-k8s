<template>
    <mu-list-item avatar button :ripple="false" class="range user" v-if="user">
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
    export default {
        name: "MapUserItem",
        props:['user']

    }
</script>

<style scoped lang="scss">


</style>
