/*!(C) WebReflection */
/**@license Mit Style */
this.Class = function () {
  // this should be compatible with every JS engine
  var
    inherit = require("./inherit").inherit,
    CONSTRUCTOR = "constructor",
    EXTEND = "extend",
    STATICS = "statics",
    defineProperties = Object.defineProperties || function (object, descriptor) {
      var key, tmp;
      for (key in descriptor) {
        if (has(descriptor, key)) {
          tmp = descriptor[key];
          // don't care much, if works with standard browsers
          // should work with fallbacks too
          has(tmp, "value") && (object[key] = tmp.value);
          has(tmp, "get") && object.__defineGetter__(key, tmp.get);
          has(tmp, "set") && object.__defineSetter__(key, tmp.set);
        }
      }
      return object;
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
    return object.hasOwnProperty(key);
  }
  return function Class(descriptor) {
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
                // constructor and methods
                proto[key] = frozenValue(tmp);
                break;
              case "object":
                if (key !== "shared") {
                  // assuming ES5 descriptor
                  rd = {};
                  for (key in tmp) {
                    if (tmp.hasOwnProperty(key)) {
                      rd[key] = tmp[key];
                    }
                  }
                  proto[key] = rd;
                  break;
                }
              default:
                // scalar values or defaults
                // plus the shared property
                // fixed type
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
    has(descriptor, EXTEND) && (constructor.prototype = inherit(
      typeof descriptor[EXTEND] === "function" ?
      descriptor[EXTEND].prototype : descriptor[EXTEND]
    ));
    has(descriptor, STATICS) && addStatics(
      constructor, descriptor[STATICS]
    );
    return defineProperties(
      constructor.prototype, proto
    )[CONSTRUCTOR];
  };
}();