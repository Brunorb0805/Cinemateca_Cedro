/**
 * Instantiate the local variables for this controller
 */
var _args = arguments[0] || {},
	App = Alloy.Globals.App;
	

/**
 * Appcelerator Analytics Call
 */
var title = _args.title ? _args.title.toLowerCase() : "search movies";
Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".viewed");
var ImageLoader = require('imageloader');
var Database = require('database');
var movie = null;
var movies;


function searchMovie(e) {
	var titleMovie = $.txtSearch.getValue();
	var url = "http://www.omdbapi.com/?s=" + titleMovie;

	$.progressIndicator.show();
	
	if( titleMovie.length == 0 ) {
		var dialog = Ti.UI.createAlertDialog({
	    	message: "Por favor, entre com o nome do filme!",
	    	ok: 'Ok'
	  	});
	  	dialog.show();
		
		// alert("Por favor, entre com o nome do filme!");
		$.progressIndicator.hide();
	} else {
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	$.progressIndicator.hide();
		        ret = JSON.parse(this.responseText);
		        
		        if( ret.Response === "True" ) {
		        	movies = ret.Search;
					movies = _.sortBy(movies, function(movie){
						return movie.Title;
					});
					
					if(movies) {
						
						indexes = [];
						var sections = [];
						
						var movieGroups  = _.groupBy(movies, function(item){
						 	return item.Title.charAt(0);
						});
				        
						_.each(movieGroups, function(group){
				
							var dataToAdd = preprocessForListView(group);
				
							if(dataToAdd.length < 1) return;
							
							indexes.push({
								index: indexes.length,
								title: group[0].Title.charAt(0)
							});
				
							 var sectionHeader = Ti.UI.createView({
							 	backgroundColor: "#ececec",
							 	width: Ti.UI.FILL,
							 	height: 30
							 });
				
							 
							 var sectionLabel = Ti.UI.createLabel({
							 	text: group[0].Title.charAt(0),
							 	left: 20,
							 	font:{
							 		fontSize: 20
							 	},
							 	color: "#666"
							 });
							 sectionHeader.add(sectionLabel);
				
							 var section = Ti.UI.createListSection({
								headerView: sectionHeader
							});
				
							
							section.items = dataToAdd;
							
							
							sections.push(section);
						});
				
						
						$.listView.sections = sections;
					}			        
		        	
		        } else {
		        	var dialog = Ti.UI.createAlertDialog({
				    	message: movie.Error,
				    	ok: 'Ok',
				    	title: 'Error'
				  	});
	  				dialog.show();
		        	// alert( movie.Error );
		        }		        
		    },
		    onerror: function(e) {
		    	$.progressIndicator.hide();
				// this function is called when an error occurs, including a timeout
		        Ti.API.debug(e.error);
		        var dialog = Ti.UI.createAlertDialog({
				    message: e.error,
				   	ok: 'Ok',
				   	title: 'Error'
				});
	  			dialog.show();
		        // alert('error');
		    },
	    	timeout:9000  /* in milliseconds */
		});
		xhr.open("GET", url);
		xhr.send();  // request is actually sent with this statement
	}
}


var preprocessForListView = function(rawData) {
	 

	return _.map(rawData, function(item) {
		
		return {
			template: "userTemplate",
			properties: {
				searchableText: item.title,
				user: item,
				canEdit:true
			},
			movieTitle: {text: item.Title},
			movieYear: {text: item.Year},
			type: {text: "("+item.Type+")"},
			moviePoster: {image: item.Poster},
		};
	});	
};


function onItemClick(e){
	
	Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".contact.clicked");
	
	var item = $.listView.sections[e.sectionIndex].items[e.itemIndex];
	
	// Alloy.Globals.Navigator.open("profile", item.properties.user);
	Alloy.Globals.Navigator.open("search", {backto:"false", movieSelected:item.properties.user, displayHomeAsUp:true});
}



function closeWindow(){
	$.profile.close();
}
