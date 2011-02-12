
//todo: refresh button
//todo: button to show this user's owned games

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
	
	render: function() {
		if(!this.ref) {
			this.icon = document.createElement("img");
			this.id = document.createElement("h4");
			this.customURL = document.createElement("h6");
			this.id64 = document.createElement("h6");
		}
		
		this.setIcon(this.model.icon);
		this.setId(this.model.id);
		this.setCustomURL(this.model.customURL);
		this.setId64(this.model.id64);
		
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
			this.ref.appendChild(this.info);
			this.ref.appendChild(this.clear);
		}
		
		this.setVisibilityState(this.model.visibilityState);
	},
	
	//Override
	onModelChange: function(source, changes) {
		//only change if it has already been rendered
		if(this.ref) {
			if(changes.icon) this.setIcon(changes.icon);
			if(changes.id) this.setId(changes.id);
			if(changes.customURL) this.setCustomURL(changes.customURL);
			if(changes.id64) this.setId64(changes.id64);
			if(changes.visibilityState) this.setVisibilityState(changes.visibilityState);
		}
	}
	
}

extend(userView, view);