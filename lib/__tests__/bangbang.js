const bang = require('../bangbang.js');

test('keep off if value hasn\'t passed hysteresis', () => {
	const ctx = {
		constrolValue: false,
		desiredValue: 20,
		hysteresis: 2
	};
	bang.call(ctx, 21);
	expect(ctx.controlValue).toBe(false);
});

test('turn on', () => {
	const ctx = {
		constrolValue: false,
		desiredValue: 20,
		hysteresis: 2
	};
	bang.call(ctx, 21.1);
	expect(ctx.controlValue).toBe(true);
});

test('keep on if value hasn\'t passed hysteresis', () => {
	const ctx = {
		constrolValue: true,
		desiredValue: 20,
		hysteresis: 2
	};
	bang.call(ctx, 19);
	expect(ctx.controlValue).toBe(false);
});

test('turn off', () => {
	const ctx = {
		constrolValue: true,
		desiredValue: 20,
		hysteresis: 2
	};
	bang.call(ctx, 18.9);
	expect(ctx.controlValue).toBe(false);
});
