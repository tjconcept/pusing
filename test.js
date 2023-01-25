'use strict'

const test = require('tape')
const using = require('./')

test((t) => {
	t.plan(1)
	const a = Promise.resolve(1)
	const b = Promise.resolve(2)
	const c = Promise.resolve(4)
	using(
		{a, b, c},
		(args) => t.deepEqual(args, {a: 1, b: 2, c: 4}),
		() => t.fail
	)
})

test('a promise is returned', (t) => {
	const p = using({a: 1}, (...args) => {})
	t.ok(p instanceof Promise)
	t.end()
})

test('a promise is returned', (t) => {
	t.plan(1)
	using({a: 1}, () => 2).then((r) => t.equal(r, 2))
})

test('missing args', (t) => {
	t.throws(
		() => using(),
		/`args` in `using\(args, onFulfilled, onRejected\)` must be an object and not null, "undefined" was given/
	)
	t.end()
})

test('missing onFulfilled', (t) => {
	t.throws(
		() => using({}),
		/`onFulfilled` in `using\(args, onFulfilled, onRejected\)` must be a function, "undefined" was given/
	)
	t.end()
})

test('non-object args', (t) => {
	t.throws(
		() => using('foo', () => undefined),
		/`args` in `using\(args, onFulfilled, onRejected\)` must be an object and not null, "string" was given/
	)
	t.end()
})

test('"null" args', (t) => {
	t.throws(
		() => using(null, () => undefined),
		/`args` in `using\(args, onFulfilled, onRejected\)` must be an object and not null, "object" was given/
	)
	t.end()
})

test('non-function onFulfilled', (t) => {
	t.throws(
		() => using({}, null),
		/`onFulfilled` in `using\(args, onFulfilled, onRejected\)` must be a function, "object" was given/
	)
	t.end()
})

test('non-function onRejected', (t) => {
	t.throws(
		() => using({}, () => undefined, null),
		/`onRejected` in `using\(args, onFulfilled, onRejected\)` must be a function, "object" was given/
	)
	t.end()
})

test('onRejected', (t) => {
	t.plan(1)
	const err = new Error()
	using({a: Promise.reject(err)}, t.fail, (_err) => t.equal(_err, err))
})

test('mixed value types (promise and not)', (t) => {
	t.plan(1)
	using({a: Promise.resolve(1), b: 2}, (args) =>
		t.deepEqual(args, {a: 1, b: 2})
	)
})

test('mixed value types (settled and unsettled)', (t) => {
	t.plan(1)
	const a = Promise.resolve(1)
	let rs
	const b = new Promise((_rs) => (rs = _rs))
	using({a, b}, (args) => t.deepEqual(args, {a: 1, b: 2}))
	rs(2)
})

test('single rejection', (t) => {
	t.plan(1)
	const err = new Error()
	using({a: Promise.reject(err)}, t.fail).catch((_err) => t.equal(_err, err))
})

test('multiple rejections', (t) => {
	t.plan(1)
	const errA = new Error()
	const errB = new Error()
	using({a: Promise.reject(errA), b: Promise.reject(errB)}, t.fail, (_err) =>
		t.equal(_err, errA)
	)
})

test('both resolved and rejected', (t) => {
	t.plan(1)
	const err = new Error()
	using({a: Promise.resolve(1), b: Promise.reject(err)}, t.fail, (_err) =>
		t.equal(_err, err)
	)
})
