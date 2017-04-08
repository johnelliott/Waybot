function killerWindowAttacher() {
    var killall = function dbKiller () {
      db.allDocs({include_docs: false, descending: true}, function(err, doc) {
        if (err) {
          console.error(err);
          return err;
        }
        var mapResults = doc.rows.map(function(doc) {
          db.get('mydoc').then(function (doc) {
            console.log('removing ' + doc);
            return db.remove(doc);
          });
        });
        console.log('map results', mapResults);
      });
    }
    window.killall = killall;
    return killall;
}();
