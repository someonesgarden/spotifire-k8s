'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  test:'345',
  MAPBOX_TOKEN:JSON.stringify(process.env.MAPBOX_TOKEN)
})

