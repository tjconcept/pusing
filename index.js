'use strict'

module.exports = (args, onFulfilled, onRejected) => {
	if (typeof args !== 'object' || args === null) {
		throw new Error(
			`\`args\` in \`using(args, onFulfilled, onRejected)\` must be an object and not null, "${typeof args}" was given`
		)
	}
	if (typeof onFulfilled !== 'function') {
		throw new Error(
			`\`onFulfilled\` in \`using(args, onFulfilled, onRejected)\` must be a function, "${typeof onFulfilled}" was given`
		)
	}
	if (onRejected !== undefined && typeof onRejected !== 'function') {
		throw new Error(
			`\`onRejected\` in \`using(args, onFulfilled, onRejected)\` must be a function, "${typeof onRejected}" was given`
		)
	}
	return Promise.all(Object.values(args)).then(
		(v) =>
			onFulfilled(
				Object.fromEntries(
					Object.keys(args).map((key, i) => [key, v[i]])
				)
			),
		onRejected
	)
}
