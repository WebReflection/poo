/*!(C) WebReflection */
/**@license Mit Style */
function SuperClass(descriptor) {
  return superable(
    Class(descriptor).prototype
  ).constructor;
}
var
  Class = this.Class = require("./class").Class,
  inherit = this.inherit = require("./inherit").inherit,
  superable = this.superable = require("./superable").superable
;
this.SuperClass = SuperClass;