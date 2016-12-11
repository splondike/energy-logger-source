// import PouchDB from 'pouchdb';
const PouchDB = window.PouchDB;
const pouchDBName = 'log';
const serviceWorker = window.serviceWorkerRego;

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
      this._scheduleRemoteSync = this._scheduleRemoteSync.bind(this);
      this.registerUpdateListener = this.registerUpdateListener.bind(this);
      this.unregisterUpdateListener = this.unregisterUpdateListener.bind(this);
   }

   create(doc) {
      return this.db.post(doc).then(this._scheduleRemoteSync);
   }

   update(doc) {
      return this.db.put(doc).then(this._scheduleRemoteSync);
   }

   get(id) {
      return this.db.get(id)
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
         this.oldSync = this.db.replicate.from(url, {
            'live': true,
            'retry': true
         });
      }
   }

   _scheduleRemoteSync() {
      let syncURL = this.getSyncUrl();
      if (syncURL) {
         window.serviceWorkerRego.then(function(swRegistration) {
            let eventName = "syncPouch\t" + pouchDBName + "\t" + syncURL;
            return swRegistration.sync.register(eventName);
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
   let db = new PouchDB(pouchDBName);
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
