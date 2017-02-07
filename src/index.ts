import "whatwg-fetch"
import * as redux from "redux"
import actionCreatorFactory, { ActionCreator, AsyncActionCreators } from "redux-typescript-actions"
export { isType } from "redux-typescript-actions"

const actionCreator = actionCreatorFactory()

export interface Request {
  method: string
  path: (params: any) => string
  body?: (params: any) => Object
}

export type HttpAction<P, R> = AsyncActionCreators<P, R, Error> & { request: Request, payload: any }

export function httpActionCreator<P, R>(name: string, request: Request): ((payload: P) => HttpAction<P, R>) & AsyncActionCreators<P, R, Error> {
  const creator = actionCreator.async<P, R>(name)
  let action: HttpAction<P, R> = Object.assign({}, creator, { request, payload: null })
  return Object.assign(
    (payload: P) => Object.assign({}, action, { payload }),
    creator)
}

export function isHttpAction(action: any): action is HttpAction<any, any> {
  return action.request && typeof action.request.method === "string" && action.started && action.done
}

function performRequest(dispatch: redux.Dispatch<any>, action: HttpAction<any, any>, baseUrl: string): void {
  const {method, path, body} = action.request

  const url = baseUrl + path(action.payload)
  let opts: RequestInit = { method }
  if (body) {
    opts.body = JSON.stringify(body(action.payload))
    opts.headers = { "Content-Type": "application/json" }
  }
  fetch(url, opts).then(
    response => {
      if (response.ok) {
        response.json().then(j => dispatch(action.done({ params: action.payload, result: j })))
      } else {
        let f = { error: new Error(response.statusText), params: action.payload }
        dispatch(action.failed(f))
      }
    },
    error => dispatch(action.failed({ error, params: action.payload }))
  )
}

export const createHttpMiddleware = function (baseUrl: string) {
  return function ({dispatch}: redux.MiddlewareAPI<any>): redux.GenericStoreEnhancer {
    return (next: redux.Dispatch<any>) =>
      (action: any) => {
        if (isHttpAction(action)) {
          let started = next(action.started(action.payload))
          performRequest(dispatch, action, baseUrl)
          return started
        }
        return next(action)
      }
  }
}
