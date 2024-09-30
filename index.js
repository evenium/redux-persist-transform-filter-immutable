import { isCollection, Map } from 'immutable';
import type { KeyedCollection, IndexedSeq } from 'immutable';
import { createTransform } from '@evenium/redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';
import isUndefined from 'lodash.isundefined';
import isString from 'lodash.isstring';


export type returnType = KeyedCollection<string, any> | {[key: string]: any};

export default (reducerName: string, inboundPaths: string | string[], outboundPaths: string | string[]) => {
    return createTransform(
        (inboundState: any, key: string) => inboundPaths ? persistFilter(inboundState, inboundPaths) : inboundState,
        (outboundState: any, key: string) => outboundPaths ? persistFilter(outboundState, outboundPaths) : outboundState,
        {whitelist: [reducerName]}
    );
};

export function persistFilter (state: any, paths: string | string[] = []): returnType {
    let iterable: boolean  = isCollection(state);
    let subset: returnType = iterable ? Map({}) : {};

    (isString(paths) ? [paths] : paths).forEach((path: string | string[]) => {
        let value = iterable ? state[isString(path) ? 'get' : 'getIn'](path) : get(state, path);
        if(!isUndefined(value)) {
            iterable ? (subset = (subset)[isString(path) ? 'set' : 'setIn'](path, value)) : set(subset, path, value);
        }
    });

    return subset;
}
