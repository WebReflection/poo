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
  function constructor() {
    function Constructor() {}
    var Class = cC({
      constructor: Constructor
    });
    wru.assert("right constructor",
              (new Class).constructor === Constructor);

    wru.assert("named fn expression too",
      (new(cC({
        constructor: function Other() {}
      }))).constructor.name === "Other"
    );

    wru.assert("anonymous fn expression too",
      (new(cC({
        constructor: function() {}
      }))).constructor.name === ""
    );
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
      wru.assert("a.constructor", a.constructor === A);

      wru.assert("b instanceof A", b instanceof A);
      wru.assert("b instanceof B", b instanceof B);
      wru.assert("b not instanceof C", !(b instanceof C));
      wru.assert("b.constructor", b.constructor === B);

      wru.assert("c instanceof A", c instanceof A);
      wru.assert("c instanceof B", c instanceof B);
      wru.assert("c instanceof C", c instanceof C);
      wru.assert("c.constructor", c.constructor === C);
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
  },
  {
    name: "shared",
    test: function () {
      var
        o = {},
        S = cC({
          shared: o
        }),
        a = new S,
        b = new S
      ;
      wru.assert("shared set", a.shared === o);
      wru.assert("same property", a.shared === b.shared);
    }
  }
].concat(function (moar) {
  try {
    var o = {};
    Object.defineProperty(o, "o", {value:o});
    o.o = 123;
    if (o.o === 123) throw o;
    moar.push({
      name: "methods cannot be changed runtime",
      test: function () {
        function method() {
          return 123;
        }
        function different() {}
        var st = new (cC({
          method: method
        }));
        wru.assert("right method", st.method === method);
        st.constructor.prototype.method = different;
        wru.assert("still the same method", st.method === method);
        Object.defineProperty(st, "method", {value: different});
        wru.assert( "if necessary, instances can have reassigned method",
                    st.method === different);
      }
    },
    {
      name: "constructor behaves like methods",
      test: function () {
        function constructor() {
          return 123;
        }
        function different() {}
        var st = new (cC({
          constructor: constructor
        }));
        wru.assert("right method", st.constructor === constructor);
        st.constructor.prototype.constructor = different;
        wru.assert("still the same method", st.constructor === constructor);
        Object.defineProperty(st, "constructor", {value: different});
        wru.assert( "if necessary, instances can have reassigned method",
                    st.constructor === different);
      }
    });
  } catch(o) {}
  return moar;
}([])));