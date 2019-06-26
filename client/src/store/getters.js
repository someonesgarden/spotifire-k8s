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
const g_three   = modules => modules.three
const genius    = modules => modules.genius
const modal     = modules => modules.modal
const pwa       = modules => modules.pwa


export {
    rootAction,
    loggedIn,
    bottom,
    spotify,
    feed,
    mapstore,
    ws,
    mp3,
    g_three,
    alert,
    pwa,
    genius,
    modal,
    device,
    header,
    home
}
