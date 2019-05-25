<template>
    <mu-list-item avatar button :ripple="false" class="range">
        <mu-list-item-action>
            <mu-avatar>
                <img src="/static/img/a1.jpg">
            </mu-avatar>
        </mu-list-item-action>
        <mu-list-item-title>Mike Li</mu-list-item-title>
        <mu-list-item-action>
            <mu-icon value="location_on" :size="19"></mu-icon>
        </mu-list-item-action>
    </mu-list-item>
</template>

<script>
    export default {
        name: "MapUserItem"
    }
</script>

<style scoped lang="scss">
    li.range{

        margin:0;

        .mu-item{
            .mu-item-title{
                font-size:14px;
            }
        }
    }

</style>
