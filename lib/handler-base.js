
var moment = require('moment');


module.exports = {
	wrapPayload:function(err, message){
		if (!err)
			return {status:'ok', payload:message};
		else 
			return {status:'error', payload:err};
	},
	checkTTL:function(message){
		
		if (message.options.ttl == null || message.options.ttl == 0)
			return true;
		else{
			
			var compareToTime = moment().valueOf();

			if (message.options.ttlUnit){

				if (message.options.ttlUnit == 'hours')
					compareToTime -= 1000 * 60 * 60 * message.options.ttl;
				else
				if (message.options.ttlUnit == 'minutes')
					compareToTime -= 1000 * 60 * message.options.ttl;
				else
				if (message.options.ttlUnit == 'milliseconds')
					compareToTime -= message.options.ttl;
				else
					compareToTime -= 1000 * message.options.ttl;
			}
			else
				compareToTime -= 1000 * message.options.ttl;
				
			////console.log('TTL CHECK');
			////console.log(compareToTime);
			////console.log(message.options.timestamp);
			////console.log(message.options.timestamp <= compareToTime);

			return (message.options.timestamp > compareToTime);
			
		}
	},
	initialize:function(config, handlerName, context, events, done){
		var _this = this;
		var handler = config.handlers[handlerName].instance,
		settings = config.handlers[handlerName].settings;
		
		handler.events = require('event-framework');
		
		//////console.log('handler events');
		//////console.log(handler.events);
		
		if (events){
			handler.events.importEvents(events);
		}
		
		handler.context = context;
		handler.settings = settings;
		handler.name = handlerName;
		
		handler.initialize(function(e){
			
			if (e)
				done(e);
			else{
				handler.process_internal = function(message, callback){

					console.log('in handler process');
					console.log(message);

					if (_this.checkTTL(message)){
						handler.process(message, function(e, result){
							callback(e, result);
						});
					}else{
						callback('TTL Limit Reached', result);
					}

				}.bind(handler);

				done(null, handler);
			}
		});
	}
}