// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};


// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
// (function(){
// var ACS = require('ti.cloud'),
    // env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
    // username = Ti.App.Properties.getString('acs-username-'+env),
    // password = Ti.App.Properties.getString('acs-password-'+env);
// 
// // if not configured, just return
// if (!env || !username || !password) { return; }
// /**
 // * Appcelerator Cloud (ACS) Admin User Login Logic
 // *
 // * fires login.success with the user as argument on success
 // * fires login.failed with the result as argument on error
 // */
// ACS.Users.login({
	// login:username,
	// password:password,
// }, function(result){
	// if (env==='development') {
		// Ti.API.info('ACS Login Results for environment `'+env+'`:');
		// Ti.API.info(result);
	// }
	// if (result && result.success && result.users && result.users.length){
		// Ti.App.fireEvent('login.success',result.users[0],env);
	// } else {
		// Ti.App.fireEvent('login.failed',result,env);
	// }
// });
// 
// })();



Alloy.Globals.Device = {
	version: Ti.Platform.version,
	versionMajor: parseInt(Ti.Platform.version.split(".")[0], 10),
	versionMinor: parseInt(Ti.Platform.version.split(".")[1], 10),
	width: (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
	height: (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
	dpi: Ti.Platform.displayCaps.dpi,
	orientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? "landscape" : "portrait"
};

if(OS_ANDROID) {
	Alloy.Globals.Device.width = (Alloy.Globals.Device.width / (Alloy.Globals.Device.dpi / 160));
	Alloy.Globals.Device.height = (Alloy.Globals.Device.height / (Alloy.Globals.Device.dpi / 160));
}

Alloy.Globals.dpToPx = function(dp) {
	return dp * (Ti.Platform.displayCaps.platformHeight / Alloy.Globals.Device.height);
};

Alloy.Globals.pxToDp = function(px) {
	return px * (Alloy.Globals.Device.height / Ti.Platform.displayCaps.platformHeight);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Calculate element dimensions for given screen size
 * @param {Object} size		containing width and height properties
 */
Alloy.Globals.calculateElementDimensions = function(size) {
		
	var layout = {};
	
	// intro
	layout.intro = {};
	layout.intro.clapperTopContainerTop = size.height/2 - 43;
	layout.intro.clapperTopContainerLeft = size.width/2 - 150;
	layout.intro.clapperBottomTop = layout.intro.clapperTopContainerTop + 31;
	layout.intro.clapperBottomLeft = size.width/2 - 50;
	layout.intro.activityViewTop = layout.intro.clapperTopContainerTop + 130;
	
	// options buttons
	layout.optionButtons = {};
	layout.optionButtons.width = size.width / 3;
	layout.optionButtons.height = layout.optionButtons.width * 0.3; 
	
	// form
	layout.overlay = {};
	layout.overlay.width = (size.width > 400) ? 360 : (size.width - 40);
	
	// lists
	layout.lists = {};
	layout.lists.userCell = {};
	layout.lists.userCell.width = size.width - 20;
	layout.lists.userCell.imageLeft = -layout.lists.userCell.width / 6;
	layout.lists.userCell.imageWidth = Math.abs(layout.lists.userCell.imageLeft * 2) + layout.lists.userCell.width;
	layout.lists.userCell.imageHeight = Math.ceil(layout.lists.userCell.imageWidth * 9) / 16;
	
	layout.lists.cell = {};
	layout.lists.cell.width = (size.width - 30) / 2;
	layout.lists.cell.height = layout.lists.cell.width;
	layout.lists.cell.imageTop = -20;
	layout.lists.cell.imageLeft = -layout.lists.cell.width;
	layout.lists.cell.imageWidth = Math.abs(layout.lists.cell.imageLeft * 2) + layout.lists.cell.width;
	layout.lists.cell.imageHeight = Math.ceil(layout.lists.cell.imageWidth * 9) / 16;
	
	// movies list
	layout.list = {};
	layout.list.row = {};
	layout.list.row.width = size.width;
	layout.list.row.height = Math.ceil(size.width / 2.5);
	layout.list.row.imageHeight = Math.ceil((size.width * 9) / 16);
	
	// movie
	layout.movie = {};
	layout.movie.backdropImageLeft = -size.width * 0.15;
	layout.movie.backdropImageWidth = size.width * 1.3;
	layout.movie.backdropImageHeight = Math.ceil((layout.movie.backdropImageWidth * 9) / 16);
	layout.movie.titleTop = (layout.movie.backdropImageHeight * 0.5) + 50;
	layout.movie.detailsTop = 15; 
	layout.movie.posterWidth = Math.ceil(size.width / 3);
	layout.movie.posterHeight = layout.movie.posterWidth * 1.5; 
	layout.movie.infoLeft = layout.movie.posterWidth + 15; 
	layout.movie.infoWidth = size.width - layout.movie.infoLeft - 20;
	layout.movie.linkButtonTop = 40;
	layout.movie.linkButtonWidth = (layout.movie.infoWidth - 10) / 2;
	if (OS_ANDROID) layout.movie.linkButtonWidth -= 1;  
	layout.movie.imdbButtonLeft = layout.movie.infoLeft + layout.movie.linkButtonWidth + 10; 
	layout.movie.synopsisTop = 20;
	
	return layout;
};

// Calculate element dimentsions
Alloy.Globals.layout = Alloy.Globals.calculateElementDimensions(Alloy.Globals.Device);

////////////////////////////////////////////////////////////////////////////////////////////////

