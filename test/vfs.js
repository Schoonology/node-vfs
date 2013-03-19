/*global describe:true, it:true, beforeEach:true */
var expect = require('chai').expect,
    VFS = require('../lib/vfs');

describe('VFS', function () {
    var vfs;

    beforeEach(function () {
        vfs = new VFS();
    });

    describe('stack', function () {
        it('should go in order', function () {
            var called = [];

            vfs.use({
                exists: function () {
                    called.push(1);
                }
            }).use({
                exists: function () {
                    called.push(2);
                }
            });

            vfs.exists('somepath');

            expect(called).to.be.deep.equal([1, 2]);
        });

        it('should stop with the first successful adapter', function () {
            var called = [];

            vfs.use({
                exists: function () {
                    called.push(1);
                }
            }).use({
                exists: function () {
                    called.push(2);
                    return true;
                }
            }).use({
                exists: function () {
                    called.push(3);
                }
            });

            vfs.exists('somepath');

            expect(called).to.be.deep.equal([1, 2]);
        });

        it('should be configurable with use', function () {
            var called = [];

            vfs.use('a://', {
                exists: function () {
                    called.push(1);
                }
            }).use('b://', {
                exists: function () {
                    called.push(2);
                }
            }).use('c://', {
                exists: function () {
                    called.push(3);
                }
            });

            vfs.exists('b://somepath');

            expect(called).to.be.deep.equal([2]);
        });
    });
});
