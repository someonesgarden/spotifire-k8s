export default class WebAudio{
    constructor(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context  = new AudioContext();
        this.context.createGain = this.context.createGain || this.context.createGainNode;
        if(!this.gainNode) this.gainNode = this.context.createGain(); //ボリューム用ゲイン
        this.playing = false;
        this.file = "";
        this.volume = 20;
    }

    loadSound(file,fn){
        this.file = file;
        this.getAudioBuffer("/api/proxy?url="+file, buffer=> {
            this.source         = this.context.createBufferSource();
            this.source.buffer  = buffer;
            this.source.loop    = false;
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.context.destination);
            this.gainNode.gain.setValueAtTime(0,this.context.currentTime);//とりあえずゼロからスタート
            if(fn) fn(buffer);
        });
    }

    // Audio 用の buffer を読み込む
    getAudioBuffer(url, fn) {
        fetch(url,{mode: 'cors'})
            .then(response=> response.arrayBuffer())
            .then(arrayBuffer=> this.context.decodeAudioData(arrayBuffer, buffer => fn(buffer)))
            .catch(e => console.log(e.message));
    };


    // サウンドを停止（フェードなし）
    halt() {
        if (this.playing) {
            if (this.source && this.source.stop){
                if(this.playing) this.source.stop(0);
                this.playing = false;
            }else{
                this.source.stop = this.source.noteOff;
            }
        }
    };

    // サウンドを再生
    fadeStart(vol=null) {
        this.volume = vol ? vol : this.volume;
        console.log("this.volume",this.volume);
        if(!this.playing){
            this.playing = true;
            this.source.start(0);    // 再生
            this.volFadeTo(this.volume,1);
            return this.context.currentTime + 1; //現在の再生時間
        }
        return 0;
    };

    // サウンドを停止（フェードあり）
    fadeStop() {
        if (this.playing) {
            this.volFadeTo(0, 1);
            setTimeout(() => {
                if (!this.source.stop){
                    this.source.stop = this.source.noteOff;
                }else{
                    if(this.playing) this.source.stop(0);
                }
                this.playing = false;
            }, 2000);
            return this.context.currentTime + 1; //現在の再生時間
        }
        return 0;
    };

    volTo(value){ //フェードなしにボリュームを変える
        let vol = parseInt(value) / 100;
        this.gainNode.gain.setValueAtTime(vol,this.context.currentTime);
    };

    volFadeTo(value,duration=2){
        let vol = parseInt(value) / 100;
        this.gainNode.gain.linearRampToValueAtTime(vol*vol, this.context.currentTime+duration);
    }
}
