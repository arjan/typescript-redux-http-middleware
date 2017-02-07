import "whatwg-fetch";
import actionCreatorFactory from "redux-typescript-actions";
export { isType } from "redux-typescript-actions";
const actionCreator = actionCreatorFactory();
export function httpActionCreator(name, request) {
    const creator = actionCreator.async(name);
    let action = Object.assign({}, creator, { request, payload: null });
    return Object.assign(payload => Object.assign({}, action, { payload }), creator);
}
export function isHttpAction(action) {
    return action.request && typeof action.request.method === "string" && action.started && action.done;
}
function performRequest(dispatch, action, baseUrl) {
    const { method, path, body } = action.request;
    const url = baseUrl + path(action.payload);
    let opts = { method };
    if (body) {
        opts.body = JSON.stringify(body(action.payload));
        opts.headers = { "Content-Type": "application/json" };
    }
    fetch(url, opts).then(response => {
        if (response.ok) {
            response.json().then(j => dispatch(action.done({ params: action.payload, result: j })));
        } else {
            let f = { error: new Error(response.statusText), params: action.payload };
            dispatch(action.failed(f));
        }
    }, error => dispatch(action.failed({ error, params: action.payload })));
}
export const createHttpMiddleware = function (baseUrl) {
    return function ({ dispatch }) {
        return next => action => {
            if (isHttpAction(action)) {
                let started = next(action.started(action.payload));
                performRequest(dispatch, action, baseUrl);
                return started;
            }
            return next(action);
        };
    };
};