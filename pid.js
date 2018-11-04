const pid = require('./lib/pid.js');

function check (opts) {
	// Check inputs
	const inputNames = opts.input.map((i) => i.name);
	function i (name, value) {
		if (inputNames.includes(name)) return;
		if (value === undefined) throw new Error(`Input ${name} is required`);
		opts.input.push({name, value});
	}
	i('k_p', 1);
	i('k_i', 0);
	i('k_d', 0);
	i('u_max', Number.MAX_SAFE_INTEGER);
	i('u_min', Number.MIN_SAFE_INTEGER);
	i('desiredValue');
	i('actualValue');

	// Check outputs
	const outputNames = opts.output.map((i) => i.name);
	function o (name, value) {
		if (outputNames.includes(name)) return;
		if (value === undefined) throw new Error(`Output ${name} is required`);
		opts.output.push({name, value});
	}
	o('summedError', 0);
	o('controlValue');
}

function factory (opts, input, output) {
	const ctx = {};

	// Wire inputs and outputs to ctx
	// This might seems a little bit unintuive, but it makes sure
	// that there is only one truth!
	['k_p', 'k_i', 'k_d', 'u_max', 'u_min', 'desiredValue'].forEach((key) => {
		Object.defineProperty(ctx, key, {
			get: function () { return input[key].value; }
		});
	});
	['summedError', 'controlValue'].forEach((key) => {
		Object.defineProperty(ctx, key, {
			get: function () { return output[key].value; },
			set: function (v) { output[key].value = v; }
		});
	});

	// Exec PID on actual value input
	input.actualValue.on('update', (value, timestamp) => pid.call(ctx, value, timestamp));
}

module.exports = {check, factory};
