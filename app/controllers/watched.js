/**
 * Instantiate the local variables for this controller
 */
var _args = arguments[0] || {}, // Any passed in arguments will fall into this property
	App = Alloy.Globals.App, // reference to the APP singleton object
	movies = null,  // Array placeholder for all users
	indexes = [],  // Array placeholder for the ListView Index (used by iOS only);
	Database = require('database');

var title = _args.title ? _args.title.toLowerCase() : "Watched movies";
Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".viewed");


function init(){
	
	movies = Database.listMovies();
		
	/**
	 * Sorts the `movies` array by the title property
	 */
	movies = _.sortBy(movies, function(movie){
		return movie.title;
	});
	
	/**
	 * IF the users array exists
	 */
	if(movies) {
		
		/**
		 * Setup our Indexes and Sections Array for building out the ListView components
		 */
		indexes = [];
		var sections = [];
		
		/**
		 * Group the data by first letter of title to make it easier to create 
		 * sections.
		 */
		var movieGroups  = _.groupBy(movies, function(item){
		 	return item.title.charAt(0);
		});
        
        /**
         * Iterate through each group created, and prepare the data for the ListView
         */
		_.each(movieGroups, function(group){

			/**
			 * Take the group data that is passed into the function, and parse/transform
			 * it for use in the ListView templates as defined in the directory.xml file.
			 */
			var dataToAdd = preprocessForListView(group);

			/**
			 * Check to make sure that there is data to add to the table,
			 * if not lets exit
			 */
			if(dataToAdd.length < 1) return;
			
			
			/**
			 * Lets take the first Character of the LastName and push it onto the index
			 * Array - this will be used to generate the indices for the ListView on IOS
			 */
			indexes.push({
				index: indexes.length,
				title: group[0].title.charAt(0)
			});

			/**
			 * Create the ListViewSection header view
			 * DOCS: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ListSection-property-headerView
			 */

			 var sectionHeader = Ti.UI.createView({
			 	backgroundColor: "#ececec",
			 	width: Ti.UI.FILL,
			 	height: 30
			 });

			 /**
			  * Create and Add the Label to the ListView Section header view
			  */
			 var sectionLabel = Ti.UI.createLabel({
			 	text: group[0].title.charAt(0),
			 	left: 20,
			 	font:{
			 		fontSize: 20
			 	},
			 	color: "#666"
			 });
			 sectionHeader.add(sectionLabel);

			/**
			 * Create a new ListViewSection, and ADD the header view created above to it.
			 */
			 var section = Ti.UI.createListSection({
				headerView: sectionHeader
			});

			/**
			 * Add Data to the ListViewSection
			 */
			section.items = dataToAdd;
			
			/**
			 * Push the newly created ListViewSection onto the `sections` array. This will be used to populate
			 * the ListView 
			 */
			sections.push(section);
		});

		/**
		 * Add the ListViewSections and data elements created above to the ListView
		 */
		$.listView.sections = sections;

	}
	

};

/**
 *	Convert an array of data from a JSON file into a format that can be added to the ListView
 * 
 * 	@param {Object} Raw data elements from the JSON file.
 */
var preprocessForListView = function(rawData) {
	 
	
	/**
	 * Using the rawData collection, we map data properties of the users in this array to an array that maps an array to properly
	 * display the data in the ListView based on the templates defined in directory.xml (levearges the _.map Function of UnderscoreJS)
	 */
	return _.map(rawData, function(item) {
		
		/**
		 * Create the new user object which is added to the Array that is returned by the _.map function. 
		 */
		return {
			template: "userTemplate",
			properties: {
				searchableText: item.title,
				user: item,
				canEdit:true
			},
			movieTitle: {text: item.title},
			movieRuntime: {text: item.released + " | " + durationString(item.runtime.split(" ")[0])},
			moviePoster: {image: item.poster},
			movieGenre: {text: item.genre} 
		};
	});	
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

/**
 * This function handles the click events for the rows in the ListView.
 * We want to capture the user property associated with the row, and pass
 * it into the profile View
 * 
 * @param {Object} Event data passed to the function
 */
function onItemClick(e){
	
	/**
	 * Appcelerator Analytics Call
	 */
	Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".contact.clicked");
	
	/**
	 * Get the Item that was clicked
	 */
	var item = $.listView.sections[e.sectionIndex].items[e.itemIndex];
	
	/**
	 * Open the profile view, and pass in the user data for this contact
	 */
	// Alloy.Globals.Navigator.open("profile", item.properties.user);
	Alloy.Globals.Navigator.open("movie", {backto:"watched", movieSelected:item.properties.user, displayHomeAsUp:true});
	$.getView().close();
}


var onFilterChange = function onChange(e){
	$.listView.searchText = e.source.value;
};
	
	
	
/**
 * Handles the favorite icon click event. Launches this same control as a child window, but limits the view
 * to only favoitems.
 * 
 * @param {Object} Event data passed to the function
 */
var onSearchClick = function onClick (e){
	
	/**
	 * Appcelerator Analytics Call
	 */
	Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".favorites.clicked");
	
	/**
	 * Open this same controller into a new page, pass the flag to restrict the list only to favorite Contacts and force the title
	 */
	Alloy.Globals.Navigator.open("searchListing", {backto:"watched", title:"Search Movies", displayHomeAsUp:true});
	$.getView().close();

};


/**
 * Listen for the refresh event, and re-initialize
 */
Ti.App.addEventListener("refresh-data", function(e){
	init();
});


/**
 * Initialize View
 */
init();
