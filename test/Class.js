var
  wru = require('../wru'),
  poo = require('../src/poo'),
  cC = poo.Class
;
wru.test([
  {
    name: "instanceof",
    test: function () {
      var Base = cC({
        constructor: function () {
          ++i;
        }
      });
      var i = 0;
      var b = new Base;
      wru.assert("initialized", i === 1);
      wru.assert("instanceof", b instanceof Base);
      wru.assert("constructor", b.constructor === Base);
    }
  },
  {
    name: "extend",
    test: function () {

      var A = cC({});

      var B = cC({
        extend: A
      });

      var C = cC({
        extend: B.prototype
      });

      var a = new A;
      var b = new B;
      var c = new C;

      wru.assert("B extends A", b instanceof A);
      wru.assert("C extends A", c instanceof A);
      wru.assert("C extends B", c instanceof B);

      wru.assert("a instanceof A", a instanceof A);
      wru.assert("a not instanceof B", !(a instanceof B));
      wru.assert("a not instanceof C", !(a instanceof C));

      wru.assert("b instanceof A", b instanceof A);
      wru.assert("b instanceof B", b instanceof B);
      wru.assert("b not instanceof C", !(b instanceof C));

      wru.assert("c instanceof A", c instanceof A);
      wru.assert("c instanceof B", c instanceof B);
      wru.assert("c instanceof C", c instanceof C);
    }
  },
  {
    name: "statics",
    test: function () {
      var Statics = cC({
        statics: {
          A: 1,
          B: 2,
          C: 3
        }
      });
      var s = new Statics;
      wru.assert("not inherited", typeof s.statics === "undefined");
      wru.assert("present in the constructor", Statics.A === 1,
                                               Statics.B === 2,
                                               Statics.C === 3);
    }
  }
]);