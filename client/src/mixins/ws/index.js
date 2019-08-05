import io from 'socket.io-client'
import {mapGetters, mapActions} from 'vuex';

let socket = io({path: '/ws/socket.io'});

export default{

    computed:mapGetters(['ws','spotify','mapstore']),
    methods: {
        ...mapActions(['a_ws']),

        m_connectToSocket() {
            if (this.spotify.me && this.spotify.me.id) {
                let your_pos_and_data = {
                    name: this.spotify.me.id,
                    center:this.mapstore.geocoding.center,
                    pid: this.spotify.playlist ? this.spotify.playlist.id : null,
                    tid: this.spotify.track ? this.spotify.track.id : null
                };
                this.m_socketConnect(your_pos_and_data);
            }
        },

        m_socketInit(){
            // YOUR SOCKET
            socket.on('new-socket-id', (msg)=>{
                console.log("[WS] new-socket-id");
                console.log(msg);
                this.a_ws(['set','socketid',msg.socketid]);
            });

            socket.on('open-socket-success',(msg)=>{
                console.log("[WS] open-socket-success");
                console.log(msg);
                this.a_ws(['set','connect',socket.connected]);
                this.a_ws(['set','socketid',msg.socketid]);
                this.a_ws(['set','youname',msg.name]);
            });

            socket.on('close-socket-success',(msg)=>{
                console.log("[WS] close-socket-success");
                console.log(msg);
                this.a_ws(['reset','you']);
            });

            // BROADCAST
            socket.on('new-user-added', (msg)=>{
                console.log("[WS] new-user-socket");
                console.log(msg);
                this.a_ws(['set','users',msg.clients]);
            });

            socket.on('user-disconnected', (msg)=>{
                console.log("[WS] user-disconnected!");
                console.log(msg);
                this.a_ws(['set','users',msg.clients]);
            });
        },

        m_socketConnect(userdata){
            if(socket.disconnected) socket.open();
            socket.emit('open-socket', {...userdata, date:new Date});
        },

        m_socketDisconnect(){
            if(socket.connected) socket.emit('close-socket',{});
        }
    }
}
