/* eslint-disable no-case-declarations */
// @flow
// Modifications Copyright (C) 2019 Ether Labs LLC

import {
    CONFERENCE_FAILED,
    CONFERENCE_JOINED,
    CONFERENCE_LEFT,
    CONFERENCE_WILL_JOIN,
    SET_ROOM,
    getCurrentConference
} from '../../base/conference';
import {
    CONNECTION_DISCONNECTED,
    CONNECTION_FAILED
} from '../../base/connection';
import { setAudioMuted, setVideoMuted } from '../../base/media';

import { MiddlewareRegistry } from '../../base/redux';
import {
    SET_EXTERNAL_API_LISTENER,
    ADD_CALLKIT_URL,
    ADD_CALLKIT_NAME,
    REMOVE_EXTERNAL_API_LISTENER,
    ADD_CALLKIT_UUID
} from './actionTypes';
import { externalApiEventEmitter } from './custom-functions';
import { appNavigate } from '../../app';
import CallKit from '../call-integration/CallKit';

MiddlewareRegistry.register(store => next => action => {
    const result = next(action);
    const { type } = action;
    const { subscriptions, callKitName } = store.getState()[
        'features/mobile/external-api'
    ];
    const state = store.getState();
    const conference = getCurrentConference(state);

    if (!subscriptions) {
        const subscription = {
            audio: externalApiEventEmitter().addListener(
                'toggle-audio',
                mute => {
                    store.dispatch(
                        setAudioMuted(mute.mute, /* ensureTrack */ true)
                    );
                }
            ),
            video: externalApiEventEmitter().addListener(
                'toggle-video',
                mute => {
                    store.dispatch(
                        setVideoMuted(
                            mute.mute,
                            undefined,
                            /* ensureTrack */ true
                        )
                    );
                }
            ),
            endCall: externalApiEventEmitter().addListener('end-call', () => {
                store.dispatch(appNavigate(undefined));
            }),
            callKitUrl: externalApiEventEmitter().addListener(
                'set-call-kit-url',
                url => {
                    store.dispatch({
                        type: ADD_CALLKIT_URL,
                        payload: url.url
                    });
                }
            ),
            meetingName: externalApiEventEmitter().addListener(
                'set-call-kit-name',
                name => {
                    store.dispatch({
                        type: ADD_CALLKIT_NAME,
                        payload: name.name
                    });
                }
            ),
            callKitProvider: externalApiEventEmitter().addListener(
                'set-call-kit-provider',
                () => {
                    const { callKitUrl, callUUID } = store.getState()[
                        'features/mobile/external-api'
                    ];

                    if (callUUID) {
                        CallKit.updateCall(callUUID, {
                            handle: callKitUrl || 'https://meet.etherlabs.io',
                            displayName: callKitName || 'EtherLabs Meeting',
                            hasVideo: true
                        });
                    }
                }
            )
        };

        store.dispatch({
            type: SET_EXTERNAL_API_LISTENER,
            payload: subscription
        });
    }
    switch (type) {
        case CONFERENCE_FAILED:
        case CONFERENCE_LEFT:
        case CONNECTION_DISCONNECTED:
        case CONNECTION_FAILED:
            if (subscriptions) {
                subscriptions.audio.remove();
                subscriptions.video.remove();
                subscriptions.endCall.remove();
                subscriptions.callKitUrl.remove();
                subscriptions.meetingName.remove();
                subscriptions.callKitProvider.remove();
                store.dispatch({ type: REMOVE_EXTERNAL_API_LISTENER });
            }
            break;
        case CONFERENCE_WILL_JOIN:
        case CONFERENCE_JOINED:
        case SET_ROOM:
            if (
                conference &&
                conference.callUUID &&
                action.type === CONFERENCE_JOINED
            ) {
                const { callKitUrl } = store.getState()[
                    'features/mobile/external-api'
                ];

                CallKit.updateCall(action.conference.callUUID, {
                    handle: callKitUrl || 'https://meet.etherlabs.io',
                    displayName: callKitName || 'EtherLabs Meeting',
                    hasVideo: true
                });
                store.dispatch({
                    type: ADD_CALLKIT_UUID,
                    payload: action.conference.callUUID
                });
            }

            break;
    }

    return result;
});
