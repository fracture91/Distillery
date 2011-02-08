
window.onload = function() {

	friendsPanel = new friendsPanel();
	selectedPanel = new selectedPanel();
	gamesPanel = new gamesPanel();
	
	(function fixHelpDivs() {
		var helps = document.getElementsByClassName("help");
		for(var i=0, len=helps.length; i<len; i++) {
			helps[i].style.display = "block";
			helps[i].style.display = null;
		}
	})();
	
}