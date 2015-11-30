var chai = require('chai');
var expect = chai.expect;

var dtd = require('../index');
var toString = function(e){
	return e.toString();
};

describe('dtd', function(){

	it('example', function(){
		var input = '<!DOCTYPE note [\
<!ELEMENT note (to,from,heading,body)>\
<!ELEMENT to (#PCDATA)>\
<!ELEMENT from (#PCDATA)>\
<!ELEMENT heading (#PCDATA)>\
<!ELEMENT body (#PCDATA)>\
]>';
		var output = dtd.tokenize(input);
		output = output.map(toString);
//		console.log(output);
	})

	describe('"declare" lexer', function(){
		it('should tokenize DOCTYPE', function(){
			var input = '<!DOCTYPE note [\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[0]).to.equal('DOCTYPE(0:note)');
		})
		it('should throw "unexpected declaration."', function(){
			var input = 'null\
<!DOCTYPE note [\
]>';
			var f = function(){return dtd.tokenize(input)};
			expect(f).to.throw('unexpected declaration.')
		})
	})
	describe('"node" lexer', function(){
		it('should tokenize ELEMENT', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note (to,from,heading,body)>\
<!ELEMENT to (#PCDATA)>\
<!ELEMENT from (#PCDATA)>\
<!ELEMENT heading (#PCDATA)>\
<!ELEMENT body (#PCDATA)>\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[1]).to.equal('ELEMENT(16:note)');
		})
	})
	describe('"element" lexer', function(){
		it('should tokenize ELEMENT.CATEGORY', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note ANY>\
<!ELEMENT to EMPTY >\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[2]).to.equal('ELEMENT.CATEGORY(31:ANY)');
			expect(output[4]).to.equal('ELEMENT.CATEGORY(48:EMPTY)');
		})
		it('should tokenize ELEMENT.CONTENT', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note (to,from,heading,body)>\
<!ELEMENT to (#PCDATA)>\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[2]).to.equal('ELEMENT.CONTENT(31:()');
			expect(output[13]).to.equal('ELEMENT.CONTENT(67:()');
		})
	})
	describe('"element.content" lexer', function(){
		it('should tokenize ELEMENT.CONTENT.CHILD', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note (to,from,heading,body)>\
<!ELEMENT to (#PCDATA)>\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[3]).to.equal('ELEMENT.CONTENT.CHILD(32:to)');
			expect(output[14]).to.equal('ELEMENT.CONTENT.PCDATA(68:#PCDATA)');
		})
	})
	describe('"element.content.delimiter" lexer', function(){
		it('should tokenize ELEMENT.CONTENT.SEQUENCE', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note (to,from,heading,body)>\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[4]).to.equal('ELEMENT.CONTENT.SEQUENCE(34:,)');
			expect(output[6]).to.equal('ELEMENT.CONTENT.SEQUENCE(39:,)');
			expect(output[8]).to.equal('ELEMENT.CONTENT.SEQUENCE(47:,)');
		})
		it('should tokenize ELEMENT.CONTENT.OR', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note (to|from|heading|body)>\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[4]).to.equal('ELEMENT.CONTENT.OR(34:|)');
			expect(output[6]).to.equal('ELEMENT.CONTENT.OR(39:|)');
			expect(output[8]).to.equal('ELEMENT.CONTENT.OR(47:|)');
		})
	})
	describe('"element.content.suffix" lexer', function(){
		it('should tokenize ELEMENT.CONTENT.MIN-ONE-OCCURENCE', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note (to+)>\
<!ELEMENT note (to|from+)>\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[4]).to.equal('ELEMENT.CONTENT.MIN-ONE-OCCURENCE(34:+)');
			expect(output[12]).to.equal('ELEMENT.CONTENT.MIN-ONE-OCCURENCE(60:+)');
		})
		it('should tokenize ELEMENT.CONTENT.ZERO-OR-MORE-OCCURENCE', function(){
			var input = '<!DOCTYPE note [\
<!ELEMENT note (to*)>\
<!ELEMENT note (to|from*)>\
]>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[4]).to.equal('ELEMENT.CONTENT.ZERO-OR-MORE-OCCURENCE(34:*)');
			expect(output[12]).to.equal('ELEMENT.CONTENT.ZERO-OR-MORE-OCCURENCE(60:*)');
		})
		it('should tokenize ELEMENT.CONTENT.ZERO-OR-ONE-OCCURENCE', function(){
			var input = '<!DOCTYPE note [\n' +
				'<!ELEMENT note (to?)>\n' +
				'<!ELEMENT note (to|from?)>\n' +
				']>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[4]).to.equal('ELEMENT.CONTENT.ZERO-OR-ONE-OCCURENCE(35:?)');
			expect(output[12]).to.equal('ELEMENT.CONTENT.ZERO-OR-ONE-OCCURENCE(62:?)');
		})
	})
	describe('"element*" lexers', function(){
		it('should tokenize mixed content 1', function(){
			var input = '<!DOCTYPE note [\n' +
				'<!ELEMENT note (#PCDATA|to|from|header|message)*>\n' +
				']>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[ 1]).to.equal('ELEMENT(17:note)');
			expect(output[ 2]).to.equal('ELEMENT.CONTENT(32:()');
			expect(output[ 3]).to.equal('ELEMENT.CONTENT.PCDATA(33:#PCDATA)');
			expect(output[ 4]).to.equal('ELEMENT.CONTENT.OR(40:|)');
			expect(output[ 5]).to.equal('ELEMENT.CONTENT.CHILD(41:to)');
			expect(output[ 6]).to.equal('ELEMENT.CONTENT.OR(43:|)');
			expect(output[ 7]).to.equal('ELEMENT.CONTENT.CHILD(44:from)');
			expect(output[ 8]).to.equal('ELEMENT.CONTENT.OR(48:|)');
			expect(output[ 9]).to.equal('ELEMENT.CONTENT.CHILD(49:header)');
			expect(output[10]).to.equal('ELEMENT.CONTENT.OR(55:|)');
			expect(output[11]).to.equal('ELEMENT.CONTENT.CHILD(56:message)');
			expect(output[12]).to.equal('ELEMENT.CONTENT.CLOSE(63:))');
			expect(output[13]).to.equal('ELEMENT.CONTENT.ZERO-OR-MORE-OCCURENCE(64:*)');
			expect(output[14]).to.equal('ELEMENT.END(65:>)');
		})
		it('should tokenize mixed content 2', function(){
			var input = '<!DOCTYPE note [\n' +
				'<!ELEMENT note (to,from,header,(message|body))>\n' +
				']>';
			var output = dtd.tokenize(input);
			output = output.map(toString);
			expect(output[ 1]).to.equal('ELEMENT(17:note)');
			expect(output[ 2]).to.equal('ELEMENT.CONTENT(32:()');
			expect(output[ 3]).to.equal('ELEMENT.CONTENT.CHILD(33:to)');
			expect(output[ 4]).to.equal('ELEMENT.CONTENT.SEQUENCE(35:,)');
			expect(output[ 5]).to.equal('ELEMENT.CONTENT.CHILD(36:from)');
			expect(output[ 6]).to.equal('ELEMENT.CONTENT.SEQUENCE(40:,)');
			expect(output[ 7]).to.equal('ELEMENT.CONTENT.CHILD(41:header)');
			expect(output[ 8]).to.equal('ELEMENT.CONTENT.SEQUENCE(47:,)');
			expect(output[ 9]).to.equal('ELEMENT.CONTENT(48:()');
			expect(output[10]).to.equal('ELEMENT.CONTENT.CHILD(49:message)');
			expect(output[11]).to.equal('ELEMENT.CONTENT.OR(56:|)');
			expect(output[12]).to.equal('ELEMENT.CONTENT.CHILD(57:body)');
			expect(output[13]).to.equal('ELEMENT.CONTENT.CLOSE(61:))');
			expect(output[14]).to.equal('ELEMENT.CONTENT.CLOSE(62:))');
			expect(output[15]).to.equal('ELEMENT.END(63:>)');
		})
	})
})
