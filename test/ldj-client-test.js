'use strict'
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client.js');

describe('LDJClient', () => {
    let stream = null;
    let client = null;

    beforeEach(() =>{
        stream = new EventEmitter();
        client = new LDJClient(stream);
    });

    it('should emit a message event from a single data event', done =>{
        client.on('message', message =>{
            assert.deepEqual(message, {foo:'bar'});
            done();
        });
        stream.emit('data', '{"foo":"bar"}\n');
    });

    it('should emit a message event from split data events', done =>{
        client.on('message',message =>{
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data','{"foo":');
        process.nextTick(() => stream.emit('data', '"bar"}\n'));
    });

    // Add a unit test for a single message that is split over two (or more) data events from the stream.
    it('should emit a message event from split data events (three parts)', done => {
        client.on('message', message => {
            assert.deepEqual(message, { foo: 'bar-bar' });
            done();
        });
        stream.emit('data', '{"foo":"');
        process.nextTick(() => stream.emit('data', 'bar-'));
        process.nextTick(() => stream.emit('data', 'bar"}\n'));
    });

    // Add a unit test that passes in null to the LDJClient constructor and asserts that an error is thrown. Then make the test pass by modifying the con- structor
    it('pass null to constructor must throw an error', done => {
        assert.throws(_ => new LDJClient(null), new Error('a stream es required'));
        done();
    });

    it('pass number as data event', done => {
        client.on('message', message => {
            assert.equal(5, message);
            done();
        })

        stream.emit('data', '5\n');
    });

});