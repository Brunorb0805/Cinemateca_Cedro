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

function init(){
	var args = $.args;
};

function searchMovie(e) {
	var url = "http://www.omdbapi.com/?i=" + _args.movieSelected.imdbID;

	$.progressIndicator.show();
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    	$.progressIndicator.hide();
	        movie = JSON.parse(this.responseText);
	        
	        if( movie.Response === "True" ) {
	        	ImageLoader.LoadRemoteImage( $.poster_imageview, movie.Poster );		        
	        
			    $.title.text = movie.Title;	
		        $.released.text = movie.Released + " | " + ImageLoader.durationString(movie.Runtime.split(" ")[0]);
		        $.genre.text = movie.Genre;	 
		        $.director.text = "Direct by: " + movie.Director;
		        $.writers.text = "Writers: " + movie.Writer;
		        $.actors.text = "Actors: " + movie.Actors;
			    $.language.text = "Country/Lenguage: " + movie.Country + "/" + movie.Language;
		        $.plot.text = movie.Plot;    
		        $.movieInfo.visible = true;
		        
		        	
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


/**
 * Function call when click in save buttom
 */
function saveWatchMovie(){
	var dialog = null;
	/**
	 * If the movie is not null, try save
	 */
	if( movie != null ){
		try {
			var sucess = Database.addMovie(movie);
		    // $.addFavoriteBtn.setTitle("- Remove From Watches");
		    if( sucess > 0 ) {
		    	dialog = Ti.UI.createAlertDialog({
				    message: movie.Title + " saved successfully!",
				   	ok: 'Ok',
				   	title: 'Sucess'
				});
	  			dialog.show();
	  			
	  			dialog.addEventListener('click', function(e){
			    	$.getView().close();
			  	});
  	
		    	// alert(movie.Title + " saved successfully!");
		    } else {
		    	dialog = Ti.UI.createAlertDialog({
				    message: "Error while saving " + movie.Title,
				   	ok: 'Ok',
				   	title: 'Error'
				});
		    	// alert("Error while saving " + movie.Title );
		    }
		} catch(err) {
			dialog = Ti.UI.createAlertDialog({
				    message: err.message,
				   	ok: 'Ok',
				   	title: 'Error'
				});
    		// alert("Error - " + err.message);
    	}
	}
	else{
		alert("Error, movie not saved!");
	}
	
	// $.movieInfo.visible = false;
	
};

/*
 * Function for formating runtime of movie
 */
function durationString(minutes) {
	
	var hours = Math.floor(minutes/60);
	minutes = minutes - (hours * 60);
	var duration = (hours > 0) ? hours + "h " : "";
	duration += (minutes > 9) ? minutes + "m" : "0" + minutes + "m";
	return duration;
}


searchMovie();
