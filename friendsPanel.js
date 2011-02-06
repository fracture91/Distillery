
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

}

friendsPanel.prototype = {

	getFriends: function(userModel) {
		Net.getUserFriends(userModel, this.model);
	},

	modelAdd: function(model) {
		var view = this.friends.add(userViewManager.add(new userView(this.content, model)));
		view.commit();
	},
	
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
