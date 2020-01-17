//
//  ExternalAPI.h
//  sdk
//
//  Created by Deep Moradia on 20/08/19.
//  Copyright © 2019 Ether Labs LLC. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "JitsiMeetView+Private.h"

@interface ExternalAPI : RCTEventEmitter<RCTBridgeModule>
+ (instancetype) getExternalApi;
- (void)toggleAudio:(BOOL)mute;
- (void)toggleVideo:(BOOL)mute;
- (void)endCall;
- (void)setCallKitUrl:(NSString *)url;
- (void)setCallKitName:(NSString *)name;
- (void)setCallKitProvider;
@end
