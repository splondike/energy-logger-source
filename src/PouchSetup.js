import PouchDB from 'pouchdb';

const timeOrderVersion = 1;
const timeOrder = {
   _id: '_design/time_order',
   version: timeOrderVersion,
   views: {
      by_time: {
         map: `function(doc) {
            emit(doc.fieldValues.timestamp);
         }`
      }
   }
};

class DBLayer {
   constructor(db, storage) {
      this.db = db;
      this.oldSync = null;
      this.listeners = new WeakMap();
      this.storage = storage;

      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      this.get = this.get.bind(this);
      this.getLatest = this.getLatest.bind(this);
      this.getSyncUrl = this.getSyncUrl.bind(this);
      this.setSyncUrl = this.setSyncUrl.bind(this);
      this.registerUpdateListener = this.registerUpdateListener.bind(this);
      this.unregisterUpdateListener = this.unregisterUpdateListener.bind(this);
   }

   create(doc) {
      return this.db.post(doc);
   }

   update(doc) {
      return this.db.put(doc);
   }

   get(id) {
      return this.db.get(id)
   }

   remove(id) {
      return this.db.remove(id)
   }

   getLatest(limit) {
      return this.db.query(
         'time_order/by_time',
         {
            'include_docs': true,
            'limit': limit,
            'descending': true
         }
      );
   }

   getSyncUrl() {
      return this.storage.get('syncUrl');
   }

   setSyncUrl(url) {
      this.storage.set('syncUrl', url);
      if (this.oldSync) {
         this.oldSync.cancel();
      }

      if (url !== null) {
         this.oldSync = this.db.sync(url, {
            'live': true,
            'retry': true
         });
      }
   }

   registerUpdateListener(f) {
      let canceller = this.db.changes({
        since: 'now',
        live: true
      }).on('change', f);
      this.listeners.set(f, canceller);
   }

   unregisterUpdateListener(f) {
      let rtn = this.listeners.get(f);
      if (typeof rtn !== 'undefined') {
         rtn.cancel();
      }
   }
}

async function buildDBLayer() {
   let db = new PouchDB('log');
   let currVersion = 0;
   try {
      let currTimeDoc = await db.get('_design/time_order');
      currVersion = currTimeDoc.version;
   } catch (err) {
   }
   if (currVersion !== timeOrderVersion) {
      await db.put(timeOrder);
   }

   let storage = {
      get: function (key) {
         return window.localStorage.getItem(key);
      },
      set: function (key, value) {
         return window.localStorage.setItem(key, value);
      }
   }

   let rtn = new DBLayer(db, storage);
   rtn.setSyncUrl(rtn.getSyncUrl());
   return rtn;
}

export default buildDBLayer;
