
/*
Singleton for parsing stuff.
*/
var Parse = new function() {

	this.getFirstContentByTagName = function(source, name) {
		
		source = source.getElementsByTagName(name);
		if(source) source = source[0];
		if(source) source = source.firstChild;
		if(source) source = source.nodeValue;
		
		return source || null;
		
	}

	//userModel properties and their corresponding XML tags
	var userModelXMLData = {
		id: "steamID",
		id64: "steamID64",
		customURL: "customURL",
		icon: "avatarMedium"
	}
	
	/*
	Given an XML documentElement, parse data into the given userModel.
	*/
	this.userModelXML = function(model, xml) {
		
		if(!xml) return -1;
		
		var changes = {};
		for(var i in userModelXMLData) {
			data = this.getFirstContentByTagName(xml, userModelXMLData[i]);
			if(data) changes[i] = data;
			}
			
		model.change(changes);
		
	}

}