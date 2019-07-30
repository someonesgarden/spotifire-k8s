import {mapGetters,mapActions} from 'vuex';
import axios from 'axios';

export default{

    computed:mapGetters(['mapstore']),

    methods: {
        ...mapActions(['a_weather']),

        m_temp2Celsius(temp,type='K'){
            temp = parseInt(temp);
            let reducers = {
                K: (temp)=> parseFloat(temp-273.15),
                F: (temp)=> parseFloat((temp-32) / 1.8)
            };
            if (!reducers[type]) return -1;
            return reducers[type](temp);
        },

        m_jisa_from_lng_diff(lng) {
            return this.mapstore.geocoding.center ? parseInt((parseFloat(lng) - this.mapstore.geocoding.center.lng) / 15) : 0;
        },

        m_weather(lat,lng,cb=null){
            lng = parseFloat(lng)>180 ?  parseFloat(lng)-360 : lng;
            lng = parseFloat(lng)<-180 ? parseFloat(lng)+360 : lng;

            let params  = {lat:lat, lng: lng};
            let promises = [
                axios.get("https://spotifire.work/api/weather/openweather/location",{params:params}),
               // axios.get("https://spotifire.work/api/weather/yahoo/location",{params:params}),
               // axios.get("https://spotifire.work/api/weather/hinode/location",{params:params})
            ];

            Promise.all(promises).then( results => {
                let openweather = results[0].data;
                //let yahoo       = results[1].data;
               // let hinode      = results[2].data;
                let date        = new Date();
                // let features = yahoo.Feature ? yahoo.Feature : [];
                // if(features.length>0) features = features[0].Property.WeatherList.Weather;

                let features = {
                    jisa:   this.m_jisa_from_lng_diff(lng),
                    update: date.getTime(),
                    temp:   this.m_temp2Celsius(openweather.main.temp),
                    main:   openweather.weather[0].main,
                    desc:   openweather.weather[0].description,
                    wind:   openweather.wind.deg,
                    clouds: openweather.clouds,
                    area:   openweather.name,
                    sunrise:openweather.sys.sunrise,
                    sunset: openweather.sys.sunset,
                };

                if(cb) cb(features);
            })
        },

        m_sunrise_and_set(lat,lng,cb=null){
            let URL = "https://spotifire.work/api/weather/hinode/location";
            let params = {lat:lat, lng: lng};

            axios.get(URL,{params:params}).then(res => {
                let date   = new Date();
                let sun = {
                    sunrise:res.data.rise_and_set.sunrise,
                    sunset:res.data.rise_and_set.sunset,
                    status: "day",
                    now24 : date.getHours()+date.getMinutes()/60.0,
                    date:date.getTime()
                };

                if(Math.abs(sun.now24-sun.sunrise)<1){
                    sun.status = "dawn";
                }else if(Math.abs(sun.now24-sun.sunset)<1){
                    sun.status = "sunset";
                }else if(Math.abs(sun.now24-12)<2){
                    sun.status = "midday";
                }else if(sun.sunrise > sun.now24 && sun.sunset < sun.now24){
                    sun.status = "night";
                }
                if(cb) cb(sun);
            }).catch(error => console.log(error));
        }
    }
}
