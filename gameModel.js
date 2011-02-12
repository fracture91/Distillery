
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
	
	/*
	Users who own this game and are selected.
	*/
	this.selectedUsers = new manager();
	//listen for changes in selectedUsers so we can keep track of length
	this.selectedUsers.listen(this);
	
	/*
	The length of this.selectedUsers.
	*/
	this.selectedUsersLength = 0;
	
	//todo: make games aware of selected users which don't own them

}

gameModel.prototype = {
	//Override
	equals: function(other) {
		return model.prototype.equals(other) || other.id == this.id;
	},
	
	onModelAdd: function(source, model) {
		//a user was added to this.selectedUsers - increment length
		this.change({selectedUsersLength: this.selectedUsersLength+1});
	},
	
	onModelRemove: function(source, model) {
		//a user was removed from this.selectedUsers - decrement length
		this.change({selectedUsersLength: this.selectedUsersLength-1});
	}
	
}

extend(gameModel, model);