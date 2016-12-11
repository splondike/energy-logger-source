self.addEventListener('sync', function(e) {
   if (e.tag.indexOf("syncPouch\t") === 0) {
      var p = new Promise(function(resolve, reject) {
         var bits = e.tag.split("\t");
         var db = new PouchDB(bits[1]);
         db.replicate.to(bits[2]).on("complete", function() {
            resolve();
         }).on("error", function(err) {
            reject(err);
         });
      });
      e.waitUntil(p);
   }
});
