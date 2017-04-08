var PouchDB = require('pouchdb')
var state = require('./state.js')
var db = new PouchDB('hits')
// TODO such bad, very hack....? YES document.url KILLED AN HOUR OF MY TIME
var remoteHost = document.URL + 'api'
var remoteCouch = new PouchDB(remoteHost)
PouchDB.debug.enable('*')
// PouchDB stuff
db.changes({
    since: 'now',
    live: true
}).on('change', fetchDocs)

// Local data store methods
function sync () {
    console.log('syncing')
    var opts = {live: true}
    db.replicate.from(remoteCouch, opts, function syncErrorLogger (err) {
      console.log('syncing error ' + err)
    })
}
function fetchDocs() {
    db.allDocs({include_docs: true, descending: true}, function allDocsCB(err, doc) {
        if (err) {
          console.error(err)
          return err
        }
        console.log('db:docs', doc)
        doc.rows.forEach(row=>{
          console.log('dispatching', row.doc)
          //TODO this is just temp because safari sucks...
          state.store.dispatch(state.addCounter(row.doc))
          state.store.dispatch(state.addHit(row.doc))
        })
    })
}

// Init
sync()
fetchDocs()
