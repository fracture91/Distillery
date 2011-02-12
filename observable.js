
/*
Class for an observable - has observers which it can notify about events.
*/
function observable() {
	employee.call(this);
	
	/*
	An array of things observing this observable.
	Let this observable know what's watching it so it can notify them of events.
	*/
	var observers = [];
	this.__defineGetter__("observers", function(){ return observers });
	
}

observable.prototype = {

	/*
	Add the given observer to this observable's list of observers.
	The observer will be notified of any events that happen on the observable.
	*/
	listen: function(observer) {
		if(this.observers.indexOf(observer)==-1) this.observers.push(observer);
	},
	
	/*
	Fire an event with the given type and source object.
	Doing this will call the method "onType" for each observer if it exists.
	Args will be passed along preceeded by the event source to this method.
	The source can be useful if listening to multiple things which can fire the same event.
	*/
	event: function(type, source /*, args*/) {
		//no point in doing any work if there aren't any observers
		if(this.observers.length > 0) {
		
			if(!defined(source)) {
				source = this;
			}
			type = type[0].toUpperCase() + type.substring(1);
			var args = Array.prototype.slice.call(arguments, 2);
			args.unshift(source);
			
			this.observers.forEach(function(obs) {
				var handler = obs["on" + type];
				if(typeof handler == "function") {
					handler.apply(obs, args);
				}
			});
			
		}
		
	}
	
}

extend(observable, employee);
