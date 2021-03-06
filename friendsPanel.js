
//todo: clear button

/*
An aggregate for the friends list.
Does not actually render itself - all necessary HTML is already under this.ref.
Should not be instantiated until the document is ready.
*/
function friendsPanel() {
	var ref = document.getElementById("friends");
	//the model will be a manager of userModels
	aggregate.call(this, ref.parentNode, new manager(), new manager());
	
	this.ref = ref;
	this.content = this.ref.getElementsByClassName("content")[0];
	this.fitAncestor = document.body.getElementsByTagName("div")[0];
	
	this.getFriendsForm = this.ref.getElementsByTagName("form")[0];
	this.getFriendsInput = this.getFriendsForm.getElementsByTagName("input")[0];
	this.invalidStr = "Invalid Identifier";
	
	var that = this;
	
	//get the friends list of the id64/customURL that was inputted
	this.getFriendsForm.addEventListener("submit", function(e) {
		e.preventDefault();
		that.getFriendsFromString(that.getFriendsInput.value);
	}, false);
	
	this.clearInputHandler = function(e) {
		if(e.target.value==this.error)
			e.target.value = "";
	}
	
	this.getFriendsInput.addEventListener("focus", function(e){ that.clearInputHandler.call(that, e) }, false);
	this.getFriendsInput.addEventListener("click", function(e){ that.clearInputHandler.call(that, e) }, false);
	this.getFriendsInput.addEventListener("keydown", function(e){ that.clearInputHandler.call(that, e) }, false);
	
	//add user to selectedUsers when clicked on
	this.content.addEventListener("click", function(e) {
		var target = e.target;
		if(target) {
			if(target.tagName=="INPUT" && (target = target.parentNode)) {
				var view = that.findChildByRef(target);
				if(view) {
					e.preventDefault();
					selectedPanel.model.add(view.model);
				}
			}
		}
	}, false);

}

friendsPanel.prototype = {

	/*
	Given a userModel, get the friends of this userModel and put them into friendsPanel's model.
	*/
	getFriends: function(userModel) {
		this.model.clear();
		var that = this;
		Net.getUserFriends(userModel, this.model, function(xhr, error) {
			if(error){
				that.error = error;
			}
		});
	},
	
	getFriendsFromString: function(str) {
		this.getFriendsInput.value = str;
		var model = userModel.prototype.modelFromString(str);
		if(model) {
			this.getFriends(userModelManager.add(model));
		}
		else {
			this.error = this.invalidStr;
		}
	},

	//Override
	onModelAdd: function(source, model) {
		var view = this.children.add(userViewManager.add(new userView(this.content, model)));
		view.commit();
	},
	
	//Override
	onModelRemove: function(source, model) {
		var view = this.children.remove(userViewManager.remove(this.findChildByModel(model)));
		view.uncommit();
	},
	
	//Override
	errorHandler: function(str) {
		this.getFriendsInput.value = str;
	}

}

extend(friendsPanel, aggregate);
