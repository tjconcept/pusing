# Using async (almost `Promise.props`)

If you're a fan of promises and named arguments, this package is for you. It is
like [`join`](https://github.com/tjconcept/psjoin) but with named arguments
rather than relying on order.

```js
// npm install usingps
// const join = require('usingps')
import using from 'https://esm.sh/usingps@1.0.1'
const a = Promise.resolve(1)
const b = Promise.resolve(2)
const c = Promise.resolve(4)
using({a, b, c}, ({a, c}) => console.log(a + c), console.error)
// 5
```

Implementing a `Promise.props`:

```js
Promise.props = (u) => using(u, (r) => r)
```
