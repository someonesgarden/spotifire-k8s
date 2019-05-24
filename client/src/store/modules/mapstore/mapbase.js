const state = {

    baseimg:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

    locations:[
        {
            htmltxt: '千代田区',
            lat: 35.670812,
            lng: 139.754182,
            w:20,
            h:20,
            img: '/static/img/markers/m_friend_boy_1.png'
        },
        {
            htmltxt: '中央地区',
            lat: 35.668796,
            lng: 139.786583,
            w:20,
            h:20,
            img: '/static/img/markers/m_friend_boy_2.png'
        },
        {
            htmltxt: '港エリア	',
            lat: 35.66849,
            lng: 139.746192,
            w:20,
            h:20,
            img: '/static/img/markers/m_friend_girl_1.png'
        },
        {
            htmltxt: '新宿区',
            lat: 35.69995,
            lng: 139.735037,
            w:30,
            h:30,
            img: '/static/img/markers/m_friend_girl_2.png'
        },
        {
            htmltxt: '文京区	',
            lat: 35.72349,
            lng: 139.749553,
            w:20,
            h:20,
            img: '/static/img/markers/m_friend_guy_1.png'
        },
        {
            htmltxt: '品川区	',
            lat: 35.598187,
            lng: 139.758968,
            w:30,
            h:30,
            img: '/static/img/markers/m_friend_girl_1.png'
        },
        {
            htmltxt: '太田市',
            lat: 35.549786,
            lng: 139.786522,
            w:30,
            h:30,
            img: '/static/img/markers/m_friend_boy_1.png'
        },
        {
            htmltxt: '世田谷区	',
            lat: 35.669726,
            lng: 139.620901,
            w:30,
            h:30,
            img: '/static/img/markers/m_friend_woman_1.png'
        },
        {
            htmltxt: '渋谷	',
            lat: 35.668183,
            lng: 139.709361,
            w:30,
            h:30,
            img: '/static/img/markers/m_friend_guy_1.png'
        },
        {
            htmltxt: '中野	',
            lat: 35.724688,
            lng: 139.65612,
            w:30,
            h:30,
            img: '/static/img/markers/m_friend_woman_1.png'
        },
        {
            htmltxt: '杉並	',
            lat: 35.671529,
            lng: 139.646176,
            w:35,
            h:35,
            img: '/static/img/markers/m_friend_guy_1.png'
        }
    ],

    marker_txt_test: '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
        '<div id="bodyContent">' +
        "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
        "sandstone rock formation in the southern part of the " +
        "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
        "south west of the nearest large town, Alice Springs; 450&#160;km " +
        "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
        "features of the Uluru - Kata Tjuta National Park. Uluru is " +
        "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
        "Aboriginal people of the area. It has many springs, waterholes, " +
        "rock caves and ancient paintings. Uluru is listed as a World " +
        "Heritage Site.</p>" +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
        "(last visited June 22, 2009).</p>" +
        "</div>" +
        "</div>"
}

const mutations = {
    setTracking(state,val){
        if(!!val) {
            state.tracking = val;
        }else{
            state.tracking = !state.tracking;
        }
    }
}

export default {
    state,
    mutations
}
