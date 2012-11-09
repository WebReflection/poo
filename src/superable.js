/*!(C) WebReflection */
/**@license Mit Style */
this.superable = function (Function, Object) {
  // IE9+ and all other browsers older than IE8 should be fine
  var
    SUPER = "super",
    bind =
      Function.bind ||
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
    getPrototypeOf =
      Object.getPrototypeOf ||
      function getPrototypeOf(object) {
        return  object.__proto__ ||
                object.constructor.prototype;
      },
    getKeys =
      Object.getOwnPropertyNames ||
      Object.keys ||
      function getKeys(object) {
        var keys = [], k;
        for (k in object)
          hasOwnProperty.call(object, k) &&
          (keys.push(k))
        ;
      },
    hasOwnProperty = Object.hasOwnProperty,
    descriptor = {
      get: function get() {
        "do not use strict";  // I am not kidding
                              // if you want this
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
}(Function, Object);