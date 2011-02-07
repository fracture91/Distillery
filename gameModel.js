
/*
Manages all gameModels.
All gameModels elsewhere in the app should point to objects in this manager.
*/
var gameModelManager = new manager();

/*
Holds information about a game.
*/
function gameModel(id, name, logo, storeLink) {
	model.call(this);

	this.id = id;
	this.name = name;
	this.logo = logo;
	this.storeLink = storeLink;
	
	/*
	Users who own this game - managed userModels.
	*/
	this.users = new manager();
}

gameModel.prototype = {
	//Override
	equals: function(other) {
		return model.prototype.equals(other) || other.id == this.id;
	}
}

extend(gameModel, model);