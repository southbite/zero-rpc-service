module.exports = {
	initialize:function(done){
		var _this = this;
		_this.logger = _this.context.services.get('logservice');
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		_this.logger.log('STRESS HANDLER RUNNING!!!');
		callback(null, {status:'ok'});
		
	}
}