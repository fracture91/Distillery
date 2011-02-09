
function extend(subclass, superclass){
   subclass.prototype.__proto__ = superclass.prototype;
   /*
   Don't trust super!  It's only for use in trivial things.
   If you have a method A which calls this.__super.prototype.someFunc.call(this),
   and method B inherits from A's object and calls this.__super.prototype.A.call(this),
   __super within method A will then be bound to B's object, rather than A's.  I think.
   Instead of using this.__super.prototype, point to the class directly (B.prototype.A.call(this)).
   You should know what you're inheriting from anyway.
   */
   subclass.prototype.__super = superclass;
}

// Determine if a reference is defined
function defined(o) {
	return (typeof(o)!="undefined");
}

//returns an array of strings with all the classes on the object
function getClasses(obj) {
	return formatClassString(obj.className).split(" ");
}
	
//remove multiple spaces and leading/trailing whitespace
function formatClassString(str) {
	return str.replace(/\s{2,}/gi, ' ').replace(/^\s|\s$/gi, '');
}

// Determine if an object or class string contains a given class.
// If given no className, it will return true if the element has any class
function hasClass(obj,className) {
	if (!defined(obj) || obj==null || !RegExp) return false;
	if(!defined(className)) return (typeof obj == "string" ? obj : obj.className ? obj.className : '').replace(/\s/gi, '') != '';
	var re = new RegExp("(^|\\s)" + className + "(\\s|$)");
	if (typeof(obj)=="string") 
		return re.test(obj);
	else if (typeof(obj)=="object" && obj.className)
		return re.test(obj.className);
	return false;
}
  
// Add a class to an object
function addClass(obj,className) {
	if (typeof(obj)!="object" || obj==null || !defined(obj.className)) return false;
	if (!hasClass(obj)) { 
		obj.className = formatClassString(className); 
		return true; 
	}
	if (hasClass(obj,className)) return true;
	obj.className = formatClassString(obj.className + " " + className);
	return true;
}
  
// Remove a class from an object
function removeClass(obj,className) {
	if (typeof(obj)!="object" || obj==null || !defined(obj.className) || obj.className==null) return false;
	if (!hasClass(obj,className)) return false;
	var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	obj.className = formatClassString(obj.className.replace(re,' '));
	return true;
}
  
// Fully replace a class with a new one
function replaceClass(obj,className,newClassName) {
	if (typeof(obj)!="object" || obj==null || !defined(obj.className) || obj.className==null) return false;
	removeClass(obj,className);
	addClass(obj,newClassName);
	return true;
}
	
function fixHelpDivs() {
	var helps = document.getElementsByClassName("help");
	for(var i=0, len=helps.length; i<len; i++) {
		helps[i].style.display = "block";
		helps[i].style.display = null;
	}
}

/*
Given some element, adjust its max-height so that the height of ancestor
is less than or equal to the height of ancestor.parentNode.
*/
function expandToFit(element, ancestor) {
	var elementHeight = element.offsetHeight;
	var ancestorHeight = ancestor.offsetHeight;
	var ancestorParentHeight = ancestor.parentNode.offsetHeight;
	var desiredHeight = elementHeight + (ancestorParentHeight - ancestorHeight);
	element.style.height = desiredHeight + "px";
}

function resize(parent) {
	var evt = document.createEvent('HTMLEvents');
	evt.initEvent("resize", true, false);
	return parent.dispatchEvent(evt);
}