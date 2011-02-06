
/*
Class for a view - something that displays information from a model.
*/

function view(parent, model) {
	employee.call(this);

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
	
	//make sure the model is aware of this view
	this.model.addView(this);

}

view.prototype = {

	/*
	If the view is not already rendered, render it.
	Once rendered, insert it into the page under parent.
	*/
	commit: function() {
		if(!this.ref) {
			this.render();
		}
		this.parent.appendChild(this.ref);
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
	modelChange: function(changes) {
		//very simple implementation, should be overridden by subclasses
		this.render();
	},
	
	//Override
	equals: function(other, ignoreRef) {
		if(this.__super.prototype.equals(other)) {
			return true;
		}
		if(other.model == this.model) {
			if(ignoreRef) return true;
			if(other.ref && this.ref && other.ref == this.ref) return true;
		}
		return false;
	}

}

extend(view, employee);