module.exports = {
	initialize:function(done){
		var _this = this;
		
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		 console.log('TEST HANDLER INTERNAL RUNNING!!!');
		 console.log(message);
		 console.log(callback);

		 _this.context.internalClient.performOperation('test_handler', {
	   		testprop:0
	   	 }, {ttl:30000}, function(e, result){
			
	   	 	console.log('TEST HANDLER INTERNAL RAN!!!');

	   		callback(e, {status:'ok', result:result});
			
		});
		 
		 
	}
}