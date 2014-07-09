module.exports = {
	initialize:function(done){
		var _this = this;
		_this.logger = _this.context.services.get('logservice');
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		 _this.logger.log('TEST HANDLER RAN!!!');
		 _this.logger.log(message);
		 _this.logger.log(callback);
		 
		 callback(null, {status:'ok'});
	}
}