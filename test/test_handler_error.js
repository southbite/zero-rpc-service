module.exports = {
	initialize:function(done){
		var _this = this;
		
		done();
	},
	process:function(message, callback){
		 var _this = this;
		 
		 //console.log('IN ERROR!! WHY!!!???');
		 
		 callback(new Error('this is a test error'), null);
	}
}