let expect = require('chai').expect;

let parser = require('../plugin/parser');

describe('Parser', () => {

    it('remove wrapping tags', function () {
        parser.prepare('<a>:::</a>', function (error, result) {
            expect(result).to.be.equal('\n:::\n');
        });
    });

    it('moves paragraph tag inside', function () {
        parser.prepare('<p>:::', function (error, result) {
            expect(result).to.be.equal('\n:::\n<p>');
        });
    });

    it('moves closed paragraph tag inside', function () {
        parser.prepare(':::</p>', function (error, result) {
            expect(result).to.be.equal('</p>\n:::\n');
        });
    });

    it('adds extra new lines', function () {
        parser.prepare(':::', function (error, result) {
            expect(result).to.be.equal('\n:::\n');
        });
    });

});