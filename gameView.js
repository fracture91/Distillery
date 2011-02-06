
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
	
	//Override
	modelChange: function(changes) {
		view.prototype.modelChange.call(this, changes);
	}
	
}

extend(gameView, view);