
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
		var val = that.getFriendsInput.value;
		var model = userModel.prototype.modelFromString(val);
		if(model) {
			that.getFriends(userModelManager.add(model));
		}
		else {
			that.getFriendsInput.value = that.invalidStr;
		}
	}, false);
	
	this.clearInputHandler = function(e) {
		if(e.target.value==that.invalidStr || e.target.value==Net.profileNotFoundDisplay)
			e.target.value = "";
	}
	
	this.getFriendsInput.addEventListener("focus", this.clearInputHandler, false);
	this.getFriendsInput.addEventListener("click", this.clearInputHandler, false);
	this.getFriendsInput.addEventListener("keydown", this.clearInputHandler, false);
	
	//add user to selectedUsers when clicked on
	this.content.addEventListener("click", function(e) {
		var target = e.target;
		if(target) {
			if(target.tagName=="DIV" || target.tagName=="IMG" && (target = target.parentNode)) {
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
				that.getFriendsInput.value = error == Net.profileNotFoundError ? Net.profileNotFoundDisplay : error;
			}
		});
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
	}

}

extend(friendsPanel, aggregate);
