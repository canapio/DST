//
//  PushController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 26..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PushController : NSObject
+ (instancetype)shared ;


@property (nonatomic, retain) UIViewController *rootViewController;

@property (nonatomic, retain) NSDictionary *userInfo;
- (void) pushInActiveStatus ;
- (void) presentPushPostTableViewController ;


@property (nonatomic) BOOL waitingViewDidLoad;


@end
