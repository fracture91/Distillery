
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
	
	/*
	Users who are selected but don't own this game.
	*/
	this.selectedUsersLacking = new manager();
	this.selectedUsersLacking.listen(this);
	
	/*
	The length of this.selectedUsersLacking.
	*/
	this.selectedUsersLackingLength = 0;

}

gameModel.prototype = {
	//Override
	equals: function(other) {
		return model.prototype.equals(other) || other.id == this.id;
	},
	
	onModelAdd: function(source, model) {
		if(source == this.selectedUsers) {
			//a user was added to this.selectedUsers - increment length
			this.change({selectedUsersLength: this.selectedUsersLength+1});
		}
		else if(source == this.selectedUsersLacking) {
			//a user was added to this.selectedUsersLacking - increment length
			this.change({selectedUsersLackingLength: this.selectedUsersLackingLength+1});
		}
	},
	
	onModelRemove: function(source, model) {
		if(source == this.selectedUsers) {
			//a user was removed from this.selectedUsers - decrement length
			this.change({selectedUsersLength: this.selectedUsersLength-1});
		}
		else if(source == this.selectedUsersLacking) {
			//a user was removed from this.selectedUsersLacking - decrement length
			this.change({selectedUsersLackingLength: this.selectedUsersLackingLength-1});
		}
	}
	
}

extend(gameModel, model);