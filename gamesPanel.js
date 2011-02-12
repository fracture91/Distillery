
//todo: allow user to choose not to display games that the entire group can't play
//todo: instead, allow user to set tolerance for how many people can't play
//todo: allow user to ignore games forever (like single player games)
//todo: select random game
//todo: recommend button

/*
An aggregate for the list of owned games.
Does not actually render itself - all necessary HTML is already under this.ref.
Should not be instantiated until the document is ready.
*/
function gamesPanel() {
	var ref = document.getElementById("games");
	//the model will be a manager of gameModels
	aggregate.call(this, ref.parentNode, new manager(), new manager());
	
	this.ref = ref;
	this.content = this.ref.getElementsByClassName("content")[0];
	this.fitAncestor = document.body.getElementsByTagName("div")[0].nextElementSibling;

}

gamesPanel.prototype = {

	/*
	Compare by how many selected users own this game.
	*/
	compareSelectedUsersLength: function(view1, view2) {
		return view2.model.selectedUsers.employees.length -
				view1.model.selectedUsers.employees.length;
	},
	
	/*
	Compare by the name of the game.
	*/
	compareName: function(view1, view2) {
		return view1.model.name.localeCompare(view2.model.name);
	},
	
	/*
	Compare by selectedUsersLength, then by name
	*/
	defaultCompare: function(view1, view2) {
		var cmp = this.compareSelectedUsersLength(view1, view2);
		if(cmp != 0) return cmp;
		return this.compareName(view1, view2);
	},

	//todo: let user choose how to sort
	/*
	Sort the gamePanel's children using this.defaultCompare.
	*/
	sort: function() {
		this.uncommit();
		var that = this;
		this.children.sort(function(view1, view2){
			return that.defaultCompare(view1, view2);
			});
		this.commit();
		//this.syncOrder();
	},
	
	/*
	Make sure that children appear in the document in the order they appear in their manager.
	*/
	/*syncOrder: function() {
		//first we find the first childNode that is a view of ours
		var childNodes = this.content.childNodes;
		var previousViewRef;
		for(var i=0, len=childNodes.length; i<len; i++) {
			if(previousViewRef = this.findChildByRef(childNodes[i])) {
				previousViewRef = previousViewRef.previousSibling;
				break;
				}
		}
		previousViewRef = previousViewRef || this.content.lastChild;
		
		//then, for each child, we make sure it follows (in the document) the previous view's ref
		var children = this.children.employees;
		for(var i=0, len=children.length; i<len; i++) {
			if(!children[i].ref) children[i].render();
			if(i==0 || !previousViewRef || children[i].ref.previousSibling!=previousViewRef) {
				//move this child's ref so that it is after lastViewRef
				this.content.insertBefore(children[i].ref, previousViewRef ? previousViewRef.nextSibling : null);
			}
			previousViewRef = children[i].ref;
		}
	},*/

	//Override
	onModelAdd: function(source, model, ignore) {
		var view = this.children.add(gameViewManager.add(new gameView(this.content, model)));
		if(!ignore) {
			this.sort();
		}
	},
	
	onModelAddMany: function(source, arr) {
		this.sort();
	},
	
	//Override
	onModelRemove: function(source, model, ignore) {
		var view = this.children.remove(gameViewManager.remove(this.findChildByModel(model)));
		view.uncommit();
		if(!ignore) {
			this.sort();
		}
	},
	
	onModelRemoveMany: function(source, arr) {
		this.onModelAddMany();
	}

}

extend(gamesPanel, aggregate);
