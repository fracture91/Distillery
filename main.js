
window.onload = function() {

	friendsPanel = new friendsPanel();
	selectedPanel = new selectedPanel();
	gamesPanel = new gamesPanel();
	
	fixHelpDivs();
	
	function fitPanels(e) {
		expandToFit(friendsPanel.content, friendsPanel.fitAncestor);
		expandToFit(gamesPanel.content, gamesPanel.fitAncestor);
	}
	fitPanels();
	window.addEventListener("resize", fitPanels, true);
	
	document.addEventListener("click", function(e) {
		var target = e.target;
		if(target.tagName=="A" && target.href.slice(0,4)=="http" && !e.defaultPrevented) {
			e.preventDefault();
			window.open(target.href);
		}
	}, false);
	
}