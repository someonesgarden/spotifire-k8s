const loggedIn  = state => state.loggedIn
const rootAction= state => state.rootAction
const bottom    = state => state.bottom
const alert     = state => state.alert
const pwa       = state => state.pwa
const spotify   = modules => modules.spotify
const feed      = modules => modules.feed
const mapstore  = modules => modules.mapstore
const ws        = modules => modules.ws
const mp3       = modules => modules.mp3
const g_three   = modules => modules.three
const genius    = modules => modules.genius

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
    genius
}
