// Calculate the next step of the bang-bang controller.
// This method must be called within the scope of a PID context:
//  - desiredValue: The value to aim for
//  - controlValue: The output value of the controller
//  - hysteresis:   The controller's hysteresis
// Parameter:
//  - value:        The current value
module.exports = function (value) {
	if (this.controlValue) {
		this.controlValue = value < this.desiredValue - this.hysteresis / 2;
	} else {
		this.controlValue = value > this.desiredValue + this.hysteresis / 2;
	}
};
