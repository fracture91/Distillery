
/*
An aggregate for the list of owned games.
Does not actually render itself - all necessary HTML is already under this.ref.
Should not be instantiated until the document is ready.
*/
function gamesPanel() {
	var ref = document.getElementById("games");
	//the model will be a manager of gameModels
	aggregate.call(this, ref.parentNode, new manager(), new manager());
	
	this.ref = ref;
	this.content = this.ref.getElementsByClassName("content")[0];

}

gamesPanel.prototype = {

	/*
	Compare by how many selected users own this game.
	*/
	compareSelectedUsersLength: function(view1, view2) {
		return view2.model.selectedUsers.employees.length -
				view1.model.selectedUsers.employees.length;
	},
	
	/*
	Compare by the name of the game.
	*/
	compareName: function(view1, view2) {
		return view1.model.name.localeCompare(view2.model.name);
	},
	
	/*
	Compare by selectedUsersLength, then by name
	*/
	defaultCompare: function(view1, view2) {
		var cmp = this.compareSelectedUsersLength(view1, view2);
		if(cmp != 0) return cmp;
		return this.compareName(view1, view2);
	},

	/*
	Sort the gamePanel's children using this.defaultCompare.
	*/
	sort: function() {
		this.uncommit();
		var employees = this.children.employees;
		var that = this;
		employees.sort(function(view1, view2){
			return that.defaultCompare(view1, view2);
			});
		this.commit();
	},

	/*
	Given a manager of gameModels, add each managed gameModel to this.model.
	*/
	addGames: function(games) {
		var employees = games.employees;
		for(var i=0, len=employees.length; i<len; i++)
			this.model.add(employees[i]);
	},

	//Override
	modelAdd: function(model) {
		var view = this.children.add(gameViewManager.add(new gameView(this.content, model)));
		this.sort();
		view.commit();
	},
	
	//Override
	modelRemove: function(model) {
		var view = this.children.remove(gameViewManager.remove(this.findChildByModel(model)));
		this.sort();
		view.uncommit();
	}

}

extend(gamesPanel, aggregate);
