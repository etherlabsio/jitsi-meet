// @flow

import { MiddlewareRegistry } from '../redux';
import {
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_UPDATED
} from './actionTypes';

import { sendEvent } from '../../mobile/external-api/functions';

/**
 * Middleware that captures CONFERENCE_JOINED and CONFERENCE_LEFT actions and
 * updates respectively ID of local participant.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case PARTICIPANT_JOINED: {
        const { id, avatarURL, name } = action.participant;

        sendEvent(store, 'PARTICIPANT_JOINED', { id,
            avatarURL,
            name });
        break;
    }

    case PARTICIPANT_LEFT: {
        const { id } = action.participant;

        sendEvent(store, 'PARTICIPANT_LEFT', { id });

        break;
    }
    case PARTICIPANT_UPDATED: {
        const { id, avatarURL, name } = action.participant;

        sendEvent(store, 'PARTICIPANT_UPDATED', { id,
            avatarURL,
            name });
    }
    }

    return next(action);
});
