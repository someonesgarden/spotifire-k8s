
export default{

    computed:{

    },

    methods: {
        findMe(){
            console.log("moveToMe");
        },

        trackToggle(){
            console.log("trackStart");
            this.a_mapstore(['set','tracking',null]);
        },

        trackStop(){
            console.log("trackStop");
            this.a_mapstore(['set','tracking',false]);
        },

        trackStart(){
            console.log("trackStop");
            this.a_mapstore(['set','tracking',true]);
        }
    }
}
