/* eslint camelcase: "off" */

const pid = require('../pid.js');

const CTX = {
	desiredValue: 0,
	k_p: 0,
	k_i: 0,
	k_d: 0,
	u_max: Number.MAX_SAFE_INTEGER,
	u_min: Number.MIN_SAFE_INTEGER
};

test('calc p component', () => {
	const currentValue = 1;
	const desiredValue = 3;
	const k_p = 42;
	const ctx = {
		...CTX,
		k_p,
		desiredValue
	};
	pid.call(ctx, currentValue, 0);
	expect(ctx.controlValue).toBe((desiredValue - currentValue) * k_p);
});

test('calc i component', () => {
	const currentValue = 1;
	const desiredValue = 3;
	const k_i = 42;
	const t1 = 1; // seconds
	const t2 = 2; // seconds
	let summedError = 123;
	const ctx = {
		...CTX,
		k_i,
		desiredValue,
		summedError
	};
	pid.call(ctx, currentValue, t1 * 1000);
	expect(ctx.summedError).toBe(summedError);
	expect(ctx.controlValue).toBe(summedError * k_i);
	pid.call(ctx, currentValue, t2 * 1000);
	summedError += (desiredValue - currentValue) * (t2 - t1);
	expect(ctx.summedError).toBe(summedError);
	expect(ctx.controlValue).toBe(summedError * k_i);
});

test('calc d component', () => {
	const desiredValue = 3;
	const k_d = 42;
	const currentValue1 = 1;
	const currentValue2 = 2;
	const t1 = 1; // seconds
	const t2 = 2; // seconds
	const ctx = {
		...CTX,
		k_d,
		desiredValue
	};
	pid.call(ctx, currentValue1, t1 * 1000);
	expect(ctx.controlValue).toBe(0);
	pid.call(ctx, currentValue2, t2 * 1000);
	const error1 = desiredValue - currentValue1;
	const error2 = desiredValue - currentValue2;
	expect(ctx.controlValue).toBe((error2 - error1) / (t2 - t1) * k_d);
});

test('anti-windup: upper bound', () => {
	const currentValue = 1;
	const desiredValue = 2;
	const k_p = 3;
	const u_max = 3;
	const summedError = 100;
	const ctx = {
		...CTX,
		k_p,
		desiredValue,
		u_max,
		summedError
	};
	pid.call(ctx, currentValue, 1000);
	expect(ctx.summedError).toBe(summedError);
	expect(ctx.controlValue).toBe(u_max);
	pid.call(ctx, currentValue, 2000);
	expect(ctx.summedError).toBe(summedError);
	expect(ctx.controlValue).toBe(u_max);
});

test('anti-windup: lower bound', () => {
	const currentValue = 2;
	const desiredValue = 1;
	const k_p = 3;
	const u_min = -3;
	const summedError = 100;
	const ctx = {
		...CTX,
		k_p,
		desiredValue,
		u_min,
		summedError
	};
	pid.call(ctx, currentValue, 1000);
	expect(ctx.summedError).toBe(summedError);
	expect(ctx.controlValue).toBe(u_min);
	pid.call(ctx, currentValue, 2000);
	expect(ctx.summedError).toBe(summedError);
	expect(ctx.controlValue).toBe(u_min);
});
