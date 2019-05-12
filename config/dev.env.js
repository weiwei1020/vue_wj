'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL: '"http://192.168.0.2:8080"',
  BASE_URL: '"http://172.20.10.12:8080"',
  // BASE_URL: '"http://192.168.43.248:8080"',
})

