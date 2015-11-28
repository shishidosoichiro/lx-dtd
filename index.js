var Lexer = require('lx');
var state = Lexer.state;
var back = Lexer.back;
var shift = Lexer.shift;
var token = Lexer.token;
var push = Lexer.push;
var noop = Lexer.noop;
var raise = Lexer.raise;

var tokenize = (function(){
  var doctype = Lexer()
  var node = Lexer()
  var element = Lexer()
  element.arg = Lexer()
  element.arg.category = Lexer()
  element.arg.content = Lexer()
  element.end = Lexer()
  var attribute = Lexer()
  var arg = Lexer()

  doctype
  .match(/<\!DOCTYPE\s+([\w\.\:\-]+)\s+\[/, shift, token('DOCTYPE'), push, state(node))
  .match(/\s+/, noop)
  .other(raise('unexpected statement.'))


  node
//  .match(/<\!(ELEMENT)\s+/, shift, token('ELEMENT'), push, state(element))
//  .match(/<\!(ATTRIBUTE)\s+/, shift, token('ATTRIBUTE'), push, state(attribute))
  .match(/\]>/, token('DOCTYPE.END'), push, back)
  .match(/\s+/, noop)
  .other(raise('unexpected node declare.'))

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
