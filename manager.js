
//todo: copy method

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
		var quickFind = this.employees.indexOf(employee);
		if(quickFind != -1) return this.employees[quickFind];
		
		for(var i=0, len=this.employees.length; i<len; i++)
			if(this.employees[i].equals(employee)) return this.employees[i];
		return null;
	},
	
	/*
	Find an employee among the managed employees and return its index.
	Return -1 if the employee cannot be found.
	*/
	findIndex: function(employee) {
		var quickFind = this.employees.indexOf(employee);
		if(quickFind != -1) return quickFind;
	
		for(var i=0, len=this.employees.length; i<len; i++)
			if(this.employees[i].equals(employee)) return i;
		return -1;
	},
	
	/*
	Sort this manager's employees with the given compare function.
	Fires a modelSort event.
	*/
	sort: function(compare) {
		this.employees.sort(compare);
		this.event("modelSort");
	},
	
	/*
	Add a new employee to this manager's employees.
	Returns either the employee that was added, or the identical employee that already existed.
	If employee was actually added, fire modelAdd event and pass along new employee.
	ignore should be true if you want to indicate to listeners that the generated event is part of
	a larger operation for which another event will be fired.
	*/
	add: function(employee, ignore) {
		var existing;
		if(existing = this.find(employee)) {
			//don't add it, it's already in this manager
		}
		else {
			this.employees.push(employee);
			this.event("modelAdd", this, employee, ignore);
		}
		
		return existing || employee;
	},
	
	/*
	Add the given array to this manager.
	Fires a modelAddMany event.
	this.add is called for each element, but ignore will be true so that observers can
	differentiate between adds called by addMany and those called normally.
	*/
	addMany: function(arr) {
		for(var i=0, len=arr.length; i<len; i++)
			this.add(arr[i], true);
		this.event("modelAddMany", this, arr);
	},
	
	/*
	Remove an employee from this manager's employees.
	Return the managed employee if found, otherwise return null.
	If employee was actually removed, fire modelRemove event and pass along the removed employee.
	*/
	remove: function(employee, ignore) {
		var index = this.findIndex(employee);
		if(index > -1) {
			employee = this.employees.splice(index, 1)[0];
			this.event("modelRemove", this, employee, ignore);
		}
		else {
			employee = null;
		}
		return employee;
	},
	
	/*
	Remove the given array from this manager.
	Fires a modelRemoveMany event.
	Similar to this.addMany.
	*/
	removeMany: function(arr) {
		for(var i=0, len=arr.length; i<len; i++)
			this.remove(arr[i], true);
		this.event("modelRemoveMany", this, arr);
	},
	
	/*
	Remove all elements currently in the manager from this manager.
	*/
	clear: function() {
		for(var i=0, len=this.employees.length; i<len; i++)
			//don't remove employees[i] - you'll eventually go out of array range
			this.remove(this.employees[0], true);
		this.event("modelClear", this);
	}

}

extend(manager, model);