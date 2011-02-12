
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
	
	var that = this;
	
	//todo: validation
	//get the friends list of the id64/customURL that was inputted
	this.ref.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
		e.preventDefault();
		var val = e.target.getElementsByTagName("input")[0].value;
		var model = userModel.prototype.modelFromString(val);
		that.getFriends(userModelManager.add(model));
	}, false);
	
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
	Given a userModel, get the friends of this userModel and put them friendsPanel's model.
	*/
	getFriends: function(userModel) {
		this.model.clear();
		Net.getUserFriends(userModel, this.model);
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
