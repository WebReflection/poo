/*!(C) WebReflection *//** @license Mit Style */
this.superable = function (Object) {
  // IE9+ and all other browsers older than IE8 should be fine
  var
    SUPER = "super",
    bind =
      Object.bind ||
      function (self) {
        var cb = this;
        return function() {
          return cb.apply(self, arguments);
        };
      },
    defineProperty =
      Object.defineProperty ||
      function defineProperty(object, k, d) {
        object.__defineGetter__(k, d.get);
        return object;
      },
    getKeys =
      Object.getOwnPropertyNames ||
      Object.keys ||
      function getKeys(object) {
        var keys = [], key;
        for (key in object)
          hasOwnProperty.call(object, key) && keys.push(key);
        ;
        return keys;
      },
    getPrototypeOf =
      Object.getPrototypeOf ||
      function getPrototypeOf(object) {
        return  object.__proto__ ||
                object.constructor.prototype;
      },
    hasOwnProperty = Object.hasOwnProperty,
    descriptor = {
      get: function get() {
        "no strict";  // I am not kidding
                      // if you want this without parsing
                      // drop all "use strict";
        var
          caller = get.caller,
          proto = this,
          i, key, keys, parent
        ;
        while (proto = getPrototypeOf(proto)) {
          keys = getKeys(proto);
          i = keys.length;
          while (i--) {
            if (proto[key = keys[i]] === caller) {
              do {
                parent = getPrototypeOf(proto);
                proto = parent;
              } while (parent[key] === caller);
              return bind.call(parent[key], this);
            }
          }
        }
      }
    }
  ;
  return function superable(object) {
    return hasOwnProperty.call(object, SUPER) ?
      object : defineProperty(object, SUPER, descriptor)
    ;
  };
}(Object);