
/*
Class for a model - holds some information which a view can then display.
*/
function model() {
	employee.call(this);
	
	/*
	An array of views.
	Let this model know which views are using it so it can notify them of changes.
	*/
	var views = [];
	this.__defineGetter__("views", function(){ return views });
	
}

model.prototype = {

	/*
	When a view uses this model, it should call this function and pass itself
	so when the model changes the view will be notified.
	Of course, if the view doesn't want to be notified then it doesn't have to do this.
	*/
	addView: function(view) {
		if(this.views.indexOf(view)==-1) this.views.push(view);
	},
	
	/*
	All changes to the model should go through this function.
	changes should be an object where properties match properties of this model,
	and their values are new values to set the model properties to.
	For example, passing {a: 1, b: 2} would essentially do model.a=1 and model.b=2 .
	Observing views will have changes passed to view.onModelChange.
	Only after all views have been notified of changes will the properties on the actual model be changed.
	*/
	change: function(changes) {
		for(var i=0, len=this.views.length; i<len; i++)
			this.views[i].modelChange(changes);
		for(var i in changes)
			this[i] = changes[i];
	}
	
}

extend(model, employee);
