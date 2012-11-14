/*!(C) WebReflection *//** @license Mit Style */
this.inherit = Object.create || function inherit(object) {
  return inherit.prototype === object ?
    (inherit.prototype = inherit) && this :
    new inherit(inherit.prototype = object)
  ;
};