const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys');
const spotifyRouter = require('./routes/spotify/index');
const twitterRouter = require('./routes/twitter/index');
const analyzeRouter = require('./routes/analyzer/index');
const mysqlRouter   = require('./routes/mysql/index');
const app = express();
let http = require('http').Server(app);


//*-------------------------------  REDIS
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000});
const redisPublisher = redisClient.duplicate();
//*-------------------------------  REDIS



//*-------------------------------  SOCKET.IO
const io = require('socket.io')(http);

// io :     全員に送られる
// socket : そのユーザーだけに送られる

io.on('connection',function(socket){

    //接続したユーザーにIDを識別情報として保存させる
    console.log('socket_id: ' + socket.id + ' is connected');
    socket.emit('new-socket-id',{socketid:socket.id});

    // 新規ユーザーのアクセス
    socket.on('open-socket', function(msg) {
        let resmsg = {...msg,socketid:socket.id};
        socket.emit('open-socket-success',resmsg);
        console.log("open-socket:success");
    });

    socket.on('close-socket', function(msg) {
        console.log("close-socket:success");
        let resmsg = {...msg,socketid:socket.id};
        socket.emit('close-socket-success',resmsg);
        socket.disconnect();
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', function(msg){
        console.log(msg);
        console.log("disconnect called");
    });

});
//*-------------------------------  SOCKET.IO


app.use(cors());
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// CORSを許可する
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/' , function(req, res){
    res.send('API IS REASDY');
});

app.use('/spotify', spotifyRouter);
app.use('/twitter', twitterRouter);
app.use('/analyze', analyzeRouter);
app.use('/mysql',   mysqlRouter);

// app.listen(5000, err => {
//   console.log('Listening on Port 5000');
// });

const PORT = 5000;
http.listen(PORT, ()=>{
    console.log('server listening. Port:' + PORT);
});

