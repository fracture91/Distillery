
//todo: "fetching" property that indicates info is being fetched from network

/*
Class for a model - holds some information which a view can then display.
Note that a model might not hold all necessary information when it's used -
you might have to wait for communication over the network, for example.
*/
function model() {
	observable.call(this);
}

model.prototype = {
	
	/*
	All changes to the model should go through this function.
	changes should be an object where properties match properties of this model,
	and their values are new values to set the model properties to.
	For example, passing {a: 1, b: 2} would essentially do model.a=1 and model.b=2 .
	modelChange event is fired with proposed changes before actually changing the model.
	*/
	change: function(changes) {
		this.event("modelChange", this, changes);
		for(var i in changes)
			this[i] = changes[i];
	}
	
}

extend(model, observable);
