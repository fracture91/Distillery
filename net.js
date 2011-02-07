
/*
Singleton for doing stuff on the network.
*/
var Net = new function() {

	/*
	A simple wrapper for XMLHttpRequest.
	Similar to GM_xmlhttprequest.
	*/
	this.XMLHttpRequest = function(details) {
		var xhr = new XMLHttpRequest();
		xhr.open(details.method, details.url, true);
		
		if(details.headers) {
			for(var i in details.headers)
				xhr.setRequestHeader(i, details.headers[i]);
		}
		
		xhr.onreadystatechange = function() {
			
			if(details.onreadystatechange) {
				details.onreadystatechange(xhr);
			}
			
			if(xhr.readyState == 4) {
				if(details.onload && xhr.status == 200) {
					details.onload(xhr);
				}
				else if(details.onerror && xhr.status != 200) {
					details.onerror(xhr);
				}
			}
		}
		
		xhr.send(details.data);
	}

	this.getUserModel = function(model, callback) {
		
		if(typeof callback != "function") {
			callback = function(){};
		}
		
		this.XMLHttpRequest({
			method: "GET",
			url: model.profileURLXML,
			onload: function(xhr) {
				var xml = xhr.responseXML;
				if(xml) {
					Parse.userModelXML(model, xml.documentElement);
				}
				callback(xhr);
			},
			onerror: function(xhr) {
				callback(xhr);
			}
		});
	
	}
	
	this.getUserFriends = function(model, manager, callback) {
		
		if(typeof callback != "function") {
			callback = function(){};
		}
		
		this.XMLHttpRequest({
			method: "GET",
			url: model.friendsURLXML,
			onload: function(xhr) {
				var xml = xhr.responseXML;
				if(xml) {
					Parse.friendsXML(manager, xml.documentElement);
				}
				callback(xhr);
			},
			onerror: function(xhr) {
				callback(xhr);
			}
		});
		
	}
	
	this.getUserGames = function(model, callback) {
	
		if(typeof callback != "function") {
			callback = function(){};
		}
		
		this.XMLHttpRequest({
			method: "GET",
			url: model.gamesURLXML,
			onload: function(xhr) {
				var xml = xhr.responseXML;
				if(xml) {
					Parse.gamesXML(model.games, xml.documentElement);
				}
				callback(xhr);
			},
			onerror: function(xhr) {
				callback(xhr);
			}
		});
	
	}

}