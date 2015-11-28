var chai = require('chai');
var expect = chai.expect;

var dtd = require('../index');

describe('dtd', function(){

	it('example', function(){
		var text = '<!DOCTYPE note [\
<!ELEMENT note (to,from,heading,body)>\
<!ELEMENT to (#PCDATA)>\
<!ELEMENT from (#PCDATA)>\
<!ELEMENT heading (#PCDATA)>\
<!ELEMENT body (#PCDATA)>\
]>';
//		var data = dtd.tokenize(text);
	//	console.log(data);
	})

	it('An Internal DTD Declaration', function(){
		var text = '<!DOCTYPE note [\
]>';
		var data = dtd.tokenize(text);
		console.log(data);
	})
})
