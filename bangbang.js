const bang = require('./lib/bangbang.js');

function check (opts) {
	// Check inputs
	const inputNames = opts.input.map((i) => i.name);
	function i (name, value) {
		if (inputNames.includes(name)) return;
		if (value === undefined) throw new Error(`Input ${name} is required`);
		opts.input.push({name, value});
	}
	i('hysteresis', 0);
	i('desiredValue');
	i('actualValue');

	// Check outputs
	const outputNames = opts.output.map((i) => i.name);
	function o (name, value) {
		if (outputNames.includes(name)) return;
		if (value === undefined) throw new Error(`Output ${name} is required`);
		opts.output.push({name, value});
	}
	o('controlValue');
}

function factory (opts, input, output) {
	const ctx = {};

	// Wire inputs and outputs to ctx
	// This might seems a little bit unintuive, but it makes sure
	// that there is only one truth!
	Object.defineProperty(ctx, 'desiredValue', {
		get: function () {
			return input.desiredValue.value;
		}
	});
	Object.defineProperty(ctx, 'controlValue', {
		get: function () {
			return opts.invert ? !output.controlValue.value : output.controlValue.value;
		},
		set: function (v) {
			output.controlValue.value = opts.invert ? !v : v;
		}
	});

	// Exec PID on actual value input
	input.actualValue.on('update', (value, timestamp) => bang.call(ctx, value));
}

module.exports = {check, factory};
