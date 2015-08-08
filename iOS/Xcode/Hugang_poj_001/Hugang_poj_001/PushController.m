//
//  PushController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 26..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "PushController.h"
#import "PostListTableViewController.h"
#import "NoticeViewController.h"

@interface PushController () {

}

@property (nonatomic, retain) UIView *pushView;
@property (nonatomic, retain) UIImageView *appIconImageView;
@property (nonatomic, retain) UILabel *titleLabel;
@property (nonatomic, retain) UILabel *subtitleLabel;
@property (nonatomic, retain) UIButton *pushViewbutton;
@property (nonatomic) NSInteger pushRetainCount;
@end


@implementation PushController
+ (instancetype)shared
{
    static PushController *_sharedClient = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedClient = [[super alloc] init];
    });
    
    return _sharedClient;
}
- (instancetype)init {
    if (self = [super init]) {
        self.pushRetainCount = 0;
        self.waitingViewDidLoad = NO;
    }
    return self;
}


#define HEIGHT_PUSHVIEW (44.f+20.f)
- (void) pushInActiveStatus {
    UIView *keyWindow = [UIApplication sharedApplication].keyWindow;
    if (!self.pushView) {
        self.pushView = [[UIView alloc] initWithFrame:CGRectZero];
        self.pushView.backgroundColor = [UIColor blackColor];
        [keyWindow addSubview:self.pushView];
        
        UIImage *appIconImage = [UIImage imageNamed:@"AppIcon29x29"];
        self.appIconImageView = [[UIImageView alloc] initWithImage:appIconImage];
        self.appIconImageView.layer.cornerRadius = 5.f;;
        self.appIconImageView.layer.masksToBounds = YES;
        [self.pushView addSubview:self.appIconImageView];
        
        self.titleLabel = [[UILabel alloc] init];
        self.titleLabel.text = @"공지 알림 서비스 for PNU CSE";
        self.titleLabel.font = [UIFont boldSystemFontOfSize:15.f];
        self.titleLabel.textColor = [UIColor whiteColor];
        [self.pushView addSubview:self.titleLabel];
        
        
        self.subtitleLabel = [[UILabel alloc] init];
        self.subtitleLabel.text = @"TESTESTETSETSETSETSET";
        self.subtitleLabel.font = [UIFont systemFontOfSize:12.f];
        self.subtitleLabel.textColor = [UIColor whiteColor];
        self.subtitleLabel.numberOfLines = 0;
        [self.pushView addSubview:self.subtitleLabel];
        
        self.pushViewbutton = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.pushViewbutton addTarget:self action:@selector(clickPushButton:) forControlEvents:UIControlEventTouchDown];
        [self.pushView addSubview:self.pushViewbutton];
    }
    
    [self.pushView.superview bringSubviewToFront:self.pushView];
    
    CGFloat viewHeight = HEIGHT_PUSHVIEW;
    self.pushView.frame = CGRectMake(0, -viewHeight, keyWindow.frame.size.width, viewHeight);
    
    self.pushView.autoresizesSubviews = YES;
    
    self.pushViewbutton.frame = CGRectMake(0, 0, self.pushView.frame.size.width, self.pushView.frame.size.height);
    
    
    CGFloat titleY = 6.f;
    CGFloat titleHeight = 15.f;
    
    CGFloat subtitleHeight = 14.f;
    
    self.appIconImageView.center = CGPointMake((HEIGHT_PUSHVIEW-20.f)/2.f, 20.f+(HEIGHT_PUSHVIEW-20.f)/2.f);
    self.titleLabel.frame = CGRectMake((HEIGHT_PUSHVIEW-20.f), 20.f+titleY,
                                       self.pushView.frame.size.width-(HEIGHT_PUSHVIEW-20.f)-5.f*2.f, titleHeight);
    self.subtitleLabel.frame = CGRectMake(self.titleLabel.frame.origin.x, self.titleLabel.frame.origin.y+self.titleLabel.frame.size.height, self.titleLabel.frame.size.width, subtitleHeight);
    
    if (self.userInfo[@"lecture_id"] && ![self.userInfo[@"lecture_id"] isEqualToString:@"notice"]) {
        self.subtitleLabel.text = [NSString stringWithFormat:@"%@ : %@", self.userInfo[@"title"], self.userInfo[@"desc"]];
        self.pushViewbutton.alpha = 1;
    } else if (self.userInfo[@"lecture_id"] && [self.userInfo[@"lecture_id"] isEqualToString:@"notice"]) {
        self.subtitleLabel.text = [NSString stringWithFormat:@"%@ %@", self.userInfo[@"title"], self.userInfo[@"desc"]];
        self.pushViewbutton.alpha = 1;
    }
    
    if (keyWindow.frame.size.width>440.f) {
        CGFloat diff = (keyWindow.frame.size.width - 440.f)/2.f;
//        self.pushView.frame = CGRectMake(0, -viewHeight, keyWindow.frame.size.width, viewHeight);
        self.appIconImageView.frame = CGRectMake(self.appIconImageView.frame.origin.x+diff, self.appIconImageView.frame.origin.y, self.appIconImageView.frame.size.width, self.appIconImageView.frame.size.height);
        self.titleLabel.frame = CGRectMake(self.titleLabel.frame.origin.x+diff, self.titleLabel.frame.origin.y, self.titleLabel.frame.size.width-diff*2.f, self.titleLabel.frame.size.height);
        self.subtitleLabel.frame = CGRectMake(self.subtitleLabel.frame.origin.x+diff, self.subtitleLabel.frame.origin.y, self.subtitleLabel.frame.size.width-diff*2.f, self.subtitleLabel.frame.size.height);
    }
    self.titleLabel.backgroundColor = [UIColor clearColor];//[UIColor colorWithWhite:1.f alpha:.05f];
    self.subtitleLabel.backgroundColor = [UIColor clearColor];//[UIColor colorWithWhite:1.f alpha:.05f];
    
    
    [UIView animateWithDuration:.3f delay:0.f options:UIViewAnimationOptionCurveEaseOut animations:^{
        self.pushView.center = CGPointMake(keyWindow.frame.size.width/2.f, viewHeight/2.f);
    } completion:^(BOOL finished) {
        
    }];
    
    
    self.pushRetainCount++;
    [self performSelector:@selector(hidePushTopButton) withObject:nil afterDelay:5.f];
}



- (void) hidePushTopButton {
    self.pushRetainCount--;
    if (self.pushRetainCount==0) {
        
        UIView *keyWindow = [UIApplication sharedApplication].keyWindow;
        CGFloat viewHeight = HEIGHT_PUSHVIEW;
        [UIView animateWithDuration:.3f delay:0.f options:UIViewAnimationOptionCurveEaseOut animations:^{
            self.pushView.center = CGPointMake(keyWindow.frame.size.width/2.f, -viewHeight/2.f);
        } completion:^(BOOL finished) {
            
        }];
    }
}
- (void) clickPushButton:(id)sender {
    self.pushRetainCount = 1;
    [self hidePushTopButton];
    
    [self presentPushPostTableViewController];
}

- (void) presentPushPostTableViewController {
    if (!self.userInfo) {
        return;
    }
    
    if (self.userInfo[@"lecture_id"] && ![self.userInfo[@"lecture_id"] isEqualToString:@"notice"]) {
        if (ANALYTICSON) {
            // 구글 어널리틱스
            id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
            [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"세부글목록화면(푸시)"     // Event category (required)
                                                                  action:@"새글푸시"  // Event action (required)
                                                                   label:@"push notification"          // Event label
                                                                   value:nil] build]];    // Event value
        }
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
        PostListTableViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"PostListTableViewController"];
        viewcontroller.lecture_id = self.userInfo[@"lecture_id"];
        NSMutableDictionary *lectureInfo = [NSMutableDictionary dictionary];
        if (self.userInfo[@"title"]) lectureInfo[@"title"] = self.userInfo[@"title"];
        if (self.userInfo[@"url"]) lectureInfo[@"url"] = self.userInfo[@"url"];
        viewcontroller.lectureInfo = lectureInfo;
        viewcontroller.fromPush = YES;
        UINavigationController *naviController = [[UINavigationController alloc] initWithRootViewController:viewcontroller];
        
        
//        naviController.navigationBar.tintColor = [UIColor brownColor];
        naviController.navigationBar.barTintColor = [UIColor blackColor];//UIColorFromRGB(0x333333);
        naviController.navigationBar.barStyle = UIBarStyleBlack;
        
        [[PushController shared].rootViewController presentViewController:naviController animated:YES completion:nil];
        
        self.userInfo = nil;
    } else if (self.userInfo[@"lecture_id"] && [self.userInfo[@"lecture_id"] isEqualToString:@"notice"]) {
        if (ANALYTICSON) {
            // 구글 어널리틱스
            id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
            [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"설정화면-공지(푸시)"     // Event category (required)
                                                                  action:@"공지푸시"  // Event action (required)
                                                                   label:@"push notification"          // Event label
                                                                   value:nil] build]];    // Event value
        }
        
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
        NoticeViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"NoticeViewController"];
        UINavigationController *naviController = [[UINavigationController alloc] initWithRootViewController:viewcontroller];
        
        naviController.navigationBar.barTintColor = [UIColor blackColor];//UIColorFromRGB(0x333333);
        naviController.navigationBar.barStyle = UIBarStyleBlack;
        [[PushController shared].rootViewController presentViewController:naviController animated:YES completion:nil];
    }
}


@end
