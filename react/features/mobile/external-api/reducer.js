// @flow
// Modifications Copyright (C) 2019 Ether Labs LLC

import { ReducerRegistry, set } from '../../base/redux';

import {
    REMOVE_EXTERNAL_API_LISTENER,
    SET_EXTERNAL_API_LISTENER,
    ADD_CALLKIT_URL,
    ADD_CALLKIT_NAME
} from './actionTypes';

ReducerRegistry.register(
    'features/mobile/external-api',
    (state = {}, action) => {
        switch (action.type) {
        case SET_EXTERNAL_API_LISTENER: {
            return {
                ...state,
                subscriptions: action.payload
            };
        }
        case REMOVE_EXTERNAL_API_LISTENER: {
            return { ...state,
                subscriptions: undefined };
        }
        case ADD_CALLKIT_URL: {
            return {
                ...state,
                callKitUrl: action.payload
            };
        }
        case ADD_CALLKIT_NAME: {
            return {
                ...state,
                callKitName: action.payload
            };
        }
        }

        return state;
    }
);
