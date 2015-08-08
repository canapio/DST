//
//  SettingViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 3..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "SettingViewController.h"
#import "IntroHelpViewController.h"


#import "PushHistoryViewController.h"
#import "NoticeViewController.h"



@interface SettingViewController () <UIActionSheetDelegate> {
    UIActivityIndicatorView *spinner;
    BOOL isfirstAppear;
}

@property (nonatomic, retain) NSMutableArray *selectIndexPathArray ;
@end

@implementation SettingViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    if (ANALYTICSON) {
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker set:kGAIScreenName value:@"설정 화면"];
        [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    }
    
    isfirstAppear = YES;
    
    self.selectIndexPathArray = [NSMutableArray array];
    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
    
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
    
    BOOL pushEnable = NO;
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
        pushEnable = [[UIApplication sharedApplication] isRegisteredForRemoteNotifications];
    } else {
        UIRemoteNotificationType types = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
        pushEnable = types & UIRemoteNotificationTypeAlert;
    }
    [self.pushSwitch setOn:pushEnable];
    
    self.splitViewController = (id)self.navigationController.splitViewController;
//    NSLog(@"%p", self.splitViewController);
    if (self.splitViewController) {
        self.splitViewController.settingViewController = self;
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    if (!self.splitViewController) {
        for (int i=0; i<self.selectIndexPathArray.count; i++) {
            [self.mainTableView deselectRowAtIndexPath:self.selectIndexPathArray[i] animated:YES];
        }
    }
    
    
    if (isfirstAppear) {
        isfirstAppear = NO;
        if (self.splitViewController) {
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:1 inSection:1];
            [self.mainTableView selectRowAtIndexPath:indexPath animated:YES scrollPosition:UITableViewScrollPositionNone];
            [self tableView:self.mainTableView didSelectRowAtIndexPath:indexPath];
        }
    }
    
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    
    if (!self.splitViewController) {
        [self.selectIndexPathArray addObject:[NSIndexPath indexPathForRow:indexPath.row inSection:indexPath.section]];
        
        if (indexPath.section==0 && indexPath.row==0) {
            [self gotoIntroHelpPage];
        } else if (indexPath.section==1 && indexPath.row==1) {
            UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
            PushHistoryViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"PushHistoryViewController"];
            [self.navigationController pushViewController:viewcontroller animated:YES];
        } else if (indexPath.section==2 && indexPath.row==0) {
            UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
            NoticeViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"NoticeViewController"];
            [self.navigationController pushViewController:viewcontroller animated:YES];
        } else if (indexPath.section==3 && indexPath.row==0) {
            [self gotoIntroWebPage];
            [tableView deselectRowAtIndexPath:indexPath animated:YES];
        } else if (indexPath.section==3 && indexPath.row==1) {
            [self rateAppstoreWithIndexPath:indexPath];
        } else if (indexPath.section==3 && indexPath.row==2) {
            [self clickMail];
        } else if (indexPath.section==4 && indexPath.row==0) {
            [self clickShare];
        }
    } else {
        if (self.splitViewController.indexPath.row==indexPath.row && self.splitViewController.indexPath.section==indexPath.section) {
            return;
        }
        self.splitViewController.indexPath = indexPath;
        if (indexPath.section==0 && indexPath.row==0) {
            [self gotoIntroHelpPage];
        } else if (indexPath.section==1 && indexPath.row==1) {
            UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
            PushHistoryViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"PushHistoryViewController"];
            self.splitViewController.nextsettingViewController = viewcontroller;
            [self.splitViewController pushViewController];
            // [self.navigationController pushViewController:viewcontroller animated:YES];
        } else if (indexPath.section==2 && indexPath.row==0) {
            UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
            NoticeViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"NoticeViewController"];
            self.splitViewController.nextsettingViewController = viewcontroller;
            [self.splitViewController pushViewController];
            // [self.navigationController pushViewController:viewcontroller animated:YES];
        } else if (indexPath.section==3 && indexPath.row==0) {
            // [self gotoIntroWebPage];
            NSURL *url = [NSURL URLWithString:WEBPAGE_URL];
            TOWebViewController *webViewController = [[TOWebViewController alloc] initWithURL:url];
            self.splitViewController.nextsettingViewController = webViewController;
            [self.splitViewController pushViewController];
//            [self.navigationController pushViewController:webViewController animated:YES];
            
        } else if (indexPath.section==3 && indexPath.row==1) {
            [self rateAppstoreWithIndexPath:indexPath];
        } else if (indexPath.section==3 && indexPath.row==2) {
            [self clickMail];
        } else if (indexPath.section==4 && indexPath.row==0) {
            [self clickShare];
        }
    }
}


#pragma mark - 앱 설명
- (void) gotoIntroHelpPage {
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"설정화면"     // Event category (required)
                                                              action:@"앱설명 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
    
    if (!ISIPAD) {
        IntroHelpViewController *introHelpViewController = [[IntroHelpViewController alloc] init];
        [self.navigationController presentViewController:introHelpViewController animated:YES completion:^{
            
        }];
    } else {
        IntroHelpViewController *introHelpViewController = [[IntroHelpViewController alloc] init];
        [self.navigationController presentViewController:introHelpViewController animated:YES completion:^{
            
        }];
    }
}

#pragma mark - 소개 페이지로
- (void) gotoIntroWebPage {
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"설정화면"     // Event category (required)
                                                              action:@"소개페이지 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
    
    
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:WEBPAGE_URL]];
    
    
}

#pragma mark - 평가하기
- (void) rateAppstoreWithIndexPath:(NSIndexPath *)indexPath {
    
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"설정화면"     // Event category (required)
                                                              action:@"평가하기 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
    
    
    UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
    if (spinner) {
        return;
    }
    spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    [spinner setCenter:CGPointMake(cell.contentView.frame.size.width-30.f/2.f, cell.contentView.frame.size.height/2.f)]; // I do this because I'm in landscape mode
    [cell.contentView addSubview:spinner]; // spinner is not visible until started
    [spinner startAnimating];
    
    NSURL* url = [[NSURL alloc] initWithString:APPSTORE_URL];
    UIViewController *viewcontroller = nil;
    if (!self.splitViewController) {
        viewcontroller = self;
    } else {
        viewcontroller = self.splitViewController;
    }
    [[ExtraViewController shared] presentAppStoreForID:[NSNumber numberWithInt:APPSTORE_ID]
                                        viewcontroller:viewcontroller
                                               withURL:url
                                                 block:^{
        [self.tableView deselectRowAtIndexPath:indexPath animated:YES];
        [spinner stopAnimating];
        if (spinner) {
            [spinner removeFromSuperview];
            spinner = nil;
        }
    }];
}



#pragma mark - 피드백 보내기
- (void) clickMail {
    
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"설정화면"     // Event category (required)
                                                              action:@"피드백보내기 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
    
    UIViewController *viewcontroller = nil;
    if (!self.splitViewController) {
        viewcontroller = self;
    } else {
        viewcontroller = self.splitViewController;
    }
    
    NSString *appName = @"공지 알림 서비스 for PNU CSE";
    NSString *versionNumber = [[[NSBundle bundleForClass:[self class]] infoDictionary] objectForKey:@"CFBundleVersion"];
    NSString *phoneModel = [[UIDevice currentDevice] model];
    NSString* iOSVersion = [[UIDevice currentDevice] systemVersion];
    NSString *bodyMessage = [NSString stringWithFormat:@"\n\n\n\napp name : %@\napp version : %@\nDevice : %@\niOS Version : %@", appName, versionNumber, phoneModel, iOSVersion];
    
    NSString *subject = @"개발자에게 하고싶은 말이 있어요";
    
    NSArray *receipients = @[@"canapio.dst@gmail.com"];
    
    
    [[ExtraViewController shared] sendFeedbackMailWithSubject:subject
                                                  bodyMessage:bodyMessage
                                                  receipients:receipients
                                               viewcontroller:viewcontroller];

}


#pragma mark - 공유하기
- (void) clickShare {
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"설정화면"     // Event category (required)
                                                              action:@"공유하기 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
    
    
    UIActionSheet *shareActionSheet = [[UIActionSheet alloc] initWithTitle:@"공유하기" delegate:self cancelButtonTitle:@"취소" destructiveButtonTitle:nil otherButtonTitles:@"카카오톡", @"문자", @"페이스북", @"트위터", nil];
    shareActionSheet.tag = 22;
    if (ISIPAD) {
//        [shareActionSheet showFromBarButtonItem:sender animated:YES];
    } else {
        [shareActionSheet showInView:[UIApplication sharedApplication].keyWindow];
    }
    
}
#pragma mark - UIActionSheet Delegate
- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (actionSheet.tag==22) {
        if (buttonIndex==[actionSheet cancelButtonIndex]) {
            
        } else {
            NSURL *url = [NSURL URLWithString:WEBPAGE_URL];
            UIImage *image = [UIImage imageNamed:@"graphicimage_002"];
            NSString *imageURLString = @"http://14.49.37.33:8003/DSTWebManager/service_asset/img/graphicimage_002.png";
            NSString *text = [NSString stringWithFormat:@"if (컴공 공지 알림 서비스) {\n\tchar *url = \"%@\";\n\tdownload_follow_link(url);\n}", WEBPAGE_URL];
            [[ExtraViewController shared] shareWithViewController:self index:buttonIndex text:text image:image imageURLString:imageURLString url:url];
        }
        
        for (int i=0; i<self.selectIndexPathArray.count; i++) {
            [self.mainTableView deselectRowAtIndexPath:self.selectIndexPathArray[i] animated:YES];
        }
    }
}





@end
