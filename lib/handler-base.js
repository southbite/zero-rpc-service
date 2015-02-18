
var moment = require('moment'),
async = require('async');

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

					if (_this.checkTTL(message)){
						
					  var currentTry = 1;
					  var currentError, currentResult;
					  var retries = message.options.retry?message.options.retry + 1:1;
					  var retry_interval = message.options.retry_interval?message.options.retry_interval:1000;

					  var processed = false;

					  async.whilst(
						    function () { return (currentTry <= retries && !processed) },
						    function (whilstCallback) {
						
								handler.process(message, function(e, result){

									if (e){

								  		currentTry += 1;
								  		currentError = e;
								  		
								  		handler.currentTry = currentTry;
								  		handler.currentError = currentError;

								  		if (currentTry > retries)
						  					whilstCallback();
						  				else
						  					setTimeout(function(){
						  						whilstCallback();
						  					}, retry_interval)

								  	}else{
								  		processed = true;
								  		currentResult = result;

						  				whilstCallback();
								  	}

								});

						    },
						    function (whilstError) {

					  		  if (whilstError)
					  		  	return callback(whilstError);

							  if (!processed)
							  	return callback(currentError);

							  return callback(null, currentResult);

						    }
						);

					}else{
						callback('TTL Limit Reached', result);
					}

				}.bind(handler);

				done(null, handler);
			}
		});
	}
}