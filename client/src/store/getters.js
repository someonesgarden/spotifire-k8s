const loggedIn  = state => state.loggedIn
const rootAction= state => state.rootAction
const bottom    = state => state.bottom
const alert     = state => state.alert
const device    = state => state.device
const header    = state => state.header
const home      = state => state.home

const spotify   = modules => modules.spotify
const feed      = modules => modules.feed
const mapstore  = modules => modules.mapstore
const ws        = modules => modules.ws
const mp3       = modules => modules.mp3
const genius    = modules => modules.genius
const modal     = modules => modules.modal
const side      = modules => modules.side
const pwa       = modules => modules.pwa
const subscribe = modules => modules.subscribe
const wp        = modules => modules.wp
const weather   = modules => modules.weather
// const g_three   = modules => modules.three

export {
    rootAction,
    loggedIn,
    bottom,
    spotify,
    feed,
    mapstore,
    ws,
    mp3,
    alert,
    pwa,
    genius,
    modal,
    side,
    device,
    header,
    home,
    subscribe,
    wp,
    weather
    //g_three,
}
