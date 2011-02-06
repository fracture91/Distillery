
function extend(subclass, superclass){
   subclass.prototype.__proto__ = superclass.prototype;
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