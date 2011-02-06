
/*
Manages all userModels.
All userModels elsewhere in the app should point to objects in this manager.
*/
function userModelManager() {
	manager.call(this);

}

userModelManager.prototype = {
	//Override
	add: function(employee) {
		newEmployee = manager.prototype.add.call(this, employee);
		if(newEmployee.equals(employee)) {
			//the added user didn't already exist - we should request more info from network
			Net.getUserModel(newEmployee);
		}
		return newEmployee;
	}
}

extend(userModelManager, manager);

//it's now a singleton
userModelManager = new userModelManager();

/*
Holds information about a user.
*/
function userModel(customURL, id64, id, icon, games) {
	model.call(this);

	this.customURL = customURL;
	this.id64 = id64;
	this.id = id;
	this.icon = icon;
	
	/*
	Games this user owns - managed gameModels.
	*/
	this.games = new manager();
}

userModel.prototype = {
	
	//Override
	equals: function(other) {
		return model.prototype.equals.call(this, other) || 
				(defined(other.customURL) && defined(this.customURL) && other.customURL == this.customURL) ||
				(defined(other.id64) && defined(this.id64) && other.id64 == this.id64);
	},
	
	profileURLPrefix: "http://steamcommunity.com/",
	profileURLId: "id/",
	profileURLProfile: "profiles/",
	profileURLGames: "games?tab=all",
	profileURLFriends: "/friends",
	xmlIndicator: "xml=1",
	
	get profileURL() {
	
		var url = this.profileURLPrefix;
		if(this.customURL) {
			url += this.profileURLId + this.customURL;
		}
		else if(this.id64) {
			url += this.profileURLProfile + this.id64;
		}
		
		return url;
	
	},
	
	get profileURLXML() {
		return this.profileURL + "?" + this.xmlIndicator;
	},
	
	get gamesURL() {
		return this.profileURL + "/" + this.profileURLGames;
	},
	
	get gamesURLXML() {
		return this.gamesURL + "&" + this.xmlIndicator;
	},
	
	get friendsURL() {
		return this.profileURL + this.profileURLFriends;
	},
	
	get friendsURLXML() {
		return this.friendsURL + "?" + this.xmlIndicator;
	}

}

extend(userModel, model);