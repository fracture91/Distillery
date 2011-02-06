
window.onload = function() {

	var selectedContent = document.getElementById("selected").getElementsByClassName("content")[0];
	var myModel = userModelManager.add(new userModel("fracture91"));
	var myView = userViewManager.add(new userView(selectedContent, myModel));
	myView.commit();
	
	Net.getUserModel(myModel, function(xhr) {
	
	});
}