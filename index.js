var tokenize = require('./lib/tokenize');

// convert tokens to vdom;
var build = function(tokens){
	return tokens;
  /*
  var stack = [];
  var top = {attrs: {}, children: []};
  var current = top;
  var attr;
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];        
  }
  return top.children;
  */
};

module.exports = function(string){
  var tokens = tokenize(string);
  return build(tokens);
};
module.exports.tokenize = tokenize;
