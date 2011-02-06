
/*
function friendsManager() {
	manager.call(this);
	
	
	
}

extend(friendsManager, manager);
*/


function friendsPanel() {
	var ref = document.getElementById("friends");
	//the model will be a manager of userModels
	view.call(this, ref.parentNode, new manager());
	
	this.ref = ref;
	this.content = this.ref.getElementsByClassName("content")[0];
	
	/*
	The userViews for each model in this.model.
	*/
	this.friends = new manager();
	
	var that = this;
	
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
		this.clearFriends();
		Net.getUserFriends(userModel, this.model);
	},
	
	clearFriends: function() {
		var employees = this.model.employees;
		for(var i=0, len=employees.length; i<len; i++)
			//don't remove employees[i] - you'll eventually go out of array range
			this.model.remove(employees[0]);
	},

	//Override
	modelAdd: function(model) {
		var view = this.friends.add(userViewManager.add(new userView(this.content, model)));
		view.commit();
	},
	
	//Override
	modelRemove: function(model) {
		var view = this.friends.remove(userViewManager.remove(this.findViewByModel(model)));
		view.uncommit();
	},
	
	findViewByModel: function(model) {
		var employees = this.friends.employees;
		for(var i=0, len=employees.length; i<len; i++)
			if(employees[i].model.equals(model))
				return employees[i];
	},
	
	//Override
	commit: function(){
		var employees = this.friends.employees;
		for(var i=0, len=employees.length; i<len; i++)
			employees[i].render();
		this.render();
	},
	
	//Override
	render: function() {
		var employees = this.friends.employees;
		for(var i=0, len=employees.length; i<len; i++)
			if(!employees[i].ref) employees[i].render();
	}

}

extend(friendsPanel, view);
