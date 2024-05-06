const _import = require('../import.' + process.env.NODE_ENV)
export const gisIndex = [
  {
    path: '/gis/index',
    name: 'GisIndex',
    component: _import('gis/index'),
    meta: {
      ref: 'gisIndex',
      methods: ['get_gis_config'],
      keepAlive: true
    }
  },
  {
    path: '/gis/config',
    name: 'GisConfig',
    component: _import('gis/config'),
    meta: {
      ref: 'gisConfig',
      methods: ['get_gis_config'],
      keepAlive: true
    }
  }
]
