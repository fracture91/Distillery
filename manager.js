
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

	/*
	Add a new employee to this manager's employees.
	Returns either the employee that was added, or the identical employee that already existed.
	If employee was actually added, call modelAdd on each view.
	*/
	add: function(employee) {
		var existing;
		if(existing = this.find(employee)) {
			//return existing employee later
		}
		else {
			this.employees.push(employee);
		}
		
		existing = existing || employee;
		if(existing == employee)
			for(var i=0, len=this.views.length; i<len; i++)
				this.views[i].modelAdd(existing);
				
		return existing;
	},
	
	/*
	Remove an employee from this manager's employees.
	Return the managed employee if found, otherwise return null.
	If employee was actually removed, call modelRemove on each view.
	*/
	remove: function(employee) {
		var index = this.findIndex(employee);
		if(index > -1) {
			employee = this.employees.splice(index, 1);
			for(var i=0, len=this.views.length; i<len; i++)
				this.views[i].modelRemove(employee);
		}
		else {
			employee = null;
		}
		return employee;
	}

}

extend(manager, model);