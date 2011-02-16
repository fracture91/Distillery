
//todo: bookmark groups of selected users

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
	
	this.selectUserForm = this.ref.getElementsByTagName("form")[0];
	this.selectUserInput = this.selectUserForm.getElementsByTagName("input")[0];
	this.clearButton = this.selectUserForm.getElementsByTagName("input")[2];
	this.invalidStr = friendsPanel.invalidStr;
	
	var that = this;
	
	//add the inputted user
	this.selectUserForm.addEventListener("submit", function(e) {
		e.preventDefault();
		var val = that.selectUserInput.value;
		var model = userModel.prototype.modelFromString(val);
		if(model) {
			that.model.add(userModelManager.add(model));
		}
		that.selectUserInput.value = model ? "" : that.invalidStr;
	}, false);
	
	this.selectUserInput.addEventListener("focus", friendsPanel.clearInputHandler, false);
	this.selectUserInput.addEventListener("click", friendsPanel.clearInputHandler, false);
	this.selectUserInput.addEventListener("keydown", friendsPanel.clearInputHandler, false);
	
	this.clearButton.addEventListener("click", function(e) {
		/*
		This can take a while if there are tons of users...
		I tried writing a faster way to do it but it was only faster for very large sets
		of selected users (probably by 50 users).
		The chances of anyone seriously using this app to check common games between >50
		people are pretty slim, I would think, so I'm going with the clearer solution.
		*/
		that.model.clear();
	}, false);
	
	//remove a user when they're clicked on
	this.content.addEventListener("click", function(e) {
		var target = e.target;
		if(target) {
			if(target.tagName=="INPUT" && (target = target.parentNode)) {
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
		//for each game in gamesPanel, if this user isn't in selectedUsers, then add him to lacking
		var games = gamesPanel.model.employees;
		for(var i=0, len=games.length; i<len; i++) {
			if(!games[i].selectedUsers.find(model)) {
				games[i].selectedUsersLacking.add(model);
			}
		}
	},

	//Override
	onModelAdd: function(source, model) {
		var view = this.children.add(userViewManager.add(new userView(this.content, model)));
		view.model.change({selected: true});
		view.commit();
		this.content.scrollTop = this.content.scrollHeight;
		
		if(!model.fetchingGames && model.games.employees.length==0) {
			var that = this;
			model.change({fetchingGames: true});
			Net.getUserGames(model, function(xhr) {
				var employees = model.games.employees;
				for(var i=0, len=employees.length; i<len; i++)
					employees[i].users.add(model);
				model.change({fetchingGames: false});
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
		
		//remove this model from each game's list of lacking users
		var games = gamesPanel.model.employees;
		for(var i=0, len=games.length; i<len; i++) {
			games[i].selectedUsersLacking.remove(model);
		}
		
		//remove all of this user's games which no longer have any selected users
		var toRemove = [];
		var employees = model.games.employees;
		for(var i=0, len=employees.length; i<len; i++)
			if(employees[i].selectedUsersLength==0)
				toRemove.push(employees[i]);
		gamesPanel.model.removeMany(toRemove);

		view.uncommit();
		view.model.change({selected: false});
	},

}

extend(selectedPanel, aggregate);
