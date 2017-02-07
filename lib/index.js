"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createHttpMiddleware = exports.isType = undefined;

var _reduxTypescriptActions = require("redux-typescript-actions");

Object.defineProperty(exports, "isType", {
    enumerable: true,
    get: function get() {
        return _reduxTypescriptActions.isType;
    }
});
exports.httpActionCreator = httpActionCreator;
exports.isHttpAction = isHttpAction;

require("whatwg-fetch");

var _reduxTypescriptActions2 = _interopRequireDefault(_reduxTypescriptActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actionCreator = (0, _reduxTypescriptActions2.default)();
function httpActionCreator(name, request) {
    var creator = actionCreator.async(name);
    var action = Object.assign({}, creator, { request: request, payload: null });
    return Object.assign(function (payload) {
        return Object.assign({}, action, { payload: payload });
    }, creator);
}
function isHttpAction(action) {
    return action.request && typeof action.request.method === "string" && action.started && action.done;
}
function performRequest(dispatch, action, baseUrl) {
    var _action$request = action.request,
        method = _action$request.method,
        path = _action$request.path,
        body = _action$request.body;

    var url = baseUrl + path(action.payload);
    var opts = { method: method };
    if (body) {
        opts.body = JSON.stringify(body(action.payload));
        opts.headers = { "Content-Type": "application/json" };
    }
    fetch(url, opts).then(function (response) {
        if (response.ok) {
            response.json().then(function (j) {
                return dispatch(action.done({ params: action.payload, result: j }));
            });
        } else {
            var f = { error: new Error(response.statusText), params: action.payload };
            dispatch(action.failed(f));
        }
    }, function (error) {
        return dispatch(action.failed({ error: error, params: action.payload }));
    });
}
var createHttpMiddleware = exports.createHttpMiddleware = function createHttpMiddleware(baseUrl) {
    return function (_ref) {
        var dispatch = _ref.dispatch;

        return function (next) {
            return function (action) {
                if (isHttpAction(action)) {
                    var started = next(action.started(action.payload));
                    performRequest(dispatch, action, baseUrl);
                    return started;
                }
                return next(action);
            };
        };
    };
};