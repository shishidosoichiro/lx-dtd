var Lexer = require('lx');
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
  attlist.value = Lexer()

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

  attlist.type
  .match(/([\w\.\:\-]+)\s+/, shift, token('ATTR.NAME'), state(attlist.value))

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
