var
  wru = require('../wru'),
  poo = require('../src/poo'),
  superable = poo.superable,
  cC = poo.SuperClass
;
wru.test([
  {
    name: "passing arguments",
    test: function () {

      function A(name) {
        this.name = name;
      }

      var B = cC({
        extend: A,
        constructor: function B(name, age) {
          this.super(name);
          this.age = age;
        }
      });

      var me = new B("Andrea", 34);
      wru.assert(
        "all properties are OK",
        me.name === "Andrea" &&
        me.age === 34
      );
      wru.assert(B.name === "B");
    }
  },
  {
    name: "all the objects",
    test: function () {
      superable(Object.prototype);
      var results = [];
      function A(){}
      A.prototype.hello = function () {
        results.push("hello from A");
      };
      A.prototype.sayWhat = function () {
        results.push("I said hello from A");
      };

      function B(){}
      (B.prototype = new A).constructor = B;
      B.prototype.hello = function () {
        this.super();
        results.push("hello from B");
      };

      function C(){}
      (C.prototype = new B).constructor = C;
      C.prototype.hello = function () {
        this.super();
        results.push("hello from C");
      };
      C.prototype.sayWhat = function () {
        this.super();
        results.push("I said hello from C");
      };

      function D(){}
      (D.prototype = new C).constructor = D;
      D.prototype.hello = function () {
        this.super();
        results.push("hello from D");
      };

      (new D).hello();
      (new D).sayWhat();

      wru.assert("all executed", results.length === 6);
      wru.assert("in the right order",
        results.shift() === "hello from A" &&
        results.shift() === "hello from B" &&
        results.shift() === "hello from C" &&
        results.shift() === "hello from D" &&
        results.shift() === "I said hello from A" &&
        results.shift() === "I said hello from C"
      );
    }
  }
]);