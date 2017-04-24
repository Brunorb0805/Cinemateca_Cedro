/**
 * Global Navigation Handler
 */
Alloy.Globals.Navigator = {

	/**
	 * Handle to the Navigation Controller
	 */
	navGroup: $.nav,

	open: function(controller, payload){
		var win = Alloy.createController(controller, payload || {}).getView();

		// added this property to the payload to know if the window is a child
		if (payload.displayHomeAsUp){
			win.addEventListener('open',function(evt){
				var activity=win.activity;
				activity.actionBar.displayHomeAsUp=payload.displayHomeAsUp;
				activity.actionBar.onHomeIconItemSelected=function(){
					if(payload.backto == "false") {
						evt.source.close();
					} else {
						var loadingView = Alloy.createController(payload.backto);
						loadingView.getView().open();
						evt.source.close();
					}
				};
			});
			win.addEventListener('androidback', function(){
				var loadingView = Alloy.createController(payload.backto);
				loadingView.getView().open();
			    win.close();
			});
		}
		win.open();		
	}
};


/** Open appropriate start window **/

var loadingView = Alloy.createController("watched");
loadingView.getView().open();