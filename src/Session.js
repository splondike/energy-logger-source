let db = {};

export function get(name, defaultValue) {
   if (db[name]) {
      let result = db[name];
      if (result.flash) {
         delete result[name];
      }
      return result.value;
   } else {
      return defaultValue;
   }
};

export function set(name, value) {
   db[name] = {
      "value": value,
      "flash": false
   };
};

export function flash(name, value) {
   db[name] = {
      "value": value,
      "flash": true
   };
};
