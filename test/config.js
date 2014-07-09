module.exports = {
	getSetting:function(key, defaultValue){
		var setting = this[key];
		
		if (!setting && defaultValue)
			return defaultValue;
		else if (!setting)
			throw "Setting with key " + key + " has not been configured";
		else
			return setting;
	},
	services:{
		"logservice":{
				settings:{
					logger:{
						"appenders": [
						      { "type": "console"},
				              {
				                "type": "file",
				                "absolute": true,
				                "filename": __dirname + "/activity.log",
				                "maxLogSize": 20480,
				                "backups": 10
				              }
				            ]
					},
					log_level:['trace','debug','info','warn','error','fatal']
				},
				instance:require('pluggable-services').get('log')
			}		
	},
	handlers:{
		test_handler:{
			settings:{
				name:'test_handler',
				setting1:'setting1',
				setting1:'setting2',
				log:true
			},
			instance:require('./test_handler')
		},
		test_handler_error:{
			settings:{
				name:'test_handler_error',
				setting1:'setting1',
				setting1:'setting2',
				log:true
			},
			instance:require('./test_handler_error')
		},
		test_handler_internal:{
			settings:{
				name:'test_handler',
				setting1:'setting1',
				setting1:'setting2',
				log:true
			},
			instance:require('./test_handler_internal')
		}
	},
	client:{
		server_url:'tcp://127.0.0.1:4242',
		services:{
			"logservice":{
				settings:{
					logger:{
						"appenders": [
						      { "type": "console"},
				              {
				                "type": "file",
				                "absolute": true,
				                "filename": __dirname + "/activity.log",
				                "maxLogSize": 20480,
				                "backups": 10
				              }
				            ]
					},
					log_level:['trace','debug','info','warn','error','fatal']
				},
				instance:require('pluggable-services').get('log')
			}		
		},
		handlers:{
			test_handler:{
				settings:{
					name:'test_handler',
					setting1:'setting1',
					setting1:'setting2',
					log:true
				}
			},
			test_handler_error:{
				settings:{
					name:'test_handler_error',
					setting1:'setting1',
					setting1:'setting2',
					log:true
				}
			}
		}
	}
}