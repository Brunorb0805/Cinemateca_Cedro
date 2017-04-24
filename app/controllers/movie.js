/**
 * Instantiate the variables assocaited with this controller
 */
var _args = arguments[0] || {},
	ImageLoader = require('imageloader'),
	Database = require('database'),
	movie = _args.movieSelected;
	
	
function init(){
	// var args = $.args;
	alert(movie);

	ImageLoader.LoadRemoteImage( $.poster_imageview, movie.poster );
	//Information head
	$.title.text = movie.title;	
	$.released.text = movie.released + " | " + ImageLoader.durationString(movie.runtime.split(" ")[0]);
	$.genre.text = movie.genre;
	
	//Infomation body	 
	$.director.text = "Direct by: " + movie.director;
	$.writers.text = "Writers: " + movie.writer;
	$.actors.text = "Actors: " + movie.actors;
	$.language.text = "Country/Lenguage: " + movie.country + "/" + movie.language;
	$.awards.text = "Awards: " + movie.awards;
	$.boxoffice = "Box office: " + movie.boxOffice;
	$.production = "Production by: " + movie.production;
	$.website = "Website: " + movie.website;
	$.plot.text = movie.plot;    

};

// $.website.addEventListener('click', function(e){
	// if (movie.imdbID) {
		// Ti.Analytics.featureEvent('open:movie.imdb');
		// Ti.Platform.openURL(movie.website);
	// }
// });

/**
 * Check that the contact is not already a favorite, and update the favorites button
 * title as required.
 */
$.removeFromWhatched.setTitle("- Remove From Watched");

/**
 * Appcelerator Analytics Call
 */
Ti.Analytics.featureEvent(Ti.Platform.osname+".movie.viewed");


/*
 * Closes the Window
 */
function closeWindow(){
	$.getView().close();
}



function removeFromWhatched() {
	
	var dialog = Ti.UI.createAlertDialog({
	    confirm: 0,
	    buttonNames: ['Confirm', 'Cancel'],
	    message: 'Would you like to delete the movie from whached?',
	    title: 'Delete'
  	});
  	
  	dialog.addEventListener('click', function(e){
    	if (e.index === e.source.confirm){
    		var sucess = Database.deleteMovie( movie.imdbID );
    		Alloy.createController("watched").getView().open();
			$.getView().close();
    	}
	    Ti.API.info('e.cancel: ' + e.cancel);
	    Ti.API.info('e.source.cancel: ' + e.source.cancel);
	    Ti.API.info('e.index: ' + e.index);
  	});
  	
  	dialog.show();
	 
}

init();
