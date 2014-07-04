var config = require('./config');
var service = require('../lib/server-base');
var client = require('zero-rpc-client');
var expect = require('expect.js');

describe('e2e test', function() {

	it('should initialize', function(callback) {
		
		 this.timeout(15000);
		
		service.initialize(config, function(e){
			//console.log('server initialized: ' + e);
			//console.log(config.client);
			if (!e){
				client.initialize(config.client, function(e){
					//console.log('client initialized: ' + e);
					callback(e);
				});
			}else
				callback(e);
		});
	});
	
	

	it('should post to the handler, receive result', function(callback) {
		////console.log('in client test');
		 this.timeout(15000);
		 
		 client.performOperation('test_handler', {
	   		testprop:0
	   	 }, {ttl:10000}, function(e, result){
			
	   		console.log(e);
	   		console.log(result);
	   		expect(result.status).to.be('ok');
			callback(e);
			
		});
		 
	});
	

	
	it('should post to the error handler, receive result', function(callback) {
		////console.log('in client test');
		 this.timeout(15000);
		 
		 client.performOperation('test_handler_error', {
		   		
	   	 }, {ttl:10000}, function(e, result){
			
			console.log(e);
	   		//console.log('result');
	   		//console.log(result);
	   		expect(result.status).to.be('error');
			callback(e);
			
		});
		 
	});

	it('should post to the handler that calls the internal client, receive result', function(callback) {
		////console.log('in client test');
		 this.timeout(15000);
		 
		 client.performOperation('test_handler_internal', {
	   		testprop:0
	   	 }, {ttl:10000}, function(e, result){
			
	   		console.log(e);
	   		console.log(result);
	   		expect(result.status).to.be('ok');
			callback(e);
			
		});
		 
	});


	/*
	NOT SURE HOW TO DO THIS
	it('should timeout on the server side', function(callback) {
		
	////console.log('in client test');
		 this.timeout(15000);
		 
		 client.performOperation('test_handler', {
	   		testprop:0
	   	 }, {ttl:100}, function(e, result){
			
	   		//console.log('result');
	   		console.log(result);
	   		expect(result.status).to.be('error');
			callback(e);
			
		});
		
	});
	*/
	
});

