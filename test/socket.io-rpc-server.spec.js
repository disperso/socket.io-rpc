require('chai').should();

var RPC = require('../main.js');
var express = require('express');
var cp = require('child_process');
var port = 8032;

var rpcApp = new RPC(port, {});

var app = rpcApp.expressApp;
var client = cp.fork('./test-utils/client-test-sample.js');
var socket;
describe('server calling connected client', function() {
	this.timeout(8000);

	before(function(done) {

		rpcApp.io.on('connection', function(_socket_) {
			socket = _socket_;
			done();
		});
	});

	it('should properly call to client and return', function() {

		return socket.rpc('fnOnClient')().then(function(ret) {
			console.log("client returned: " + ret);
			ret.should.equal(42);
		});

	});

	it('should reject when trying to fetch a node which does not exist', function() {
		return socket.rpc.fetchNode('weDidNotDefineIt').then(function() {
			throw new Error('This should not have resolved');
		}, function(err) {
			err.message.should.equal('Node is not defined on the client');
			err.path.should.equal('weDidNotDefineIt');
		})
	});

	it('client methods should no longer be callable after client disconnects', function(done) {
		client.kill();

		socket.rpc('fnOnClient')().then(function() {
			throw new Error('This should not have resolved');
		}, function(err) {
			err.message.should.match(/client (.*) disconnected before returning, call rejected/);
			done();
		});
		setTimeout(function(){
			socket.rpc('fnOnClient')().then(function() {
				throw new Error('This should not have resolved');
			}, function(err) {
				err.message.should.match(/client (.*) disconnected, call rejected/);
				done();
			});
		}, 100);
	});

});