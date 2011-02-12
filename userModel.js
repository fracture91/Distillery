
//todo: "selected" property

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
function userModel(customURL, id64, id, icon, visibilityState) {
	model.call(this);

	this.customURL = customURL;
	this.id64 = id64;
	this.id = id;
	this.icon = icon;
	
	/*
	3 - friendsonly, I'm a friend
		public
		private, it's me

	2 - friendsonly, I'm not a friend

	1 - private, I'm not me
	*/
	this.visibilityState = visibilityState || null;
	
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
	
	modelFromString: function(str) {
		
		if(/\d{17}/.test(str)) {
			return new userModel(undefined, str);
		}
		else {
			return new userModel(str);
		}
		
	},
	
	/*
	For each game in this.games, add this to game.selectedUsers.
	*/
	select: function() {
		var employees = this.games.employees;
		for(var i=0, len=employees.length; i<len; i++) {
			employees[i].selectedUsers.add(this);
		}
	},
	
	/*
	For each game in this.games, remove this from game.selectedUsers.
	*/
	deselect: function() {
		var employees = this.games.employees;
		for(var i=0, len=employees.length; i<len; i++) {
			employees[i].selectedUsers.remove(this);
		}
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