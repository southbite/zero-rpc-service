module.exports = {
	initialize:function(done){
		var _this = this;
		
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		 console.log('TEST HANDLER RAN!!!');
		  console.log(message);
		 console.log(callback);
		 
		 callback(null, {status:'ok'});
	}
}