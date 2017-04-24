module.exports = (function() {
	
	var apiAux = {};

	apiAux.LoadRemoteImage = function (obj,url) {
	// exports.LoadRemoteImage = function (obj,url) {
	   var xhr = Titanium.Network.createHTTPClient();
	
		xhr.onload = function() {
			Ti.API.info('image data='+this.responseData);
		 	obj.image=this.responseData;
		};
		
		xhr.open('GET',url);
		
		xhr.send();
	};
	
	
	
	apiAux.durationString = function(minutes) {
	
		var hours = Math.floor(minutes/60);
		minutes = minutes - (hours * 60);
		var duration = (hours > 0) ? hours + "h " : "";
		duration += (minutes > 9) ? minutes + "m" : "0" + minutes + "m";
		
		return duration;	
	};
	
	return apiAux;
})();