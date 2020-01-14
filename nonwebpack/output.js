
   (function(modules){
     function require(id){
       const [fn,mapping] = modules[id];
       function localRequire(relativePath){
         return require(mapping[relativePath])
       }
       const module={exports:{}}
       fn(localRequire,module,module.exports)
       return module.exports
     }
     require(0)
   })({0:[
      function(require,module,exports){
        "use strict";

var _message = _interopRequireDefault(require("./message.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_message["default"]);
      },
      {"./message.js":1}
    ],1:[
      function(require,module,exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _name = require("./name.js");

var _my = require("./my.js");

var _default = "Hello ".concat(_my.my, " ").concat(_name.name, " ");

exports["default"] = _default;
      },
      {"./name.js":2,"./my.js":3}
    ],2:[
      function(require,module,exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
var name = 'fun';
exports.name = name;
      },
      {}
    ],3:[
      function(require,module,exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.my = void 0;

var _name = require("./name.js");

console.log(_name.name);
var my = 'zoro';
exports.my = my;
      },
      {"./name.js":4}
    ],4:[
      function(require,module,exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
var name = 'fun';
exports.name = name;
      },
      {}
    ],})
   