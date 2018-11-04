# Footurama Package: Controller

This package includes controllers for Footurama.

### ftrm-ctrl/pid

A PID controller with anti-windup.

Configuration:

 * ```input```:
   * ```k_p```: Proportional gain. Default: ```1```
   * ```k_i```: Integral gain. Default: ```0```
   * ```k_d```: Derivative gain. Default: ```0```
   * ```u_max```: Max control value. Default: ```Number.MAX_SAFE_INTEGER```
   * ```u_min```: Min control value. Default: ```Number.MIN_SAFE_INTEGER```
   * ```actualValue```: Measured process variable. Mandatory.
   * ```desiredValue```: Setpoint for the controller. Mandatory.
 * ```output```:
   * ```controlValue```: Control value. Mandatory.
   * ```summedError```: Integrated error for integral component.

Example:

```js
// Control the valve position (0 to 100) of a radiator
// based on the current temperature sensor reading.
module.exports = [require('ftrm-ctrl/pid'), {
	input: {
		k_p: {value: 10},
		k_i: {value: 0.2},
		k_d: {value: 0},
		u_min: {value: 0},
		u_max: {value: 100},
		desiredValue: {value: 21},
		actualValue: {pipe: 'temperatureSensor'}
	},
	output: {
		controlValue: {pipe: 'radiatorValve'}
	}
}];
```

### ftrm-ctrl/bangbang

A bang-bang control. Pretty name, isn't it?

Configuration:

 * ```input```:
   * ```hysteresis```: Controller's hysteresis. Default: ```0```
   * ```actualValue```: Measured process variable. Mandatory.
   * ```desiredValue```: Setpoint for the controller. Mandatory.
 * ```output```:
   * ```controlValue```: Boolean control value. Mandatory.
 * ```invert```: Invert the output control value.

Example:

```js
// Control the boiler temperture to 60 deg celsius
// based on the current temperature sensor reading.
module.exports = [require('ftrm-ctrl/bangbang'), {
	input: {
		hysteresis: {value: 10},
		desiredValue: {value: 60},
		actualValue: {pipe: 'temperatureSensor'}
	},
	output: {
		controlValue: {pipe: 'boiler'}
	},
	invert: true // Turn the boiler on if the acutalValue is below the desiredValue
}];
```
