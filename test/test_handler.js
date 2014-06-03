module.exports = {
	initialize:function(done){
		var _this = this;
		
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		 //console.log('TEST HANDLER RAN!!!');
		 
		 callback(null, {result:'ok'});
	}
}