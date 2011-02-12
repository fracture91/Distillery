
/*
An aggregate is kind of a collection of views and models.
It is primarily a view based on a models manager, but it also controls its own views.
It should be used when you want to have some functionality on top of a bunch of views
and when you want to keep track of your own views.
For example, a friends list (userModels and userViews) that can get friends for a certain user.

parent is parent as defined in view, models is a model that should be a manager,
children is this.children.
*/
function aggregate(parent, models, children) {
	view.call(this, parent, models);
	
	/*
	The child views of this aggregate.
	Probably correspond with models in this.model.
	*/
	this.children = children;
	
}

aggregate.prototype = {
	
	/*
	Given a model, find a child view with that model.
	*/
	findChildByModel: function(model) {
		var employees = this.children.employees;
		for(var i=0, len=employees.length; i<len; i++)
			if(employees[i].model.equals(model))
				return employees[i];
	},
	
	/*
	Given a reference to a DOM element, find a child view with that ref.
	*/
	findChildByRef: function(ref) {
		var employees = this.children.employees;
		for(var i=0, len=employees.length; i<len; i++)
			if(employees[i].ref == ref)
				return employees[i];
	},
	
	//Override
	commit: function(){
		var employees = this.children.employees;
		for(var i=0, len=employees.length; i<len; i++)
			employees[i].commit();
	},
	
	//Override
	uncommit: function(){
		var employees = this.children.employees;
		for(var i=0, len=employees.length; i<len; i++)
			employees[i].uncommit();
	},
	
	//Override
	render: function() {
		var employees = this.children.employees;
		for(var i=0, len=employees.length; i<len; i++)
			employees[i].render();
	}

}

extend(aggregate, view);