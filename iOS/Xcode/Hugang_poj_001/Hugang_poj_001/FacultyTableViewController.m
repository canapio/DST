//
//  FacultyTableViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "FacultyTableViewController.h"
#import "LectureTableViewController.h"

#import "FavoController.h"


#import "IntroHelpViewController.h"




#pragma mark - FacultyTableViewCell

@interface FacultyTableViewCell ()


@end
@implementation FacultyTableViewCell

- (void)setCellInfo:(NSDictionary *)cellInfo {
    _cellInfo = cellInfo;
    self.statusView.layer.cornerRadius = self.statusView.frame.size.width/2;
    
    if (cellInfo[@"name"]) {
        if ([cellInfo[@"name"] rangeOfString:@"컴퓨터공학"].location != NSNotFound) {
            self.titleLabel.text = [NSString stringWithFormat:@"%@", cellInfo[@"name"]];
        } else {
            self.titleLabel.text = [NSString stringWithFormat:@"%@ 교수님", cellInfo[@"name"]];
        }
    } else
        self.titleLabel.text = @"-";
    
    if (cellInfo[@"lecturecount"]) {
        if ([cellInfo[@"name"] rangeOfString:@"컴퓨터공학"].location != NSNotFound) {
            self.descLabel.text = [NSString stringWithFormat:@"%@개의 목록이 있습니다.", cellInfo[@"lecturecount"]];
        } else {
            self.descLabel.text = [NSString stringWithFormat:@"%@개의 강의목록이 있습니다.", cellInfo[@"lecturecount"]];
        }
    } else
        self.descLabel.text = [NSString stringWithFormat:@"n개의 강의목록이 있습니다."];
    
    
    if (cellInfo[@"status"]) {
        self.titleLabel.alpha = 1.f;
        self.descLabel.alpha = 1.f;
        if ([cellInfo[@"status"] isEqualToString:@"e"]) {
            self.statusView.backgroundColor = UIColorFromRGB(0x198040);
        } else if ([cellInfo[@"status"] isEqualToString:@"w"]) {
            self.statusView.backgroundColor = UIColorFromRGB(0xDACF24);
        } else {
            self.statusView.backgroundColor = UIColorFromRGB(0xA61E22);
            self.titleLabel.alpha = .4f;
            self.descLabel.alpha = .4f;
        }
    }
    
}

@end







#pragma mark - FacultyTableViewController

@interface FacultyTableViewController () <UITableViewDataSource, UITableViewDelegate, UIActionSheetDelegate> {
    UIRefreshControl *refreshControl;
    BOOL firstRefresh;
    NSInteger callCount;
}




@end

@implementation FacultyTableViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    if (!ISIPAD) {
        [PushController shared].rootViewController = self.navigationController;
    } else {
        [PushController shared].rootViewController = self.navigationController.splitViewController;
    }
    
    
    if (ANALYTICSON) {
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker set:kGAIScreenName value:@"교수님 목록 화면"];
        [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    }
    
    
    
    callCount = 0;
    
    
    
//    self.navigationController.navigationBar.titleTextAttributes = @{
//          @"NSColor":[UIColor colorWithWhite:0.f alpha:1.f],
//          @"TextColor":[UIColor colorWithWhite:0.f alpha:1.f]
//    };
//    self.navigationItem.title = @"타이틀";
    self.splitViewController = (id)self.navigationController.splitViewController;
//    NSLog(@"%p", self.splitViewController);
    if (self.splitViewController) {
        self.splitViewController.facultyTableViewController = self;
    }
    
    self.mainTableView.delegate = self;
    self.mainTableView.dataSource = self;
    
    firstRefresh = NO;
    
    
    refreshControl = [[UIRefreshControl alloc]init];
    [refreshControl addTarget:self action:@selector(refresh:) forControlEvents:UIControlEventValueChanged];
    [self.mainTableView addSubview:refreshControl];
    
    
    
    NSString *introHelp = [[NSUserDefaults standardUserDefaults] objectForKey:@"intro helpped"];
    if (!introHelp || ![introHelp isEqualToString:@"yes"]) {
        [[NSUserDefaults standardUserDefaults] setObject:@"yes" forKey:@"intro helpped"];
        [[NSUserDefaults standardUserDefaults] synchronize];
        if (1 || !ISIPAD) {
//            NSLog(@"__self.navigationController:%p", self.navigationController);
//            NSLog(@"__self.navigationController:%p", self.navigationController.tabBarController);
            IntroHelpViewController *introHelpViewController = [[IntroHelpViewController alloc] init];
            if (!ISIPAD) {
                
                [self.navigationController presentViewController:introHelpViewController animated:YES completion:^{
                }];
            } else {
                [self.navigationController presentViewController:introHelpViewController animated:YES completion:^{
                }];
            }
            
                

        }
    }
    
    if ([PushController shared].waitingViewDidLoad) {
        [PushController shared].waitingViewDidLoad = NO;
        [[PushController shared] presentPushPostTableViewController];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    NSLog(@"viewWillAppear:");
    
    if (!firstRefresh) {[self refresh:nil];firstRefresh=YES;}
    
    if (!self.splitViewController) {
        for (int i=0; i<self.enableArray.count; i++) {
            [self.mainTableView deselectRowAtIndexPath:[NSIndexPath indexPathForRow:i inSection:0] animated:YES];
        }
    }
    
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    
}

- (void) refresh:(id)sender {
    if (!sender) {
        [refreshControl beginRefreshing];
        CGPoint newOffset = CGPointMake(0, -[self.mainTableView contentInset].top);
        [self.mainTableView setContentOffset:newOffset animated:NO];
    }
    
    
    callCount ++;
    callCount ++;
    NSDictionary *param = @{};
    [[DSTNetworkClient manager] getFacultyList:param block:^(NSDictionary *result, NSError *error) {
        
        if (error) {
            callCount=0;
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"네트워크 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
            [refreshControl endRefreshing];
        } else if ([result[ERROR_CODE] intValue]!=0) {
            callCount=0;
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"서버 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
            [refreshControl endRefreshing];
        } else {
            if (callCount!=0) {
                callCount--;
                [self setMainArray:result[@"data"][@"list"]];
                if (callCount==0) {
                    [refreshControl endRefreshing];
                    [self.mainTableView reloadData];
                    [self callNextLectureListInIpad];
                }
            }
        }
    }];
    
    void (^block)(void) = ^(void) {
        [[FavoController shared] callFavoList:PUSH_ID block:^(NSDictionary *result, NSError *error) {
            if (error) {
                callCount=0;
                [[[UIAlertView alloc] initWithTitle:@"에러" message:@"네트워크 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
                [refreshControl endRefreshing];
            } else if ([result[ERROR_CODE] intValue]!=0) {
                callCount=0;
                [[[UIAlertView alloc] initWithTitle:@"에러" message:@"서버 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
                [refreshControl endRefreshing];
            } else {
                if (callCount!=0) {
                    callCount--;
                    if (callCount==0) {
                        [refreshControl endRefreshing];
                        [self.mainTableView reloadData];
                        [self callNextLectureListInIpad];
                    }
                }
            }
        }];
    };
    [FavoController shared].tempfavolistblock = block;
    [[FavoController shared] getPushId];
    
    BOOL pushEnable = NO;
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
        pushEnable = [[UIApplication sharedApplication] isRegisteredForRemoteNotifications];
    } else {
        UIRemoteNotificationType types = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
        pushEnable = types & UIRemoteNotificationTypeAlert;
    }
    if (!pushEnable) {
        callCount--;
    }
    
}
- (void) setMainArray:(NSArray *)mainArray {
    self.enableArray = [NSMutableArray array];
    self.disableArray = [NSMutableArray array];
    
    for (NSDictionary *raw in mainArray) {
        [raw[@"status"] isEqualToString:@"d"]?([self.disableArray addObject:raw]):([self.enableArray addObject:raw]);
    }
    if (self.enableArray.count>1) {
    for (int i=0; i<self.enableArray.count-1; i++) {
        for (int j=i+1; j<self.enableArray.count; j++) {
            if (self.enableArray[i][@"order"] && self.enableArray[j][@"order"] && self.enableArray[i][@"order"]!=[NSNull null] && self.enableArray[j][@"order"]!=[NSNull null]) {
                if ([self.enableArray[i][@"order"] integerValue]<[self.enableArray[j][@"order"] integerValue]) {
                    id obj1 = self.enableArray[i];
                    id obj2 = self.enableArray[j];
                    [self.enableArray removeObject:obj2];
                    [self.enableArray removeObject:obj1];
                    [self.enableArray insertObject:obj2 atIndex:i];
                    [self.enableArray insertObject:obj1 atIndex:j];
                }
            }
        }
    }
    }
}
- (void) callNextLectureListInIpad {
    if (self.splitViewController) {
        if (self.enableArray && self.enableArray.count) {
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:0 inSection:0];
            if (self.splitViewController.faculty_id) {
                for (NSDictionary *faculty in self.enableArray) {
                    if ([faculty[@"_id"] isEqualToString:self.splitViewController.faculty_id]) {
                        indexPath = [NSIndexPath indexPathForRow:[self.enableArray indexOfObject:faculty] inSection:0];
                    }
                }
            }
            
            
            [self.mainTableView selectRowAtIndexPath:indexPath animated:YES scrollPosition:UITableViewScrollPositionNone];
            self.splitViewController.indexPath = indexPath;
            self.splitViewController.faculty_id = self.enableArray[indexPath.row][@"_id"];
            self.splitViewController.facultyInfo = self.enableArray[indexPath.row];
            [self.splitViewController pushViewController];
        }
    }
}


#pragma mark - TableView Delegate
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 2;
}
- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return (section==0)?@"Enable":@"Disable";
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return (section==0)?self.enableArray.count:self.disableArray.count;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"FacultyTableViewCell";
    FacultyTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[FacultyTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    
    [cell setCellInfo:(indexPath.section==0)?self.enableArray[indexPath.row]:self.disableArray[indexPath.row]];
    
    return cell;
}


- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (!self.splitViewController) {
        if (indexPath.section==0) {
            
            UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
            LectureTableViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"LectureTableViewController"];
            viewcontroller.faculty_id = self.enableArray[indexPath.row][@"_id"];
            viewcontroller.facultyInfo = self.enableArray[indexPath.row];
            [self.navigationController pushViewController:viewcontroller animated:YES];
        } else {
            [tableView deselectRowAtIndexPath:indexPath animated:YES];
        }
    } else {
        if (indexPath.section==0) {
            self.splitViewController.indexPath = indexPath;
            self.splitViewController.faculty_id = self.enableArray[indexPath.row][@"_id"];
            self.splitViewController.facultyInfo = self.enableArray[indexPath.row];
            [self.splitViewController pushViewController];
        } else {
            [tableView selectRowAtIndexPath:self.splitViewController.indexPath animated:YES scrollPosition:UITableViewScrollPositionNone];
            [tableView deselectRowAtIndexPath:indexPath animated:YES];
        }
    }
}


- (IBAction)exportButtonClicked:(id)sender {
    UIActionSheet *popup = [[UIActionSheet alloc] initWithTitle:@"http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21694&siteId=cse&linkUrl=" delegate:self cancelButtonTitle:@"Cancel" destructiveButtonTitle:nil otherButtonTitles:
                            @"링크 열기",
                            @"링크 내보내기",
                            nil];
    popup.tag = 1;
    
    if (ISIPAD) {
        [popup showFromBarButtonItem:sender animated:YES];
    } else {
        [popup showInView:[UIApplication sharedApplication].keyWindow];
    }
    
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"교수님목록화면"     // Event category (required)
                                                              action:@"More 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
}
- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (actionSheet.tag==1) {
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@", @"http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21694&siteId=cse&linkUrl="]];
        if (buttonIndex==[actionSheet cancelButtonIndex]) {
            
        } else if (buttonIndex==0) {
            TOWebViewController *webViewController = [[TOWebViewController alloc] initWithURL:url];
            [self.navigationController pushViewController:webViewController animated:YES];
            
            if (ANALYTICSON) {
                // 구글 어널리틱스
                id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
                [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"교수님목록화면"     // Event category (required)
                                                                      action:@"More 클릭 - 링크열기"  // Event action (required)
                                                                       label:@"touchdown"          // Event label
                                                                       value:nil] build]];    // Event value
            }
        } else if (buttonIndex==1) {
            NSArray *objectsToShare = @[url];
            NSArray *browserActivities = @[[TOActivitySafari new], [TOActivityChrome new]];
            UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:objectsToShare applicationActivities:browserActivities];
            [self presentViewController:activityVC animated:YES completion:nil];
            
            if (ANALYTICSON) {
                // 구글 어널리틱스
                id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
                [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"교수님목록화면"     // Event category (required)
                                                                      action:@"More 클릭 - 링크내보내기"  // Event action (required)
                                                                       label:@"touchdown"          // Event label
                                                                       value:nil] build]];    // Event value
            }
        }
    }
}
@end
