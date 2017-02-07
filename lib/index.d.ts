import "whatwg-fetch";
import * as redux from "redux";
import { AsyncActionCreators } from "redux-typescript-actions";
export { isType } from "redux-typescript-actions";
export interface Request {
    method: string;
    path: (params: any) => string;
    body?: (params: any) => Object;
}
export declare type HttpAction<P, R> = AsyncActionCreators<P, R, Error> & {
    request: Request;
    payload: any;
};
export declare function httpActionCreator<P, R>(name: string, request: Request): ((payload: P) => HttpAction<P, R>) & AsyncActionCreators<P, R, Error>;
export declare function isHttpAction(action: any): action is HttpAction<any, any>;
export declare const createHttpMiddleware: (baseUrl: string) => ({dispatch}: redux.MiddlewareAPI<any>) => redux.GenericStoreEnhancer;
