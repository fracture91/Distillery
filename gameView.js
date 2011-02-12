
//todo: allow user to display selected users who own and don't own this game
//todo: show how many selected users don't own this game, style based on this number (e.g. 0 is greenish, 1 is yellow, etc.)

/*
Manages all gameViews.
*/
var gameViewManager = new manager();

/*
Renders the information contained by a gameModel.
*/
function gameView(parent, model) {
	view.call(this, parent, model);
}

gameView.prototype = {
	
	//todo: clean up this ugly rendering stuff
	
	setLogo: function(url) {
		this.logo.src = url || null;
	},
	
	setId: function(id) {
		this.id.innerText = id || null;
	},
	
	setName: function(name) {
		this.name.innerText = name || null;
	},
	
	setStoreLink: function(url) {
		this.storeLink.href = url || null;
	},
	
	setSharedAmong: function(num) {
		this.sharedAmong.setAttribute("sharedamong", num);
	},
	
	render: function() {
		if(!this.ref) {
			this.logo = document.createElement("img");
			this.name = document.createElement("h4");
			this.storeLink = document.createElement("a");
			this.storeLink.innerText = "Store Page";
			this.id = document.createElement("h6");
			this.sharedAmong = document.createElement("h5");
		}
		
		this.setLogo(this.model.logo);
		this.setName(this.model.name);
		this.setStoreLink(this.model.storeLink);
		this.setId(this.model.id);
		this.setSharedAmong(this.model.selectedUsersLength);
		
		if(!this.ref) {
			this.ref = document.createElement("div");
			addClass(this.ref, "game");
			this.info = document.createElement("div");
			this.clear = document.createElement("div");
			addClass(this.clear, "clear");
			this.ref.appendChild(this.logo);
			this.info.appendChild(this.name);
			this.info.appendChild(this.storeLink);
			this.info.appendChild(this.id);
			this.info.appendChild(this.sharedAmong);
			this.ref.appendChild(this.info);
			this.ref.appendChild(this.clear);
		}
	},
	
	//Override
	onModelChange: function(source, changes) {
		//only change if it has already been rendered
		if(this.ref) {
			if(changes.logo) this.setLogo(changes.logo);
			if(changes.name) this.setName(changes.name);
			if(changes.storeLink) this.setStoreLink(changes.storeLink);
			if(changes.id) this.setId(changes.id);
			if(defined(changes.selectedUsersLength)) this.setSharedAmong(changes.selectedUsersLength);
		}
	}
	
}

extend(gameView, view);