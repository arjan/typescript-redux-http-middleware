# Redux TypeScript HTTP middleware [![npm version][npm-image]][npm-url]

A typesafe HTTP action dispatcher for Typescript. Uses `fetch()` under
the hood to dispatch HTTP requests through redux.

It builds upon the async action creator from
the
[redux-typescript-actions](https://github.com/aikoven/redux-typescript-actions) project.


## Installation

```
npm install --save redux-typescript-http-middleware
```

## Usage

### Action declaration

```ts

  import { httpActionCreator } from 'redux-typescript-http-middleware';

  interface Account {
    name: string
  }

  const getAccount = httpActionCreator<string, Account>("GET_ACCOUNT", {
    method: "GET",
    path: id => `account/${id}`
  });
```

### Action dispatching

```ts

  // dispatch it through the redux store; the action creator takes
  // parameters which are type-checked against the `httpActionCreator` declaration

  dispatch(getAccount("user_id"))
```

### Middleware configuration

To make it work, add `createAPIMiddleware()` to your middleware, in
which you configure the API base URL:

```ts
import { createHttpMiddleware } from "redux-typescript-http-middleware"

const baseURL = "https://example.com/api/"

export function configureStore() {
  const store = createStore(
    rootReducer,
    {},
    applyMiddleware(
      createHttpMiddleware(baseURL),
    )
  )

  return store
}
```

### Reducer

```ts
  // Usage in the reducer:
  import { isType } from "redux-typescript-http-middleware"
  if (isType(action, getAccount.started)) {
    // the getAccount request was just started;
    // the parameters are now available as "action.payload"
    console.log("Start loading account, id = " + action.payload)
  }

  if (isType(action, getAccount.done)) {
    // the getAccount request has finished
    // the result (Account interface) is now available as "action.payload.result"
    console.log("Start loading account, id = " + action.payload.result.name)
  }

```

[npm-image]: https://badge.fury.io/js/redux-typescript-http-middleware.svg
[npm-url]: https://badge.fury.io/js/redux-typescript-http-middleware
