poo.js
======

Pretending Object Oriented JavaScript
-------------------------------------

The aim of this project is to bring a meaningful, easy to use, performance oriented and lightweight solution for *all JS engines* with an extra, non mandatory, magic able *to bring in all ES5 capable browsers ES6 like syntax*.

The main reason for this is to *avoid coupling tools-chain and build-steps* and make JavaScript projects once again cross browser, platform, and cross environment.


ES6 VS poo.js
-------------

    // ES6 syntax Tomorrow                    // poo.js syntax Today!
    class B extends A {                       var B = cC({ extend: A,
      constructor(some, value) {                constructor: function (some, value) {
        super(some);                              this.super(some);
        this.value = value;                       this.value = value;
      },                                        },
      concat() {                                concat: function () {
        return super() + this.value;              return this.super() + this.value;
      }                                         }
    }                                         });

                      // NOTE: var cC = poo.SuperClass;
                      // as create Class


Not The Usual Wrapper!
----------------------
If you are wondering what's new in `poo.js` here the summary: the most unobtrusive way to add super calls to any object.
`poo.superable(object)` is able to add **a simple getter rather than wrap all functions** and this is the key to do not make all methods invocations slow.
Common frameworks do a lot of magic and could have a lot of undesired side effects because of their super implementation where mixins will break as well as methods with some problem and nested calls.

[I have personally discussed this topic many times](http://webreflection.blogspot.com/2010/01/javascript-super-bullshit.html) but developers seem to be easily amused by the new shiny syntax proposed in ES6 as sugar.
For the very first time and as far as I know, there is a way to do not pay for all that magic except when the magic is actually needed (admit it, you don't really use `super()` that often while extending)


A Future Proof Approach
-----------------------
The main idea behind this project is the ability to drop very few things in order to make the whole code compatible with future engines and drop the library once ES6 is in place. Syntax changes are unfortunately impossible to polyfill runtime so this attempt is the closest one ever.

If you look at the *ES6 VS poo.js* code snippet you'll realize that a regular expression could already make the right side equivalent to the left one:

    // NOTE: not the best way to do this, just an example
    source.replace(
      /(var )([A-Z][^=]+)=|cC\(\{(\s*extend\s*):|:\s*function[^(]*(\()|this.(super)\(/g,
      function (m, v, C, e, f, s) {
        return (v && C ? 'class ' + C: e || f || (s && s + "(") || "");
      }
    );

This does not mean that we should use above example once ES6 is supported, this means that it's really easy to bring poo.js like defined classes into new ES6 syntax and the code will still look similar. Easy refactoring, easy update.


No Wrapper ? How Is That Possible
---------------------------------
The conditions required in order to use `poo.superable()` magic, and please note I haven't talked about the rest of the library but only `superable()` and then `SuperClass()` which does not exclude the universally compatible `Class()`, are these:

  1. the environment is not using "use strict"; directive, which is most likely what's happening already if you use linters and minifiers
  2. the browser supports getters

On point one, this is necessary to retrieve the `caller` and resolve runtime through the instance.
Both context and caller are necessary to make the superable magic work as expected but again, there is no need to wrap anything neither to pass through poo.js to define classes or add superable.

    function A() {
      this.test('Hello!');
    }
    A.prototype.test = function (what) {
      alert(what);
    };

    function B() {
      this.super();
    }
    B.prototype = poo.inherit(A.prototype);
    B.prototype.constructor = B;
    B.prototype.test = function (what) {
      this.super(what);
    };

    poo.superable(B.prototype);

    new B; // will alert Hello!


Not Only Superable
------------------
`poo.inherit(object)` is the most memory efficient way to create an object inheriting from another one. Not a single extra thing is created during this process so the GC is happy.
Together with inherit there is `poo.Class(definition)` too which acts exactly in this way per each key of the object:

  1. if the key is `constructor` use the value as class constructor
  2. if the key is `extend` chain inheritance with this super constructor
  3. if the key is `statics` an object is expected as value. Attach each property to the constructor.
  3. if the key is `shared` attach the object as it is to the prototype
  4. for every other case define the property as:
    1. non configurable, non writable, not enumerable, if this is a method (function)
    2. non configurable, not enumerable if this is any value that is not an object
    3. use the object itself as property descriptor, so it's still possible to define getters and setters if necessary.

The ambiguity is dropped thanks to the `shared` property which is the only one allowed to be shared through the prototype between instances.
This is a good compromise to avoid descriptors all over and all defaults behaviors are meant where methods cannot be changed runtime and properties cannot change value ( closer to statically typed, easier to optimize engines speaking )


Tests with 100% Code Coverage
-----------------------------
you can `node test/superable.js` or `node test/Class.js` or you can open the browser pointing to `web.html` and see that all tests are passing.
Inheritance is tested more than 2 levels together with `this.super()` calls and this is, in my opinion, awesome.
If you are worried about the fact `"use strict";` is not allowed, I tell you there's no way to obtain this same magic behavior otherwise unless through wrappers, a no-go, or writing explicitly the `SuperConstructpr.prototype.currentMethod.call(this, arg1, argN)` instead: the fastest way, the most boring one too.





