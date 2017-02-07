import test = require("tape");
import {
  httpActionCreator,
  isHttpAction
} from "../src"

test('action creation', assert => {

  const creator = httpActionCreator<string, string>("GET_USER", {
    method: "GET",
    path: id => `user/${id}`
  })

  let value = creator("arjan")
  assert.equal(value.request.path("arjan"), "user/arjan")

  assert.end();
});

test('middleware', assert => {

  const creator = httpActionCreator<string, string>("GET_USER2", {
    method: "GET",
    path: id => `user/${id}`
  })

  let value: any = creator("arjan")

  assert.true(isHttpAction(value))
  if (isHttpAction(value)) {
    value.done({ params: "arjan", result: "done" })
  } else {
    // value not checked
  }

  assert.end();
});

test('README samples', assert => {
  /*
    import httpActionCreator from 'redux-typescript-http-middleware';

    interface Account {
      name: string
    }

    const getAccount = httpActionCreator<string, Account>("GET_ACCOUNT", {
      method: "GET",
      path: id => `account/${id}`
    });

    // dispatch it through the redux store:

    dispatch(getAccount("user_id"))


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
  */

  assert.end();

})
