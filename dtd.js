/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["dtd"] = __webpack_require__(1);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Lexer = __webpack_require__(2);
	var state = Lexer.state;
	var back = Lexer.back;
	var shift = Lexer.shift;
	var token = function(name){
	  var token = Lexer.token(name);
	  return function(){
	    var t = token.apply(this, arguments);
	    Lexer.push.call(this, t);
	  }
	};
	var noop = Lexer.noop;
	var raise = Lexer.raise;

	var tokenize = (function(){
	  var doctype = Lexer()
	  var node = Lexer()
	  var element = Lexer()
	  element.content = Lexer()
	  element.content.suffix = Lexer()
	  element.content.delmmiter = Lexer()
	  var attlist = Lexer()
	  attlist.type = Lexer()
	  attlist.type.list = Lexer()
	  attlist.type.list.defaultValue = Lexer()
	  attlist.value = Lexer()
	  attlist.value.literal = Lexer()

	  doctype
	  .match(/<\!DOCTYPE\s+([\w\.\:\-]+)\s+\[/, shift, token('DOCTYPE'), state(node))
	  .match(/\s+/, noop)
	  .other(raise('unexpected declaration.'))

	  node
	  .match(/<\!ELEMENT\s+([\w\.\:\-]+)\s+/, shift, token('ELEMENT'), state(element))
	  .match(/<\!ATTLIST\s+([\w\.\:\-]+)\s+/, shift, token('ATTLIST'), state(attlist))
	  .match(/\]>/, token('DOCTYPE.END'), back)
	  .match(/\s+/, noop)
	  .other(raise('unexpected statement.'))

	  element
	  .match(/^(EMPTY|ANY)\s*>/, shift, token('ELEMENT.CATEGORY'), back)  
	  .match(/^\(/, token('ELEMENT.CONTENT'), state(element.content))
	  .match(/^\s+/, noop)
	  .other(raise('invalid element difinition.'))

	  element.content
	  .match(/^([\w\.\:\-]+)/, shift, token('ELEMENT.CONTENT.CHILD'), state(element.content.suffix))  
	  .match(/^(\#PCDATA)/, shift, token('ELEMENT.CONTENT.PCDATA'), state(element.content.delmmiter))
	  .match(/^\(/, token('ELEMENT.CONTENT'), state(element.content))
	  .match(/^\s+/, noop)
	  .other(raise('invalid element-content difinition.'))

	  element.content.suffix
	  .match(/^\+/, token('ELEMENT.CONTENT.MIN-ONE-OCCURENCE'), back, state(element.content.delmmiter))  
	  .match(/^\*/, token('ELEMENT.CONTENT.ZERO-OR-MORE-OCCURENCE'), back, state(element.content.delmmiter))  
	  .match(/^\?/, token('ELEMENT.CONTENT.ZERO-OR-ONE-OCCURENCE'), back, state(element.content.delmmiter))  
	  .match(/^(?=[\,\|\)]|\s*>)/, back, state(element.content.delmmiter))
	  .match(/^\s+/, noop)
	  .other(raise('invalid element-content suffix difinition.'))

	  element.content.delmmiter
	  .match(/^\,/, token('ELEMENT.CONTENT.SEQUENCE'), back)  
	  .match(/^\|/, token('ELEMENT.CONTENT.OR'), back)
	  .match(/^\)/, token('ELEMENT.CONTENT.CLOSE'), back, back, state(element.content.suffix))
	  .match(/^\s*>/, token('ELEMENT.END'), back, back, state(node))  
	  .match(/^\s+/, noop)
	  .other(raise('invalid element-content delmmiter difinition.'))

	  attlist
	  .match(/([\w\.\:\-]+)\s+/, shift, token('ATTR.NAME'), state(attlist.type))
	  .match(/^\s*>/, token('ATTLIST.END'), back)
	  .other(raise('invalid attribute name difinition.'))

	  attlist.type
	  .match(/^(CDATA|ID|IDREF|IDREFS|NMTOKEN|NMTOKENS|ENTITY|ENTITIES|NOTATION|xml\:)\s+/, shift, token('ATTR.TYPE'), back, state(attlist.value))
	  .match(/^\(/, shift, token('ATTR.TYPE.LIST'), back, state(attlist.type.list))
	  .other(raise('invalid attribute type difinition.'))

	  attlist.type.list
	  .match(/^([^\|\)]*?)\|/, shift, token('ATTR.TYPE.LIST.VALUE'))
	  .match(/^([^\|\)]*?)\)\s+\"/, shift, token('ATTR.TYPE.LIST.VALUE.END'), back, state(attlist.type.list.defaultValue))
	  .other(raise('invalid attribute type enumerated values difinition.'))

	  attlist.type.list.defaultValue
	  .match(/^([^\"]*?)\"/, shift, token('ATTR.TYPE.LIST.DEFAULT'), back)

	  attlist.value
	  .match(/^(\#REQUIRED|\#IMPLIED)\s+/, shift, token('ATTR.VALUE'), back)
	  .match(/^(\#FIXED)\s+\"/, shift, token('ATTR.VALUE'), back, state(attlist.value.literal))
	  .match(/^\"/, back, state(attlist.value.literal))
	  .other(raise('invalid attribute value difinition.'))

	  attlist.value.literal
	  .match(/^([^\"]*?)\"/, shift, token('ATTR.VALUE.LITERAL'), back)

	  return function(string){
	    var context = {tokens: []};
	    doctype(string, context);
	    return context.tokens;
	  }
	})();

	// convert tokens to vdom;
	var build = function(tokens){
		return tokens;
	  var stack = [];
	  var top = {attrs: {}, children: []};
	  var current = top;
	  var attr;
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i];        
	  }
	  return top.children;
	};

	module.exports = function(string){
	  var tokens = tokenize(string);
	  return build(tokens);
	};
	module.exports.tokenize = tokenize;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3);
	var Store = __webpack_require__(4);

	var defaults = {
	  flags: 'mg'
	};

	var Lexer = module.exports = function(options){
	  options = options || {};
	  _.inherits(options, defaults);
	  var app = function(string, context){
	    context = context || {};
	    context.state = app;
	    context.index = 0;
	    context.stack = [];
	    while (string != ''){
	      string = context.state.lex.call(context, string);
	    }
	  };

	  var store = Store(options);

	  var defined = function(arg){
	    return arg != undefined;
	  };
	  var get = function(matched){
	    var position = _.findIndex(matched.slice(1), defined) + 1;
	    return store.get(position);
	  } 

	  app.match = function(regex){
	    var position = store.last.position + store.last.count;
	    var src = _.source(regex);

	    var rule = {
	      source: src,
	      action: _.flow(_.slice(arguments, 1)),
	      count: _.captureCount(src) + 1,
	      position: position
	    }
	    store.put(position, rule);
	    return app;
	  };
	  var other = _.noop;
	  app.other = function(){
	    other = _.flow(_.slice(arguments));
	    return app;
	  };
	  app.lex = function(string){
	    if (store.last.position === 0) {
	      other.call(this, string, this.index);
	      return '';
	    }
	    var matched = store.regex.call(this).exec(string);
	    if (!matched) {
	      other.call(this, string, this.index);
	      return '';
	    }

	    var rule = get(matched);
	    var index = matched.index;

	    // unmatchd part
	    if (matched.index > 0) other.call(this, string.substring(0, matched.index));

	    // matched part
	    this.index += matched.index;
	    var captured = matched.slice(rule.position, rule.position + rule.count);
	    rule.action.apply(this, captured);

	    this.index += matched[0].length;
	    return string.substr(matched.index + matched[0].length);
	  }
	  return app;
	};
	Lexer.noop = _.noop;
	Lexer.shift = _.shift;
	Lexer.flow = _.flow;
	Lexer.state = function(state){
	  return function(){
	    this.stack.push(this.state);
	    this.state = state;
	  }
	}; 
	Lexer.back = function(){
	  this.state = this.stack.pop();
	};
	var toString = function(){
	  return this.name + '(' + this.index + (typeof this.value === 'undefined' ? '' : ':' + this.value) + ')';
	}
	Lexer.token = function(name){
	  return function(value){
	    return {name: name, value: value, index: this.index, toString: toString};
	  }
	};
	Lexer.push = function(token){
	  this.tokens.push(token)
	};
	Lexer.raise = function(message){
	  return function(arg){
	    var error = new Error(message)
	    error.arg = arg
	    throw error;
	  };
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	var _ = module.exports = {
	  noop: function(arg){
	  	return arg
	  },
	  slice: function(array, begin, end){
	    return Array.prototype.slice.call(array, begin, end);
	  },
	  array: function(value){
	    return value instanceof Array ? value : [value];
	  },
	  functionalize: function(src){
	    return typeof src === 'function' ? src : function(){return src};
	  },
	  shift: function(){
	    return _.slice(arguments, 1);
	  },
	  flow: function(functions){
	    if (arguments.length > 1 && !(functions instanceof Array)) functions = _.slice(arguments);
	    functions = functions.map(_.functionalize);
	    return function(){
	      var that = this
	      return functions.reduce(function(args, f){
	        return f.apply(that, _.array(args))
	      }, _.slice(arguments))
	    }
	  },
	  findIndex: function(array, callback, value){
	    var index;
	    var found;
	    if (typeof callback === 'function') {
	      found = array.some(function(el, i){
	        index = i;
	        return callback.apply(this, arguments)
	      })
	    }
	    else if (typeof callback === 'undefined') {
	      found = array.some(function(el, i){
	        index = i;
	        return el
	      })
	    }
	    else if (typeof callback === 'string') {
	      found = array.some(function(el, i){
	        index = i;
	        return el[callback] == value
	      })
	    }
	    return found ? index : undefined;
	  },
	  captureCount: function(src){
	    return new RegExp('(?:' + _.source(src) + '|(any))').exec('any').length - 2;
	  },
	  source: function(regex){
	    if (typeof regex === 'undefined') return '';
	    else if (typeof regex === 'string') return regex;
	    else if (typeof regex !== 'object') return regex;
	    else if (regex instanceof RegExp) return regex.source;
	    else return regex.toString();
	  },
	  call: function(src){
	    if (typeof src === 'function') return src.call(this);
	    return src;
	  },
	  inherits: function(target, parent){
	    for (var i in parent) {
	      target[i] = parent[i];
	    }
	  },
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3);

	var defaults = {
	  flags: 'mg'
	};

	module.exports = function(options){
	  options = options || {};
	  _.inherits(options, defaults);
	  var sources = [];
	  var map = {};
	  var wrap = function(src){
	    return '(' + _.call.call(this, src) + ')';
	  }

	  var store = {
	    sources: sources,
	    last: {position: 0, count: 1},
	    get: function(key){
	      return map[key];
	    },
	    put: function(key, rule){
	      map[key] = rule;
	      sources.push(rule.source)
	      this.last = rule;
	    },
	    regex: function(){
	      var source = '(?:' + store.sources.map(wrap, this).join('|') + ')';
	      return new RegExp(source, options.flags);
	    }
	  }
	  return store;
	}



/***/ }
/******/ ]);