
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

	addGames: function(games) {
		var employees = games.employees;
		for(var i=0, len=employees.length; i<len; i++)
			this.model.add(employees[i]);
	},

	//Override
	modelAdd: function(model) {
		var view = this.children.add(gameViewManager.add(new gameView(this.content, model)));
		view.commit();
	},
	
	//Override
	modelRemove: function(model) {
		var view = this.children.remove(gameViewManager.remove(this.findChildByModel(model)));
		view.uncommit();
	}

}

extend(gamesPanel, aggregate);
