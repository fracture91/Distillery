
//todo: recommend button

/*
Manages all gameViews.
*/
var gameViewManager = new manager();

/*
Renders the information contained by a gameModel.
*/
function gameView(parent, model) {
	view.call(this, parent, model);
	
	var showOwnership = false;
	this.__defineGetter__("showOwnership", function() { return showOwnership });
	this.__defineSetter__("showOwnership", function(b) { 
		if(b!=showOwnership) {
			this.toggleShowOwnership();
			showOwnership = !showOwnership;
		}
	});
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
		this.ref.setAttribute("sharedamong", num);
	},
	
	setNotSharedAmong: function(num) {
		this.sharedAmong.setAttribute("notsharedamong", num);
		this.ref.setAttribute("notsharedamong", num);
	},
	
	render: function() {
		if(!this.ref) {
			this.logo = document.createElement("img");
			this.name = document.createElement("h4");
			this.storeLink = document.createElement("a");
			this.storeLink.innerText = "Store Page";
			this.id = document.createElement("h6");
		}
		
		this.setLogo(this.model.logo);
		this.setName(this.model.name);
		this.setStoreLink(this.model.storeLink);
		this.setId(this.model.id);
		
		if(!this.ref) {
			this.ref = document.createElement("div");
			addClass(this.ref, "game");
			this.info = document.createElement("div");
			this.clear = document.createElement("div");
			addClass(this.clear, "clear");
			this.sharedAmong = document.createElement("a");
			this.sharedAmong.href = "";
			this.ownership = document.createElement("div");
			addClass(this.ownership, "ownership");
			this.ref.appendChild(this.logo);
			this.info.appendChild(this.name);
			this.info.appendChild(this.storeLink);
			this.info.appendChild(this.id);
			this.info.appendChild(this.sharedAmong);
			this.ref.appendChild(this.info);
			this.ref.appendChild(this.ownership);
			this.ref.appendChild(this.clear);
		}
		
		this.setSharedAmong(this.model.selectedUsersLength);
		this.setNotSharedAmong(this.model.selectedUsersLackingLength);
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
			if(defined(changes.selectedUsersLackingLength)) this.setNotSharedAmong(changes.selectedUsersLackingLength);
		}
	},
	
	/*
	Helper for the showOwnership getter.
	*/
	toggleShowOwnership: function() {
		if(!this.ref) this.render();
		if(!this.showOwnership) {
			this.ownership.style.display = "block";
			this.selectedUsers = new simpleUserAggregate(this.ownership, this.model.selectedUsers);
			this.selectedUsersLacking = new simpleUserAggregate(this.ownership, this.model.selectedUsersLacking);
			this.selectedUsers.commit();
			this.selectedUsersLacking.commit();
		}
		else {
			this.ownership.style.display = null;
			this.selectedUsers.uncommit();
			this.selectedUsersLacking.uncommit();
			delete this.selectedUsers;
			delete this.selectedUsersLacking;
		}
	}
	
}

extend(gameView, view);

document.addEventListener("click", function(e) {
	var target = e.target;
	if(target.tagName=="A") {
		var viewRef = getParentByClassName(target, "game");
		if(viewRef) {
			gameViewManager.children = gameViewManager;
			var view = aggregate.prototype.findChildByRef.call(gameViewManager, viewRef);
			if(view && target == view.sharedAmong) {
				e.preventDefault();
				view.showOwnership = !view.showOwnership;
			}
		}
	}
}, true);