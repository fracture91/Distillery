
/*
Class for a view - something that displays information from a model.
*/

function view(parent, model) {
	observable.call(this);

	/*
	The parent element in the DOM that this view will be appended to.
	*/
	this.parent = parent;
	
	/*
	The model this view is associated with.
	Many views can point to the same model.
	*/
	this.model = model;
	
	/*
	A reference to the DOM element that makes up this view.
	If the view has not been rendered, this is equal to null.
	*/
	this.ref = null;
	
	//listen for events from the model
	this.model.listen(this);

}

view.prototype = {

	/*
	If the view is not already rendered, render it.
	Once rendered, if not already inserted, insert it into the document under parent.
	*/
	commit: function() {
		if(!this.ref) {
			this.render();
		}
		if(this.ref.parentNode != this.parent) {
			this.parent.appendChild(this.ref);
			}
	},
	
	/*
	If the view has been committed, remove it from the document.
	*/
	uncommit: function() {
		if(this.ref && this.ref.parentNode == this.parent) {
			this.parent.removeChild(this.ref);
			}
	},

	/*
	Create all necessary DOM stuff to display this view, but do not actually insert it into the document.
	this.ref must != null when this is done.
	*/
	render: function() {
		//very simple implementation, should be overridden by subclasses
		if(!this.ref) this.ref = document.createElement("div");
		this.ref.innerText = "";
		for(var i in this.model) this.ref.innerText += this.model[i] + " ";
	},

	/*
	When the model is changed, this will eventually be called.
	View should render any changes.
	*/
	onModelChange: function(source, changes) {
		//very simple implementation, should be overridden by subclasses
		this.render();
	},
	
	/*
	If the model is a manager, this will be called when something is added.
	model is the model that was added.
	View should render any changes.
	*/
	onModelAdd: function(source, model) {
		this.render();
	},
	
	/*
	If the model is a manager, this will be called when something is removed.
	model is the model that was removed.
	View should render any changes.
	*/
	onModelRemove: function(source, model) {
		this.render();
	},
	
	get error() {
		return this._errorStr;
	},
	
	/*
	Set this to indicate an error has occurred.
	*/
	set error(str) {
		str = str==Net.profileNotFoundError ? Net.profileNotFoundDisplay : str;
		this._errorStr = str;
		this.errorHandler(str)
	},
	
	/*
	Called by the error setter and passed the error message.
	Should be overridden.
	*/
	errorHandler: function(str) {
		//do nothing
	},
	
	//Override
	equals: function(other, ignoreRef) {
		if(employee.prototype.equals.call(this, other)) {
			return true;
		}
		if(!other.model) return false;
		if(other.model.equals(this.model)) {
			if(ignoreRef) return true;
			if(other.ref && this.ref && other.ref == this.ref) return true;
		}
		return false;
	}

}

extend(view, observable);