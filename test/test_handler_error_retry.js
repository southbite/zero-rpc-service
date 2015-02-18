module.exports = {
	initialize:function(done){
		var _this = this;
		
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		 console.log('IN RETRY');
		 console.log(_this.currentTry);

		 if (_this.currentTry == 3)
		 	callback(null, {status:'ok'});
		 else
		 	callback(new Error('this is a test retry error'), null);

	}
}