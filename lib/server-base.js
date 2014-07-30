
var log4js = require('log4js'),
logger = log4js.getLogger(),
handlerBase = require('./handler-base'),
services = require('utils-pluggable-service-layer'),
zerorpc = require("zerorpc"),
internalclient = require('zero-rpc-client');

module.exports = {
	handlers:{},
	initialize:function(config, done){
	
		var _this = this;
		var async = require('async');
		var context = {config:config};
		var DEFAULT_HEARTBEAT = 300000;

		if (!config.internalClientOptions)
			config.internalClientOptions = {heartbeatInterval:DEFAULT_HEARTBEAT, timeout:300};

		var initializeHandlers = function(){async.eachSeries(Object.keys(config.handlers), function (handlerName, callback){ 

				var logger = context.services.get('logservice');

				logger.log('Initializing handler ' + handlerName, 'info');
				handlerBase.initialize(config, handlerName, context, {
					'critical-failure':{listenerName:'server-base', handler:function(args){
						logger.log(args, 'fatal');
					}},
					'message-posted':{listenerName:'server-base', handler:function(args){
						logger.log('Message posted: ' + args.name, 'trace');
					}},
					'message-processed':{listenerName:'server-base', handler:function(args){
						logger.log('Message processed: ' + args.name, 'trace');
					}},
					'message-failed':{listenerName:'server-base', handler:function(args){
						logger.log('Message failed: ' + args.name + ': ' + args.error.toString(), 'error');
					}}
				}, function(e, handler){

					if (!e){
						logger.log('Initialized handler ' + handlerName, 'info');
						_this.handlers[handlerName] = handler.process_internal;
					}
					
					callback(e);
				});
			}.bind(_this), 
			function(e) {
				
				if (!e){

					var logger = context.services.get('logservice');

					try{

						_this.rpcServer = new zerorpc.Server(_this.handlers, DEFAULT_HEARTBEAT);
						_this.rpcServer.bind("tcp://0.0.0.0:4242");

						internalclient.initialize({server_url:'tcp://127.0.0.1:4242', options:config.internalClientOptions}, function(e){

							if (!e){
								context.internalClient = internalclient;
								logger.log('Success initializing zero-rpc service', 'info');
								done();
							}
							else
								logger.log('Failure initializing zero-rpc service internal client: ' + e, 'error');
								
						});

					}catch(e){
						logger.log('Failure initializing zero-rpc service', 'error');
						done(e);
					}
					
				}else{
					logger.log('Failure initializing zero-rpc service', 'error');
					done(e);
				}
					
			}.bind(_this)); 
		};
		
		services.initialize(config.services, {
			'initialized plugin':{listenerName:'server-base', handler:function(args){
				////console.log('in handler ' + args);
				console.log('Service ' + args.name + ' initialized.');
			}},
			'initialize plugin failed':{listenerName:'server-base', handler:function(args){
				console.log('Service ' + args.name + ' initialize failed.');
				console.log(args);
			}}
		}, function(e){
			if (!e){
				context.services = services;
				initializeHandlers();
			}
			else
				console.log('Failure initializing zero-rpc service');
		});
		
	}
}