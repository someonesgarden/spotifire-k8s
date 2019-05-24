const state = {

    baseimg:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

    marker_types:[
        {
            icon:'/static/img/markers/m_friend_boy_1.png',
            title:'For Your Holidays.',
            subtitle:'top smooth tracks',
            body:'もう半世紀以上のあいだ名詞や動詞や助詞や形容詞や疑問符など言葉どもに揉まれながら暮らしてきましたからどちらかと言うと無言を好みます',
            thumb:'/static/img/covers/p1.jpg',
            pid:'',
            id:0,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_boy_2.png',
            title:'Poets for Your Life',
            subtitle:'',
            body:'私は工具類が嫌いではありませんまた樹木が灌木も含めて大好きですがそれらの名称を覚えるのは苦手です',
            thumb:'/static/img/covers/p2.jpg',
            pid:'',
            id:1,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_girl_1.png',
            title:'Electro Tokyo',
            subtitle:'',
            body:'夏はほとんどＴシャツで過ごします私の書く言葉には値段がつくことがあります',
            thumb:'/static/img/covers/p3.jpg',
            pid:'',
            id:2,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_girl_2.png',
            title:'Michael Jackson',
            subtitle:'this is life.',
            body:'私は過去の日付にあまり関心がなく権威というものに反感をもっています斜視で乱視で老眼です',
            thumb:'/static/img/covers/p4.jpg',
            pid:'',
            id:3,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_guy_1.png',
            title:'My Summer REwind',
            subtitle:'How good!',
            body:'家には仏壇も神棚もありませんが室内に直結の巨大な郵便受けがあります私にとって睡眠は快楽の一種です',
            thumb:'/static/img/covers/p5.jpg',
            pid:'',
            id:4,
            type:'friend'
        }
        ,
        {
            icon:'/static/img/markers/m_friend_woman_1.png',
            title:'Podcart',
            subtitle:'How good!',
            body:'夢は見ても目覚めたときには忘れていますここに述べていることはすべて事実です',
            thumb:'/static/img/covers/p6.jpg',
            pid:'',
            id:5,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_boy_2.png',
            title:'To Crates',
            subtitle:'How good!',
            body:'こうして言葉にしてしまうとどこか噓くさい別居の子ども二人孫四人犬猫は飼っていません',
            thumb:'/static/img/covers/p7.jpg',
            pid:'',
            id:6,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_girl_1.png',
            title:'旅と音楽',
            subtitle:'How good!',
            body:'夏はほとんどＴシャツで過ごします私の書く言葉には値段がつくことがあります',
            thumb:'/static/img/covers/p8.jpg',
            pid:'',
            id:7,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_girl_2.png',
            title:'Collin hay',
            subtitle:'v',
            body:'',
            thumb:'/static/img/covers/p9.jpg',
            pid:'',
            id:8,
            type:'friend'
        },
        {
            icon:'/static/img/markers/m_friend_guy_1.png',
            title:'NEW NEW NEW',
            subtitle:'How good!',
            body:'夏はほとんどＴシャツで過ごします私の書く言葉には値段がつくことがあります',
            thumb:'/static/img/covers/p10.jpg',
            pid:'',
            id:9,
            type:'friend'
        }
        ,
        {
            icon:'/static/img/markers/m_friend_woman_1.png',
            title:'NEW NEW NEW',
            subtitle:'Life is new!',
            body:'夏はほとんどＴシャツで過ごします私の書く言葉には値段がつくことがあります',
            thumb:'/static/img/covers/p10.jpg',
            pid:'',
            id:10,
            type:'friend'
        }
    ],

    locations:[
        {
            htmltxt: '千代田区',
            lat: 35.670812,
            lng: 139.754182,
            w:25,
            h:25,
            img: '/static/img/markers/m_friend_boy_1.png'
        }
    ],
}

const mutations = {
    setTracking(state,val){
        if(!!val) {
            state.tracking = val;
        }else{
            state.tracking = !state.tracking;
        }
    },
    setLocations(state,val){
        state.locations = val;
    }
}

export default {
    state,
    mutations
}
