
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
	
	var that = this;
	
	//get the friends list of the id64/customURL that was inputted
	this.ref.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
		e.preventDefault();
		var val = e.target.getElementsByTagName("input")[0].value;
		
		var model;
		if(/\d{17}/.test(val)) {
			model = new userModel(undefined, val);
		}
		else {
			model = new userModel(val);
		}
			
		that.getFriends(userModelManager.add(model));
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
	modelAdd: function(model) {
		var view = this.children.add(userViewManager.add(new userView(this.content, model)));
		view.commit();
	},
	
	//Override
	modelRemove: function(model) {
		var view = this.children.remove(userViewManager.remove(this.findChildByModel(model)));
		view.uncommit();
	}

}

extend(friendsPanel, aggregate);
