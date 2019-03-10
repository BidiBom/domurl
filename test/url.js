'use strict';

const assert = require('assert');
const fs = require('fs');
const p = require('path');
const Url = require('../url.min.js');

function sanitizeURL (url) {
    var u = new Url(url, true);

    if (u.query['reload']) {
        delete u.query['reload']
    }

    if (u.query['forceReload']) {
        delete u.query['forceReload']
    }

    if (u.query['device']) {
        delete u.query['device']
    }

    if (u.query['testwebid']) {
        delete u.query['testwebid']
    }

    if (u.query['testWebId']) {
        delete u.query['testWebId']
    }

    if (u.query['testWebID']) {
        delete u.query['testWebID']
    }

    if (u.query['timetravel']) {
        delete u.query['timetravel']
    }

    return u.toString();
}

describe('Url()', function () {
    it('should construct an oobject', function () {
        const u = new Url();
        assert.equal(u instanceof Url, true);
    });
    it('should match current dir when construct with no argument', function () {
        const u = new Url();
        const dir = u.path.replace(/\//g, p.sep);
        process.platform.match(/^win/) && (dir = dir.substr(1));
        assert.equal(dir, fs.realpathSync('.'));
    });
    it('should keep URL without transformations if requested', function () {
        assert.equal(
            sanitizeURL('SearchResults?search=new&make=Buick&year=2016&forceReload=true'),
            'SearchResults?search=new&make=Buick&year=2016'
        );
    });
    it('should test absolutize url', function () {
        const absoluteUrl = new Url('/foo');
        assert.equal(absoluteUrl.toString(), 'file:///foo');

        const noTransform = new Url('/foo', true);
        assert.equal(noTransform.toString(), '/foo');
    });
});

describe('Url.clearQuery()', function () {
    it('should remove all vars from query string', function () {
        const url = new Url('http://example.com/?a=&b=&c=&d=&e=&f=&g=&h#foo');
        url.clearQuery();
        assert.equal('http://example.com/#foo', url.toString());
    });
});

describe('Url.encode(), Url.decode()', function () {
    it('should correctly encode and decode query string params', function () {
        var url1 = new Url('http://localhost/?a=%3F').toString();
        var url2 = new Url('http://localhost/?a=%3f').toString();
        assert.equal(url1.toLowerCase(), url2.toLowerCase());
    });
});

describe('Url.queryLength()', function () {
    it('should correctly return correct query lengths', function () {
        let url = new Url('http://localhost/?a=%3F');
        let queryLength = url.queryLength();
        assert.equal(queryLength, 1);

        url = new Url('http://localhost/');
        queryLength = url.queryLength();
        assert.equal(queryLength, 0);

        url = new Url('http://localhost/?a=%3F&test=this&hello=world');
        queryLength = url.queryLength();
        assert.equal(queryLength, 3);
    });
});

describe('Url props interface', function () {
    it('should parse all URL parts correctly', function () {
        const str = 'wss://user:pass@example.com:9999/some/path.html?foo=bar#anchor';
        const u = new Url(str);
        assert.equal(u.protocol, 'wss');
        assert.equal(u.user, 'user');
        assert.equal(u.pass, 'pass');
        assert.equal(u.host, 'example.com');
        assert.equal(u.port, '9999');
        assert.equal(u.path, '/some/path.html');
        assert.equal(u.query, 'foo=bar');
        assert.equal(u.query.foo, 'bar');
        assert.equal(u.hash, 'anchor');
        assert.equal(str, u.toString());
    });
});

describe('Path url encoding', function () {
    it('should correctly encode whitespace with %20', function () {
        const url = new Url('http://localhost/path with space').toString();
        assert.equal(url.toLowerCase(),'http://localhost/path%20with%20space');
    });
});
