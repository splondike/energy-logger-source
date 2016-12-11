module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'build/*.html',
    'build/manifest.json',
    'build/static/**/!(*map*)',
    'build/pouchdb-6.0.7.min.js'
  ],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  navigateFallback: 'index.html',
  swFilePath: 'build/service-worker.js',
  importScripts: [
     'pouchdb-6.0.7.min.js',
     'syncPouch.js'
  ]
};
