
//todo: always open external links in new tab

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
	
}