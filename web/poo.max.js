/*!(C) WebReflection *//** @license Mit Style */
this.poo = function(Object){
  var
    CONSTRUCTOR = "constructor",
    EXTEND = "extend",
    GET = "get",
    PROTOTYPE = "prototype",
    SET = "set",
    STATICS = "statics",
    SUPER = "super",
    VALUE = "value",
    bind =
      Object.bind ||
      function (self) {
        var cb = this;
        return function() {
          return cb.apply(self, arguments);
        };
      }
    ,
    defineProperty =
      Object.defineProperty ||
      function defineProperty(object, key, descriptor) {
        has(descriptor, VALUE) && (object[key] = descriptor[VALUE]);
        has(descriptor, GET) && object.__defineGetter__(key, descriptor[GET]);
        has(descriptor, SET) && object.__defineSetter__(key, descriptor[SET]);
        return object;
      },
    defineProperties =
      Object.defineProperties ||
      function (object, descriptor) {
        for (var key in descriptor) {
          has(descriptor, key) && defineProperty(object, key, descriptor[key]);
        }
        return object;
      },
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
    },
    getKeys =
      Object.getOwnPropertyNames ||
      Object.keys ||
      function getKeys(object) {
        var keys = [], key;
        for (key in object)
          has(object, key) && keys.push(key);
        ;
        return keys;
      },
    getPrototypeOf =
      Object.getPrototypeOf ||
      function getPrototypeOf(object) {
        return  object.__proto__ ||
                object[CONSTRUCTOR][PROTOTYPE];
      },
    hasOwnProperty = Object[PROTOTYPE].hasOwnProperty,
    inherit =
      Object.create ||
      function inherit(object) {
        return inherit[PROTOTYPE] === object ?
          (inherit[PROTOTYPE] = inherit) && this :
          new inherit(inherit[PROTOTYPE] = object)
        ;
      }
  ;
  function addStatics(constructor, statics) {
    for (var key in statics)
      has(statics, key) && (constructor[key] = statics[key])
    ;
  }
  function frozenValue(value) {
    return {
      writable: false,
      configurable: false,
      enumerable: false,
      value: value
    };
  }
  function has(object, key) {
    return hasOwnProperty.call(object, key);
  }
  function superable(object) {
    return hasOwnProperty.call(object, SUPER) ?
      object : defineProperty(object, SUPER, descriptor)
    ;
  }
  function Class(descriptor) {
    var proto = {},
        constructor, key, tmp, rd;
    for(key in descriptor) {
      if (has(descriptor, key)) {
        tmp = descriptor[key];
        switch(key) {
          case EXTEND:
          case STATICS:
            break;
          case CONSTRUCTOR:
            constructor = tmp;
          default:
            switch(typeof tmp) {
              case "function":
                proto[key] = frozenValue(tmp);
                break;
              case "object":
                if (key !== "shared") {
                  rd = {};
                  for (key in tmp) {
                    has(tmp, key) && (rd[key] = tmp[key]);
                  }
                  proto[key] = rd;
                  break;
                }
              default:
                proto[key] = {
                  writable: true,
                  configurable: false,
                  enumerable: false,
                  value: tmp
                };
            }
        }
      }
    }
    if (!constructor) {
      constructor = function Class(){};
      proto[CONSTRUCTOR] = frozenValue(constructor);
    }
    has(descriptor, EXTEND) && (constructor[PROTOTYPE] = inherit(
      typeof descriptor[EXTEND] === "function" ?
      descriptor[EXTEND][PROTOTYPE] : descriptor[EXTEND]
    ));
    has(descriptor, STATICS) && addStatics(
      constructor, descriptor[STATICS]
    );
    return defineProperties(
      constructor[PROTOTYPE], proto
    )[CONSTRUCTOR];
  }
  return {
    inherit: inherit,
    superable: superable,
    Class: Class,
    SuperClass: function SuperClass(descriptor) {
      return superable(
        Class(descriptor)[PROTOTYPE]
      )[CONSTRUCTOR];
    }
  };
}(Object);