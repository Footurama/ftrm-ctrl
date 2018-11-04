const EventEmitter = require('events');

const mockBang = jest.fn();
jest.mock('../lib/bangbang.js', () => mockBang);

const bang = require('../bangbang.js');

const getObj = (arr, name) => arr.find((e) => e.name === name);

describe('check', () => {
	test('expect desiredValue', () => {
		try {
			bang.check({
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
			bang.check({
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
			bang.check({
				input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
				output: []
			});
			throw new Error('FAILED!');
		} catch (e) {
			expect(e).toBeInstanceOf(Error);
			expect(e.message).toEqual('Output controlValue is required');
		}
	});
	test('default hysteresis', () => {
		const opts = {
			input: [ {name: 'desiredValue'}, {name: 'actualValue'} ],
			output: [ {name: 'controlValue'} ]
		};
		bang.check(opts);
		expect(getObj(opts.input, 'hysteresis')).toMatchObject({
			name: 'hysteresis',
			value: 0
		});
	});
});

describe('factory', () => {
	test('wire up bang bang lib (non-inverting)', () => {
		const opts = {
			invert: false
		};
		const input = {
			hysteresis: {value: {}},
			desiredValue: {value: {}},
			actualValue: new EventEmitter()
		};
		const output = {
			summedError: {value: {}},
			controlValue: {value: true}
		};
		bang.factory(opts, input, output);
		expect(mockBang.mock.calls.length).toBe(0);
		input.actualValue.emit('update', 1, 2);
		expect(mockBang.mock.calls.length).toBe(1);
		const bangCtx = mockBang.mock.instances[0];
		expect(bangCtx.desiredValue).toBe(input.desiredValue.value);
		expect(bangCtx.controlValue).toBe(output.controlValue.value);
		const newValue = false;
		bangCtx.controlValue = newValue;
		expect(output.controlValue.value).toBe(newValue);
	});
	test('wire up bang bang lib (inverting)', () => {
		const opts = {
			invert: true
		};
		const input = {
			hysteresis: {value: {}},
			desiredValue: {value: {}},
			actualValue: new EventEmitter()
		};
		const output = {
			summedError: {value: {}},
			controlValue: {value: true}
		};
		bang.factory(opts, input, output);
		expect(mockBang.mock.calls.length).toBe(0);
		input.actualValue.emit('update', 1, 2);
		expect(mockBang.mock.calls.length).toBe(1);
		const bangCtx = mockBang.mock.instances[0];
		expect(bangCtx.desiredValue).toBe(input.desiredValue.value);
		expect(bangCtx.controlValue).toBe(!output.controlValue.value);
		const newValue = false;
		bangCtx.controlValue = newValue;
		expect(output.controlValue.value).toBe(!newValue);
	});
});
