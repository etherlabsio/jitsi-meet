/* eslint-disable require-jsdoc */
// Modifications Copyright (C) 2019 Ether Labs LLC

import { NativeModules, NativeEventEmitter } from "react-native";

export function externalApiEventEmitter() {
    return new NativeEventEmitter(NativeModules.ExternalAPI);
}
