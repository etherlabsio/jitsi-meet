// @flow

import { MiddlewareRegistry } from '../redux';

import { TRACK_ADDED, TRACK_UPDATED } from './actionTypes';

import { sendEvent } from '../../mobile/external-api/functions';

/**
 * Middleware that captures LIB_DID_DISPOSE and LIB_DID_INIT actions and,
 * respectively, creates/destroys local media tracks. Also listens to
 * media-related actions and performs corresponding operations with tracks.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case TRACK_ADDED: {
        // TODO Remove the following calls to APP.UI once components interested
        // in track mute changes are moved into React and/or redux.
        const { jitsiTrack } = action.track;
        const muted = jitsiTrack.isMuted();
        const participantID = jitsiTrack.getParticipantId();
        const isVideoTrack = jitsiTrack.isVideoTrack();
        const id = participantID;

        if (isVideoTrack) {
            sendEvent(store, 'VIDEO_MUTED', {
                muted: `${muted}`,
                id
            });
        } else {
            sendEvent(store, 'AUDIO_MUTED', {
                muted: `${muted}`,
                id: participantID
            });
        }
        break;
    }

    case TRACK_UPDATED: {
        // TODO Remove the following calls to APP.UI once components interested
        // in track mute changes are moved into React and/or redux.
        const { jitsiTrack } = action.track;
        const muted = jitsiTrack.isMuted();
        const participantID = jitsiTrack.getParticipantId();
        const isVideoTrack = jitsiTrack.isVideoTrack();
        const id = participantID;

        if (isVideoTrack) {
            sendEvent(store, 'VIDEO_MUTED', {
                muted: `${muted}`,
                id
            });
        } else {
            sendEvent(store, 'AUDIO_MUTED', {
                muted: `${muted}`,
                id: participantID
            });
        }
    }
    }

    return next(action);
});
