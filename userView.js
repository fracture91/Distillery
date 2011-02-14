
//todo: chat link
//todo: show online state
//todo: wrap profile images with links for keyboard accessibility so you can
//		tab over to an image and press enter to (de)select it
//todo: button to show this user's owned games
//todo: refresh button

/*
Manages all userViews.
*/
var userViewManager = new manager();

/*
Renders the information contained by a userModel.
*/
function userView(parent, model) {
	view.call(this, parent, model);
}

userView.prototype = {
	
	//todo: clean up this ugly rendering stuff
	
	setIcon: function(src) {
		this.icon.src = src || null;
	},
	
	setId: function(id) {
		this.id.innerText = id || null;
	},
	
	setCustomURL: function(url) {
		this.customURL.innerText = url || null;
	},
	
	setId64: function(id64) {
		this.id64.innerText = id64 || null;
	},
	
	setVisibilityState: function(state) {
		if(state != null) this.ref.setAttribute("visibilitystate", state);
		else this.ref.removeAttribute("visibilitystate");
	},
	
	setFetchingUser: function(state) {
		this.ref.setAttribute("fetchinguser", state);
	},
	
	setFetchingGames: function(state) {
		this.ref.setAttribute("fetchinggames", state);
	},
	
	setSelected: function(state) {
		if(state) addClass(this.ref, "selected");
		else removeClass(this.ref, "selected");
	},
	
	setProfileLink: function(url) {
		this.profileLink.href = url;
	},
	
	setOnlineState: function(state) {
		this.ref.setAttribute("onlinestate", state);
	},
	
	render: function() {
		if(!this.ref) {
			this.icon = document.createElement("img");
			this.id = document.createElement("h4");
			this.customURL = document.createElement("h6");
			this.id64 = document.createElement("h6");
			this.profileLink = document.createElement("a");
			this.profileLink.textContent = "Profile";
		}
		
		this.setIcon(this.model.icon);
		this.setId(this.model.id);
		this.setCustomURL(this.model.customURL);
		this.setId64(this.model.id64);
		this.setProfileLink(this.model.profileURL);
		
		if(!this.ref) {
			this.ref = document.createElement("div");
			addClass(this.ref, "user");
			this.info = document.createElement("div");
			this.clear = document.createElement("div");
			addClass(this.clear, "clear");
			this.ref.appendChild(this.icon);
			this.info.appendChild(this.id);
			this.info.appendChild(this.customURL);
			this.info.appendChild(this.id64);
			this.info.appendChild(this.profileLink);
			this.ref.appendChild(this.info);
			this.ref.appendChild(this.clear);
		}
		
		this.setOnlineState(this.model.onlineState);
		this.setVisibilityState(this.model.visibilityState);
		this.setFetchingUser(this.model.fetchingUser);
		this.setFetchingGames(this.model.fetchingGames);
		this.setSelected(this.model.selected);
	},
	
	//Override
	onModelChange: function(source, changes) {
		//only change if it has already been rendered
		if(this.ref) {
			if(changes.icon) this.setIcon(changes.icon);
			if(changes.id) this.setId(changes.id);
			if(changes.customURL) this.setCustomURL(changes.customURL);
			if(changes.id64) this.setId64(changes.id64);
			if(changes.customURL || changes.id64) {
				this.model.customURL = changes.customURL || this.model.customURL;
				this.model.id64 = changes.id64 || this.model.id64;
				this.setProfileLink(this.model.profileURL);
				}
			if(changes.visibilityState) this.setVisibilityState(changes.visibilityState);
			if(defined(changes.fetchingUser)) this.setFetchingUser(changes.fetchingUser);
			if(defined(changes.fetchingGames)) this.setFetchingGames(changes.fetchingGames);
			if(defined(changes.selected)) this.setSelected(changes.selected);
			if(defined(changes.onlineState)) this.setOnlineState(changes.onlineState);
		}
	}
	
}

extend(userView, view);