// convert tokens to dtd;
module.exports = function(tokens){
  var elements = {};
  var element;
  var attrlists = {};
  var attrlist;
  var attr;
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];        
    if (token.name === 'ELEMENT') {
      element = elements[token.value] = {
        name: token.value
      };
    }
    else if (token.name === 'ELEMENT.CATEGORY') {
      element.category = token.value;
    }
    else if (token.name === 'ELEMENT.CONTENT') {
      element.content = token.value;
    }
    else if (token.name === 'ATTLIST') {
      attrlist = attrlists[token.value];
      if (attrlist) continue;
      attrlist = attrlists[token.value] = {
        name: token.value,
        attrs: {}
      }
    }
    else if (token.name === 'ATTR.NAME') {
      attr = {
        name: token.value
      };
      attrlist.attrs[attr.name] = attr;
    }
    else if (token.name === 'ATTR.TYPE') {
      attr.type = token.value;
    }
    else if (token.name === 'ATTR.LIST') {
      attr.type = 'LIST';
      attr.list = [];
    }
    else if (token.name === 'ATTR.TYPE.LIST.VALUE') {
      attr.list.push(token.value);
    }
    else if (token.name === 'ATTR.TYPE.LIST.VALUE.END') {
      attr.list.push(token.value);
    }
    else if (token.name === 'ATTR.TYPE.LIST.VALUE.DEFAULT') {
      attr.defaultValue = token.value;
    }
    else if (token.name === 'ATTR.VALUE') {
      attr.valueType = token.value;
    }
    else if (token.name === 'ATTR.VALUE.LITERAL') {
      attr.defaultValue = token.value;
    }
    else {
      throw new Error('unknown token.');
    }
  }
  return top.children[0];
};

var regex = {
  amp: /\&amp\;/g,
  lt: /\&lt\;/g,
  gt: /\&gt\;/g,
  quot: /\&quot\;/g,
  squot: /\&\#039\;/g
};
var unescape = function(str) {
  return str.replace(regex.amp, '&')
            .replace(regex.lt, '<')
            .replace(regex.gt, '>')
            .replace(regex.quot, '"')
            .replace(regex.squot, '\'');
};
