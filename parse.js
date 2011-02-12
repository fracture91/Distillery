
/*
Singleton for parsing stuff.
*/
var Parse = new function() {

	this.getFirstByTagName = function(source, name) {
		source = source.getElementsByTagName(name);
		if(source) source = source[0];
		return source || null;
	}

	this.getContent = function(el) {
		if(el) el = el.firstChild;
		if(el) el = el.nodeValue;
		return el || null;
	}
	
	this.getFirstContentByTagName = function(source, name) {
		source = this.getFirstByTagName(source, name);
		if(source) source = this.getContent(source);
		return source || null;
	}

	//userModel properties and their corresponding XML tags
	var userModelXMLData = {
		id: "steamID",
		id64: "steamID64",
		customURL: "customURL",
		icon: "avatarMedium",
		visibilityState: "visibilityState"
	}
	
	/*
	Given an XML documentElement, parse data into the given userModel.
	*/
	this.userModelXML = function(model, xml) {
		
		if(!xml) return -1;
		
		var changes = {};
		for(var i in userModelXMLData) {
			data = this.getFirstContentByTagName(xml, userModelXMLData[i]);
			if(data) changes[i] = data;
			}
			
		model.change(changes);
		
	}
	
	/*
	Given an xml documentElement, add friends to the given manager.
	*/
	this.friendsXML = function(manager, xml) {
	
		var friends = this.getFirstByTagName(xml, "friends");
		if(friends) friends = friends.getElementsByTagName("friend");
		if(friends) {
			for(var i=0, len=friends.length; i<len; i++) {
				var content = this.getContent(friends[i]);
				//friends are only indicated by id64
				if(content) manager.add(userModelManager.add(new userModel(undefined, content)));
			}
		}
	
	}
	
	/*
	Given an xml documentElement, add games in the document to the given manager as gameModels.
	*/
	this.gamesXML = function(manager, xml) {
	
		var games = this.getFirstByTagName(xml, "games");
		if(games) games = games.getElementsByTagName("game");
		if(games) {
			for(var i=0, len=games.length; i<len; i++) {
				var thisGame = games[i];
				manager.add(gameModelManager.add(new gameModel(
					this.getFirstContentByTagName(thisGame, "appID"),
					this.getFirstContentByTagName(thisGame, "name"),
					this.getFirstContentByTagName(thisGame, "logo"),
					this.getFirstContentByTagName(thisGame, "storeLink")
				)));
			}
		}
	
	}

}