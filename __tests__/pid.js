const EventEmitter = require('events');

const mockPid = jest.fn();
jest.mock('../lib/pid.js', () => mockPid);

const pid = require('../pid.js');

const getObj = (arr, name) => arr.find((e) => e.name === name);

describe('check', () => {
	test('expect desiredValue', () => {
		try {
			pid.check({
				input: [ {name: 'actualValue'} ],
				output: [ {name: 'controlValue'} ]
			});
			throw new Error('FAILED!');
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toEqual('Input desiredValue is required');
		}
	});
	test('expect actualValue', () => {
		try {
			pid.check({
				input: [ {name: 'desiredValue'} ],
				output: [ {name: 'controlValue'} ]
			});
			throw new Error('FAILED!');
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toEqual('Input actualValue is required');
		}
	});
	test('expect controlValue', () => {
		try {
			pid.check({
				input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
				output: []
			});
			throw new Error('FAILED!');
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toEqual('Output controlValue is required');
		}
	});
	test('default k_p', () => {
		const opts = {
			input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
			output: [ {name: 'controlValue'} ]
		};
		pid.check(opts);
		expect(getObj(opts.input, 'k_p')).toMatchObject({
			name: 'k_p',
			value: 1
		});
	});
	test('default k_i', () => {
		const opts = {
			input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
			output: [ {name: 'controlValue'} ]
		};
		pid.check(opts);
		expect(getObj(opts.input, 'k_i')).toMatchObject({
			name: 'k_i',
			value: 0
		});
	});
	test('default k_d', () => {
		const opts = {
			input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
			output: [ {name: 'controlValue'} ]
		};
		pid.check(opts);
		expect(getObj(opts.input, 'k_d')).toMatchObject({
			name: 'k_d',
			value: 0
		});
	});
	test('default u_max', () => {
		const opts = {
			input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
			output: [ {name: 'controlValue'} ]
		};
		pid.check(opts);
		expect(getObj(opts.input, 'u_max')).toMatchObject({
			name: 'u_max',
			value: Number.MAX_SAFE_INTEGER
		});
	});
	test('default u_min', () => {
		const opts = {
			input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
			output: [ {name: 'controlValue'} ]
		};
		pid.check(opts);
		expect(getObj(opts.input, 'u_min')).toMatchObject({
			name: 'u_min',
			value: Number.MIN_SAFE_INTEGER
		});
	});
	test('default summedError', () => {
		const opts = {
			input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
			output: [ {name: 'controlValue'} ]
		};
		pid.check(opts);
		expect(getObj(opts.output, 'summedError')).toMatchObject({
			name: 'summedError',
			value: 0
		});
	});
});

describe('factory', () => {
	test('wire up pid lib', () => {
		const input = {
			k_p: {value: {}},
			k_i: {value: {}},
			k_d: {value: {}},
			u_max: {value: {}},
			u_min: {value: {}},
			desiredValue: {value: {}},
			actualValue: new EventEmitter()
		};
		const output = {
			summedError: {value: {}},
			controlValue: {value: {}}
		};
		pid.factory({}, input, output);
		expect(mockPid.mock.calls.length).toBe(0);
		input.actualValue.emit('update', 1, 2);
		expect(mockPid.mock.calls.length).toBe(1);
		const pidCtx = mockPid.mock.instances[0];
		['k_p', 'k_i', 'k_d', 'u_max', 'u_min', 'desiredValue'].forEach((key) => {
			expect(pidCtx[key]).toBe(input[key].value);
		});
		['summedError', 'controlValue'].forEach((key) => {
			expect(pidCtx[key]).toBe(output[key].value);
			const newValue = {};
			pidCtx[key] = newValue;
			expect(output[key].value).toBe(newValue);
		});
	});
});
