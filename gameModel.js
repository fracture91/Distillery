
/*
Manages all gameModels.
*/
var gameModelManager = new manager();

/*
Holds information about a game.
*/
function gameModel(id, name, logo, storeLink, users) {
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
		return this.__super.equals(other) || other.id == this.id;
	}
}

extend(gameModel, model);