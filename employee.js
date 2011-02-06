
/*
A class for an employee, which is managed by manager.
*/
function employee() {}
employee.prototype = {
	/*
	Tests if two employees are equal.
	*/
	equals: function(other) {
		return other == this;
	}
}