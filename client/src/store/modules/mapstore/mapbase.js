const state = {

    baseimg:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

    locations:[
        {
            htmltxt: '千代田区',
            lat: 35.670812,
            lng: 139.754182,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '中央地区',
            lat: 35.668796,
            lng: 139.786583,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '港エリア	',
            lat: 35.66849,
            lng: 139.746192,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '新宿区',
            lat: 35.69995,
            lng: 139.735037,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '文京区	',
            lat: 35.72349,
            lng: 139.749553,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '台東区	',
            lat: 35.718801,
            lng: 139.781518,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '墨田区	',
            lat: 35.694484,
            lng: 139.804232,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '江東区	',
            lat: 35.629417,
            lng: 139.796671,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '品川区	',
            lat: 35.598187,
            lng: 139.758968,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '目撃者エリア',
            lat: 35.651328,
            lng: 139.691599,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '太田市',
            lat: 35.549786,
            lng: 139.786522,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '世田谷区	',
            lat: 35.669726,
            lng: 139.620901,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '渋谷	',
            lat: 35.668183,
            lng: 139.709361,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '中野	',
            lat: 35.724688,
            lng: 139.65612,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '杉並	',
            lat: 35.671529,
            lng: 139.646176,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '汝矣島地区	',
            lat: 35.735037,
            lng: 139.749607,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '北部地区	',
            lat: 35.754421,
            lng: 139.745645,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '荒川	',
            lat: 35.752063,
            lng: 139.76361,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '板橋区	',
            lat: 35.752364,
            lng: 139.676337,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '練馬区	',
            lat: 35.757756,
            lng: 139.620976,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '足立区	',
            lat: 35.740193,
            lng: 139.797811,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '葛飾区	',
            lat: 35.755326,
            lng: 139.871866,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '江陰川区	',
            lat: 35.693059,
            lng: 139.893822,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '八王子市	',
            lat: 35.617579,
            lng: 139.335315,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '立川	',
            lat: 35.727354,
            lng: 139.36986,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '武佐野市	',
            lat: 35.700419,
            lng: 139.589688,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '三鷹市	',
            lat: 35.673275,
            lng: 139.580228,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '青梅市	',
            lat: 35.830314,
            lng: 139.263568,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '府中市	',
            lat: 35.670488,
            lng: 139.45922,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        {
            htmltxt: '秋島市	',
            lat: 35.696368,
            lng: 139.367957,
            img: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
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
