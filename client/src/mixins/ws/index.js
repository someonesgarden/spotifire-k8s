import io from 'socket.io-client'
import {mapGetters, mapActions} from 'vuex';

let socket = io({path: '/ws/socket.io'});

window.alert(JSON.stringify({co:socket.connected,dis:socket.disconnected}));
//socket.close(); //一度接続して置いておく

export default{

    computed:mapGetters(['ws']),
    methods: {
        ...mapActions(['a_ws']),

        socketInit(){
            socket.on('new-socket-id', (msg)=>{
                console.log("new-socket-id");
                console.log(msg);
                this.a_ws(['set','socketid',msg.socketid]);
            });

            socket.on('open-socket-success',(msg)=>{
                console.log("open-socket-success");
                console.log(msg);
                this.a_ws(['set','connect',socket.connected]);
            });

            socket.on('close-socket-success',(msg)=>{
                console.log("close-socket-success");
                console.log(msg);
                this.a_ws(['reset','you']);
            });
        },

        socketConnect(username=null){
            if(socket.disconnected) socket.open();
            socket.emit('open-socket', {name:username, date:new Date});
        },

        socketDisconnect(){
            if(socket.connected) socket.emit('close-socket',{});
        }
    }
}
