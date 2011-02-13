
/*
An aggregate for simpleUserViews and a manager of userModels.
Used to show ownership of games.
*/
function simpleUserAggregate(parent, models) {
	aggregate.call(this, parent, models, new manager());

	//get children going for models that are already here
	var users = this.model.employees;
	for(var i=0, len=users.length; i<len; i++) {
		this.onModelAdd(this.model, users[i]);
	}
	
}

simpleUserAggregate.prototype = {

	onModelAdd: function(source, model) {
		this.renderMe();
		this.children.add(new simpleUserView(this.ref, model)).commit();
	},
	
	onModelRemove: function(source, model) {
		this.children.remove(this.findChildByModel(model)).uncommit();
	},
	
	renderMe: function() {
		if(!this.ref) {
			this.ref = document.createElement("ul");
		}
	},
	
	render: function() {
		this.renderMe();
		aggregate.prototype.render.call(this);
	},
	
	commit: function() {
		view.prototype.commit.call(this);
		aggregate.prototype.commit.call(this);
	},
	
	uncommit: function() {
		view.prototype.uncommit.call(this);
		aggregate.prototype.uncommit.call(this);
	}

}

extend(simpleUserAggregate, aggregate);

/*
A user view that is just a list item with the "best name" as its innerText.
*/
function simpleUserView(parent, model) {
	view.call(this, parent, model);

}

simpleUserView.prototype = {

	setName: function(name) {
		this.ref.innerText = name;
	},

	render: function() {
		if(!this.ref) {
			this.ref = document.createElement("li")
		}
		this.setName(this.model.bestName);
	},
	
	onModelChange: function(source, changes) {
		if(this.ref) {
			if(defined(changes.id) || defined(changes.id64) || defined(changes.customURL)) {
				//yucky
				var newObj = {};
				newObj.id = defined(changes.id) ? changes.id : this.model.id;
				newObj.id64 = defined(changes.id64) ? changes.id64 : this.model.id64;
				newObj.customURL = defined(changes.customURL) ? changes.customURL : this.model.customURL;
				this.setName(this.model.__lookupGetter__("bestName").call(newObj));
			}
		}
	}

}

extend(simpleUserView, view);