<template>
    <div>
        <transition  name="fade18" appear>
            <div id="colorbg1" class="bg hardlight" :style="gradBg1" v-if="bgshow"></div>
        </transition>

        <transition  name="fade18" appear>
            <div id="colorbg2" class="bg hardlight" :style="gradBg2" v-if="!bgshow"></div>
        </transition>
    </div>
</template>

<script>
    import utilMixin  from '../../../mixins/util';
    export default {
        name: "GradBgs",
        mixins:[utilMixin],
        props:['params'],
        data(){
            return{
                gradBg1       :null,
                gradBg2       :null,
                bgshow        :false,
                interval      :null
            }
        },
        methods:{
            rollBg() {
                this.gradBg1 = this.c_gradient_bg(this.params[0],this.params[1]);
                this.gradBg2 = this.c_gradient_bg(this.params[2],this.params[3]);
                this.bgshow  = !this.bgshow;
            },
        },

        mounted(){
            this.rollBg();
            this.interval  = setInterval(() => this.rollBg(), 4000);
        },

        beforeDestroy() {
            if(!!this.interval) clearInterval(this.interval);
        }
    }
</script>
