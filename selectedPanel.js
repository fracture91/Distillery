
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
	
	//get the friends list of the id64/customURL that was inputted
	this.ref.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
		e.preventDefault();
		var input = e.target.getElementsByTagName("input")[0];
		var val = input.value;
		var model = userModel.prototype.modelFromString(val);
		that.model.add(userModelManager.add(model));
		input.value = "";
	}, false);
	
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

	//Override
	modelAdd: function(model) {
		var view = this.children.add(userViewManager.add(new userView(this.content, model)));
		view.commit();
		if(model.games.employees.length==0) {
			var that = this;
			Net.getUserGames(model, function(xhr) {
				var employees = model.games.employees;
				for(var i=0, len=employees.length; i<len; i++)
					employees[i].users.add(model);
				//make sure this user wasn't removed in the meantime
				if(that.model.find(model)) {
					model.select();
					gamesPanel.addGames(model.games);
					resize(window);
				}
			});
		}
		else {
			model.select();
			gamesPanel.addGames(model.games);
			resize(window);
		}
	},
	
	//Override
	modelRemove: function(model) {
		var view = this.children.remove(userViewManager.remove(this.findChildByModel(model)));
		model.deselect();
		//remove all of this user's games which no longer have any selected users
		var employees = model.games.employees;
		for(var i=0, len=employees.length; i<len; i++)
			if(employees[i].selectedUsersLength==0)
				gamesPanel.model.remove(employees[i]);
		view.uncommit();
		resize(window);
	}

}

extend(selectedPanel, aggregate);
