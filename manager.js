
//todo: sort method, event
//todo: copy method
//todo: ignore param for add and remove (to be used by add/removeMany and to pass to listeners)

/*
A class for managing a group of similar objects (employees).
The manager assumes that employees must be unique -
that is, employee.equals(otherEmployee) must be false for any pair of managed employees.
*/
function manager() {
	model.call(this);

	/*
	The employees which this manager manages.
	*/
	var employees = [];
	this.__defineGetter__("employees", function(){ return employees });
	
}

manager.prototype = {

	/*
	Find an employee among the managed employees.
	Return null if the employee cannot be found.
	*/
	find: function(employee) {
		for(var i=0, len=this.employees.length; i<len; i++)
			if(this.employees[i].equals(employee)) return this.employees[i];
		return null;
	},
	
	/*
	Find an employee among the managed employees and return its index.
	Return -1 if the employee cannot be found.
	*/
	findIndex: function(employee) {
		for(var i=0, len=this.employees.length; i<len; i++)
			if(this.employees[i].equals(employee)) return i;
		return -1;
	},

	//todo: addMany to add contents of a manager
	
	/*
	Add a new employee to this manager's employees.
	Returns either the employee that was added, or the identical employee that already existed.
	If employee was actually added, fire modelAdd event and pass along new employee.
	*/
	add: function(employee) {
		var existing;
		if(existing = this.find(employee)) {
			//don't add it, it's already in this manager
		}
		else {
			this.employees.push(employee);
			this.event("modelAdd", this, employee);
		}
		
		return existing || employee;
	},
	
	//todo: removeMany to remove contents of a manager
	
	/*
	Remove an employee from this manager's employees.
	Return the managed employee if found, otherwise return null.
	If employee was actually removed, fire modelRemove event and pass along the removed employee.
	*/
	remove: function(employee) {
		var index = this.findIndex(employee);
		if(index > -1) {
			employee = this.employees.splice(index, 1)[0];
			this.event("modelRemove", this, employee);
		}
		else {
			employee = null;
		}
		return employee;
	},
	
	clear: function() {
		for(var i=0, len=this.employees.length; i<len; i++)
			//don't remove employees[i] - you'll eventually go out of array range
			this.remove(this.employees[0]);
	}

}

extend(manager, model);