module.exports = {
	initialize:function(done){
		var _this = this;
		_this.logger = _this.context.services.get('logservice');
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		 _this.logger.log('LONG HANDLER RUNNING!!!');
		 _this.logger.log(message);
		 _this.logger.log(callback);

		 setTimeout(function(){
		 	 callback(null, {status:'ok'});
		 }, 15000);
		 
		
	}
}