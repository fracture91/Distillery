
/*
An aggregate for the list of selected users.
Does not actually render itself - all necessary HTML is already under this.ref.
Should not be instantiated until the document is ready.
*/
function selectedPanel() {
	var ref = document.getElementById("selected");
	//the model will be a manager of userModels
	aggregate.call(this, ref.parentNode, new manager(), new manager());
	
	this.ref = ref;
	this.content = this.ref.getElementsByClassName("content")[0];
	
	var that = this;
	
	//todo: validation
	//add the inputted user
	this.ref.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
		e.preventDefault();
		var input = e.target.getElementsByTagName("input")[0];
		var val = input.value;
		var model = userModel.prototype.modelFromString(val);
		that.model.add(userModelManager.add(model));
		input.value = "";
	}, false);
	
	//remove a user when they're clicked on
	this.content.addEventListener("click", function(e) {
		var target = e.target;
		if(target) {
			if(target.tagName=="DIV" || target.tagName=="IMG" && (target = target.parentNode)) {
				var view = that.findChildByRef(target);
				if(view) {
					e.preventDefault();
					that.model.remove(view.model);
				}
			}
		}
	}, false);

}

selectedPanel.prototype = {

	select: function(model) {
		model.select();
		gamesPanel.model.addMany(model.games.employees);
	},

	//Override
	onModelAdd: function(source, model) {
		var view = this.children.add(userViewManager.add(new userView(this.content, model)));
		view.commit();
		this.content.scrollTop = this.content.scrollHeight;
		
		if(model.games.employees.length==0) {
			var that = this;
			Net.getUserGames(model, function(xhr) {
				var employees = model.games.employees;
				for(var i=0, len=employees.length; i<len; i++)
					employees[i].users.add(model);
				//make sure this user wasn't removed in the meantime
				if(that.model.find(model)) {
					that.select(model);
				}
			});
		}
		else {
			this.select(model);
		}
	},
	
	//Override
	onModelRemove: function(source, model) {
		var view = this.children.remove(userViewManager.remove(this.findChildByModel(model)));
		model.deselect();
		
		//remove all of this user's games which no longer have any selected users
		var toRemove = [];
		var employees = model.games.employees;
		for(var i=0, len=employees.length; i<len; i++)
			if(employees[i].selectedUsersLength==0)
				toRemove.push(employees[i]);
		gamesPanel.model.removeMany(toRemove);

		view.uncommit();
	},

}

extend(selectedPanel, aggregate);
