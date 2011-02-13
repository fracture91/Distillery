
/*
Manages all userModels.
All userModels elsewhere in the app should point to objects in this manager.
*/
function userModelManager() {
	manager.call(this);
	//listen to myself so I can hear events fired by manager
	this.listen(this);
}

userModelManager.prototype = {
	
	onModelAdd: function(source, model) {
		//the added user didn't already exist - we should request more info from network
		model.change({fetchingUser: true});
		Net.getUserModel(model, function(xhr){
			model.change({fetchingUser: false});
		});
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
	Indicates info is being fetched from network.
	*/
	this.fetchingUser = false;
	this.fetchingGames = false;
	
	/*
	Indicates that this user has been selected (intended for cosmetic use).
	Not to be confused with this.select().
	*/
	this.selected = false;
	
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
	
	get bestName() {
		if(defined(this.id) && this.id!="") return this.id;
		if(defined(this.customURL) && this.customURL!="") return this.customURL;
		if(defined(this.id64) && this.id64!="") return this.id64;
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
	
	profileURLPrefix: "https://steamcommunity.com/",
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