
/*
Manages all userModels.
*/
var userModelManager = new manager();

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
		return this.__super.equals(other) || 
				other.customURL == this.customURL ||
				other.id64 == this.id64;
	},
	
	profileURLPrefix: "http://steamcommunity.com/",
	profileURLId: "id/",
	profileURLProfile: "profile/",
	profileURLGames: "games?tab=all",
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
	}

}

extend(userModel, model);