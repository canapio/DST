//
//  FavoController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 20..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "FavoController.h"


@interface FavoController ()


@end

@implementation FavoController
+ (instancetype)shared
{
    static FavoController *_sharedClient = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedClient = [[super alloc] init];
    });
    
    return _sharedClient;
}
- (instancetype)init {
    if (self = [super init]) {
//        _pushid = [[NSUserDefaults standardUserDefaults] objectForKey:@"pushid"];
    }
    return self;
}
//- (void)setPushid:(NSString *)pushid {
//    NSLog(@"setPushid:%@", pushid);
//    _pushid = pushid;
//    [[NSUserDefaults standardUserDefaults] setObject:pushid forKey:@"pushid"];
//    [[NSUserDefaults standardUserDefaults] synchronize];
//}
- (void)setPushid:(NSString *)pushid {
    _pushid = pushid;
    
    if (pushid) {
        if (self.tempparam) {
            if (self.tempblock) {
                NSMutableDictionary *param = [NSMutableDictionary dictionaryWithDictionary:self.tempparam];
                param[@"pushid"] = [FavoController shared].pushid;
                [[DSTNetworkClient manager] postPushId2:param block:self.tempblock];
                
                self.tempblock = nil;
            }
            self.tempparam = nil;
        }
        if (self.tempfavolistblock) {
            self.tempfavolistblock();
            self.tempfavolistblock = nil;
        }
    }
    
}

- (void) getPushId {
//    if (!self.pushid) {
        NSLog(@"__getPushId");
        
    UIApplication *application = [UIApplication sharedApplication];
    if ([application respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
        NSLog(@"upper ios8");
        // iOS 8 Notifications
        [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];
        [application registerForRemoteNotifications];
    } else {
        NSLog(@"down ios8");
        // iOS < 8 Notifications
        [application registerForRemoteNotificationTypes:
         (UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound)];
    }
//    }
}



- (void) callFavoList:(NSString *)pushid block:(void (^)(NSDictionary *result, NSError *error))block {
//#if defined (ADHOC)
//    [[[UIAlertView alloc] initWithTitle:@"adhoc" message:@" " delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
//    NSLog( @"Adhoc");
//#elif defined (DEBUG)
//    [[[UIAlertView alloc] initWithTitle:@"debug" message:@" " delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
//    NSLog( @"Debug");
//#else
//    [[[UIAlertView alloc] initWithTitle:@"release" message:@" " delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
//    NSLog( @"Release");
//#endif
    NSString *identifier = [[UIDevice currentDevice].identifierForVendor UUIDString];
    NSDictionary *param = @{@"deviceid":identifier, @"platform":APNS_IOS};
    NSLog(@"call favo list param:%@", param);
    [[DSTNetworkClient manager] getFavoLectureList2:param block:^(NSDictionary *result, NSError *error) {
        NSLog(@"end favo list result : %@", result);
        block(result, error);
        if (!error && [result[ERROR_CODE] intValue]==0) {
            [self setFavoList:result[@"data"][@"list"]];
        } else {
            [self setFavoList:@[]];
        }
    }];
}


- (void) setFavoList:(NSArray *)fArray {
//    NSLog(@"fArray:%@", fArray);
    self.favoArray = [NSMutableArray arrayWithCapacity:fArray.count];
    for (int i=0; i<fArray.count; i++) [self.favoArray addObject:[NSMutableDictionary dictionaryWithDictionary:fArray[i]]];
    self.favoDic = [NSMutableDictionary dictionaryWithCapacity:fArray.count];
    for (NSDictionary *favoLecture in self.favoArray) {
        if (favoLecture[@"_id"]) self.favoDic[favoLecture[@"_id"]]=favoLecture;
    }
}
- (void) addFavo:(NSDictionary *)fObj {
    for (int i=0; i<self.favoArray.count; i++) {
        if ([self.favoArray[i][@"_id"] isEqualToString:fObj[@"_id"]]) {
            [self.favoArray removeObjectAtIndex:i];
        }
    }
    [self.favoArray addObject:fObj];
    [self.favoDic setObject:fObj forKey:fObj[@"_id"]];
}
- (void) removeFavo:(NSDictionary *)fObj {
    for (int i=0; i<self.favoArray.count; i++) {
        if ([self.favoArray[i][@"_id"] isEqualToString:fObj[@"_id"]]) {
            [self.favoArray removeObjectAtIndex:i];
        }
    }
    [self.favoDic removeObjectForKey:fObj[@"_id"]];
}

//- (void) setFavoFlagWithLectureArray:(NSArray *)lectureArray {
//    for (NSMutableDictionary *lectureInfo in lectureArray) {
//        
//    }
//}
@end
