// Calculate the next step of the bang-bang controller.
// This method must be called within the scope of a PID context:
//  - desiredValue: The value to aim for
//  - controlValue: The output value of the controller
//  - hysteresis:   The controller's hysteresis
// Parameter:
//  - value:        The current value
module.exports = function (value) {
	const desiredValue = this.desiredValue;
	if (desiredValue === undefined) return;
	const hysteresis = this.hysteresis;
	if (hysteresis === undefined) return;

	if (this.controlValue) {
		this.controlValue = value >= desiredValue - hysteresis / 2;
	} else {
		this.controlValue = value > desiredValue + hysteresis / 2;
	}
};
