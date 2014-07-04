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
		
		log4js.configure(config.getSetting('log4jsConfig', true));
		var context = {logger:logger};
		


		var initializeHandlers = function(){async.eachSeries(Object.keys(config.handlers), function (handlerName, callback){ 
				context.logger['info']('Initializing handler ' + handlerName);
				handlerBase.initialize(config, handlerName, context, {
					'critical-failure':{listenerName:'server-base', handler:function(args){
						//TODO - send email shutdown?
					}},
					'message-posted':{listenerName:'server-base', handler:function(args){
						context.logger['info']('Message posted: ' + args.name);
					}},
					'message-processed':{listenerName:'server-base', handler:function(args){
						context.logger['info']('Message processed: ' + args.name);
					}},
					'message-failed':{listenerName:'server-base', handler:function(args){
						context.logger['error']('Message failed: ' + args.name + ': ' + args.error.toString());
					}}
				}, function(e, handler){

					if (!e){
						context.logger['info']('Initialized handler ' + handlerName);
						_this.handlers[handlerName] = handler.process_internal;
					}
					
					callback(e);
				});
			}.bind(_this), 
			function(e) {
				
				if (!e){

					try{

						_this.rpcServer = new zerorpc.Server(_this.handlers);
						_this.rpcServer.bind("tcp://0.0.0.0:4242");

						internalclient.initialize({server_url:'tcp://127.0.0.1:4242', options:{timeout:120}}, function(e){

							if (!e){
								context.internalClient = internalclient;

								context.logger['info']('Success initializing zero-rpc service');
								done();
							}
							else
								context.logger['error']('Failure initializing zero-rpc service internal client: ' + e);
							

						});

					}catch(e){
						context.logger['error']('Failure initializing zero-rpc service');
						done(e);
					}
					
				}else{
					context.logger['error']('Failure initializing zero-rpc service');
					done(e);
				}
					
			}.bind(_this)); 
		};
		
		services.initialize(config.services, {
			'initialized plugin':{listenerName:'server-base', handler:function(args){
				////console.log('in handler ' + args);
				context.logger['info']('Service ' + args.name + ' initialized.');
			}},
			'initialize plugin failed':{listenerName:'server-base', handler:function(args){
				////console.log('in handler ' + args);
				context.logger['error']('Service ' + args.name + ' initialize failed.');
			}}
		}, function(e){
			if (!e){
				context.services = services;
				initializeHandlers();
			}
			else
				context.logger['error']('Failure initializing zero-rpc service');
		});
		
	}
}