(function(modules){
    function require (id) {
      const [fn, mapping] = modules[id];

      function localRequire(name) {
        return require(mapping[name]);
      }

      let module = {
        exports: {},
        loaded: false
      };

      fn(module, module.exports, localRequire);
      
      module.loaded = true;

      return module.exports
    }
  
    require(0)
  })({0: [
      function (module, exports, require) {
        "use strict";

var _bob = require("./bob.js");

var _bob2 = _interopRequireDefault(_bob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_bob2.default);
      },
      {"./bob.js":1}
    ],
    1: [
      function (module, exports, require) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _house = require("./house.js");

exports.default = "bob has " + _house.house;
      },
      {"./house.js":2}
    ],
    2: [
      function (module, exports, require) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.house = undefined;

var _desks = require("./desks.js");

var _desks2 = _interopRequireDefault(_desks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var house = exports.house = 'a big and beautiful house.' + _desks2.default;
      },
      {"./desks.js":3}
    ],
    3: [
      function (module, exports, require) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var desks = 'a lot of desks.';
exports.default = desks;
      },
      {}
    ],
    });