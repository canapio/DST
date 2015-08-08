//
//  AppDelegate.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "AppDelegate.h"
#import "QTouchposeApplication.h"
#import "FavoController.h"



/*

 v1.10
 - 각 게시물 선택시 해당 게시물의 웹으로 이동
 - 각 페이지별 웹으로 이동
 - 상단 네비게이션바
 
 v1.30
 - 아이패드 완벽 지원
 - 버그 제거 및 최적화
 
 v1.40
 - 푸시 안정화 및 푸시 바로가기 기능 추가
 - 앱 내 푸시 받기 기능능 추가
 - 앱 사용방법 화면 추가
 - 학우에게 공유하기 기능 추가
 
 v1.41
 - 'N'(new) 강의목록, 세부글목록, 즐겨찾기강의목록에 적용

 */


@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
//    QTouchposeApplication *touchposeApplication = (QTouchposeApplication *)application;
//    touchposeApplication.alwaysShowTouches = YES;
    
//     [[UIApplication sharedApplication] unregisterForRemoteNotifications];
    // iPhone6+ : 5C19315D-408A-468C-9022-4C84BC00C6B2
    // iPhone6+ : 5C19315D-408A-468C-9022-4C84BC00C6B2
    // iPhone5  : BDED6ECA-FCA5-4CBF-9721-5C6A597E7BA2
    
    NSString *identifier = [[UIDevice currentDevice].identifierForVendor UUIDString];
    NSLog(@"%@", identifier);
    
    [[FavoController shared] getPushId];
    
    
    BOOL pushEnable = NO;
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
        pushEnable = [[UIApplication sharedApplication] isRegisteredForRemoteNotifications];
    } else {
        UIRemoteNotificationType types = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
        pushEnable = types & UIRemoteNotificationTypeAlert;
    }
//    NSLog(@"isRegisteredForRemoteNotifications %i", pushEnable);
    
    
    
    
    [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(0, -60)
                                                         forBarMetrics:UIBarMetricsDefault];
    [[UINavigationBar appearance] setTintColor:[UIColor whiteColor]];
    
    
    
    if (ANALYTICSON) {
        // Optional: automatically send uncaught exceptions to Google Analytics.
        [GAI sharedInstance].trackUncaughtExceptions = YES;
        // Optional: set Google Analytics dispatch interval to e.g. 20 seconds.
        [GAI sharedInstance].dispatchInterval = 5;
        // Optional: set Logger to VERBOSE for debug information.
        [[[GAI sharedInstance] logger] setLogLevel:kGAILogLevelVerbose];
    }
    
    
    
    
    
    UILocalNotification *notificationUserInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if (notificationUserInfo) {
//        NSLog(@"app recieved notification from remote%@",notification);
        NSMutableDictionary *mNotificationUserInfo = [NSMutableDictionary dictionaryWithDictionary:(id)notificationUserInfo];
        mNotificationUserInfo[@"appLaunch"] = @"yes";
        [self application:application didReceiveRemoteNotification:mNotificationUserInfo];
    }else{
//        NSLog(@"app did not recieve notification");
    }
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
    NSLog(@"__applicationWillResignActive:");
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
    NSLog(@"__applicationDidEnterBackground:");
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
    NSLog(@"__applicationWillEnterForeground:");
    
    
    // 얘 먼저 무조건 호출됨
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
    
    NSLog(@"__applicationDidBecomeActive:");
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}



#pragma mark - 푸시 알림
- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken

{

    NSString* newToken = [[[NSString stringWithFormat:@"%@",deviceToken]
                           stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]] stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSLog(@"DeviceToken : %@", newToken );
    [FavoController shared].pushid = newToken;
    
    
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    
    [PushController shared].userInfo = userInfo;
    
    if (userInfo[@"appLaunch"]) {
        [PushController shared].waitingViewDidLoad = YES;
    } else {
        if (application.applicationState==UIApplicationStateActive) {
            [[PushController shared] pushInActiveStatus];
        } else {
            // if (application.applicationState==UIApplicationStateInactive) {
            [[PushController shared] presentPushPostTableViewController];
        }
    }
}


@end
