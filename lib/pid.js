// Calculate the next step of the PID controller.
// This method must be called within the scope of a PID context:
//  - desiredValue: The value to aim for
//  - controlValue: The output value of the controller
//  - summedError:  The accumulated error for I component
//  - k_p:          P constant
//  - k_i:          I constant
//  - k_d:          D constant
//  - u_max:        Maximum output value
//  - u_min:        Minimum output value
// Parameter:
//  - value:        The current value
//  - currentTime:  Unix time in milliseconds
module.exports = function (value, currentTime) {
	// P
	const error = this.desiredValue - value;
	if (isNaN(error)) return;

	// dt
	currentTime = currentTime / 1000;
	const dt = this._lastTime ? currentTime - this._lastTime : 0;
	this._lastTime = currentTime;

	// I
	const summedError = (this.summedError || 0) + error * dt;

	// D
	const dError = dt ? (error - this._lastErr) / dt : 0;
	this._lastErr = error;

	// u
	let u = this.k_p * error + this.k_i * summedError + this.k_d * dError;

	if (u >= this.u_max) {
		u = this.u_max;
	} else if (u <= this.u_min) {
		u = this.u_min;
	} else {
		// Only store the integrated error if u hasn't reached its bounds
		// -> Anti-windup */
		this.summedError = summedError;
	}

	this.controlValue = u;
};
