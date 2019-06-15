export default class PWASensors{

    constructor(params) {
        console.log("Sensors:constructor");
        this.use = {
            orientation: params.orientation ? params.orientation : true,
            calibration:false,
            // gyro:false,
            // mousemove:false,
            // compass:params.compass ? params.compass : false,
            // rotate: params.rotate ? params.rotate : false,
        };

        // this.gyro = {
        //     sensor: null,
        //     x: 0,
        //     y: 0,
        //     z: 0
        // };

        this.compass_calib = false;

        this.sensor = {
            heading: null,
            angleH: 1.000000000000000,
            hx: 0.000000000000000,
            hy: 0.000000000000000,
            hz: 0.000000000000000,
            angleV: 2.000000000000000,
            vx: 0.000000000000000,
            vy: 0.000000000000000,
            vz: 0.000000000000000,
            alpha: 0.000000000000000,
            beta: 0.000000000000000,
            gamma: 0.000000000000000
        };
        this.init();
    }

    init(){
        console.log("Init Sensors");

        this.sensor.angleH = 2.0;
        this.sensor.angleV = 4.0;

        if(this.use.orientation) window.addEventListener('deviceorientation', this.deviceOrientation, false);
        // if(this.use.calibration)    window.addEventListener("compassneedscalibration", this.compassNeedsCalibration, true);
        // if(this.use.rotate)         window.addEventListener('devicemove', this.rotateChange, false);
        // if(this.use.mousemove)      document.addEventListener('mousemove', this.moveChange);
        // if(this.use.gyro){
        //     this.gyro.sensor = new Gyroscope();
        //     this.gyro.sensor.addEventListener('reading', () => {
        //         console.log(this.gyro.x);
        //         console.log(this.gyro.y);
        //         console.log(this.gyro.z);
        //     });
        //     this.gyro.sensor.start();
        // }
    }

    stopAll(){
        console.log("Stop All Sensors");
        if(this.use.orientation)    window.removeEventListener('deviceorientation', this.deviceOrientation, false);
        // if(this.use.calibration)    window.removeEventListener("compassneedscalibration", this.compassNeedsCalibration, true);
        // if(this.use.rotate)         window.removeEventListener('devicemove', this.rotateChange, false);
        // if(this.use.mousemove)      document.removeEventListener('mousemove', this.moveChange);
        // if(this.gyro.sensor)        this.gyro.sensor.stop();
    }


    // compassNeedsCalibration(e){
    //     this.compass_calib = true;
    // }

    // rotateChange(e){
    //
    // }
    //
    // moveChange(e){
    //
    // }

    deviceOrientation(e){
        //if (navigator.geolocation) navigator.geolocation.getCurrentPosition(position =>  this.sensor.heading = position.coords.heading);
        this.sensor.alpha = e.alpha;
        this.sensor.beta = e.beta;
        this.sensor.gamma = e.gamma;

        let ro = -(window.orientation || 0) * Math.PI / 180;
        let ry =  (e.gamma || 0) * Math.PI / 180;
        let rx =  (e.beta  || 0) * Math.PI / 180;
        let rz =  (e.alpha || 0) * Math.PI / 180;
        let co = Math.cos(ro);
        let so = Math.sin(ro);
        let cy = Math.cos(ry);
        let sy = Math.sin(ry);
        let cx = Math.cos(rx);
        let sx = Math.sin(rx);
        let cz = Math.cos(rz);
        let sz = Math.sin(rz);

        // ローカル x 軸ベクトル
        let axisX = {
            x: co * cy * cz - co * sy * sx * sz - so * cx * sz,
            y: co * cy * sz + co * sy * sx * cz + so * cx * cz,
            z:-co * sy * cx + so * sx
        };

        // ローカル y 軸ベクトル
        let axisY = {
            x:-so * cy * cz + so * sy * sx * sz - co * cx * sz,
            y:-so * cy * sz - so * sy * sx * cz + co * cx * cz,
            z: so * sy * cx + co * sx
        };

        // ローカル z 軸ベクトル
        let axisZ = {
            x: sy * cz + cy * sx * sz,
            y: sy * sz - cy * sx * cz,
            z: cy * cx
        };

        // ------------------------------------------------------------
        // デバイスを水平に寝かせて閲覧している場合
        // ------------------------------------------------------------
        let angleH = Math.atan2(-axisY.x,axisY.y) * (180.0 / Math.PI);
        if(axisZ.z < 0) angleH = -angleH;

        this.sensor.angleH = angleH;
        this.sensor.hx = (axisY.x).toFixed(4);
        this.sensor.hy = (axisY.y).toFixed(4);
        this.sensor.hz = (axisY.z).toFixed(4);

        // ------------------------------------------------------------
        // デバイスを垂直に立てて閲覧している場合
        // ------------------------------------------------------------
        let angleV = Math.atan2(axisZ.x,-axisZ.y) * (180.0 / Math.PI);
        this.sensor.angleV = angleV;
        this.sensor.vx = (-axisZ.x).toFixed(4);
        this.sensor.vy = (-axisZ.y).toFixed(4);
        this.sensor.vz = (-axisZ.z).toFixed(4);
    }
}

