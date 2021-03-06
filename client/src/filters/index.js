import Vue from 'vue'
import moment from 'moment'


Vue.filter('trimspaces', txt=> txt.trim());

Vue.filter('dicimal2', fnum=> Math.round(fnum*10)/10);
Vue.filter('dicimal3', fnum=> Math.round(fnum*100)/100);
Vue.filter('dicimal4', fnum=> Math.round(fnum*1000)/1000);

Vue.filter('slice5', str => str.length  > 5 ? str.slice(0,5)+'.' : str);

//Filter
Vue.filter('listdate', time => moment(time).format('MMMM Do YYYY'));
Vue.filter('date2', time => moment(time).format('MMM.YYYY'));
Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'));
Vue.filter('year', time => moment(time).format('YYYY'));
Vue.filter('month', time => moment(time).format('M'));
Vue.filter('m4', time => moment(time).format('MMMM'));
Vue.filter('date', time => moment(time).format('D'));
Vue.filter('d2', time => moment(time).format('DD'));
Vue.filter('fancyTimeFormat', s=> (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s);

Vue.filter( 'toCommas', ( num, decimals ) => {
    let o = { style: 'decimal', minimumFractionDigits: decimals, maximumFractionDigits: decimals };
    return new Intl.NumberFormat( 'en-US', o ).format( num );
});
Vue.filter( 'toSpaces', ( str ) => {
    return String( str || '' ).trim().replace( /[^\w\`\'\-]+/g, ' ' ).trim();
});
Vue.filter( 'toText', ( str, def ) => {
    str = String( str || '' ).replace( /[^\w\`\'\-\.\!\?]+/g, ' ' ).trim();
    return str || String( def || '' );
});

Vue.filter('truncate', function(value) {
    let str = value.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
    //var length = length ? parseInt(length, 10) : 20;
   let length = 220;
   let ommision = '...';

    if(str.length <= length) {
        return str;
    }
    else {
        return str.substring(0, length) + ommision;
    }
});

Vue.filter('truncate20', function(str) {

    let length = 20;
    let ommision = '..';
    if(str.length <= length) {
        return str;
    }
    else {
        return str.substring(0, length) + ommision;
    }
});

Vue.filter('distance', function(dist) {

    let km = parseInt(dist*100)/100;
    if(km>1){
        return km+' km';
    }else{
        return parseInt(dist*1000)+' m';
    }
});
