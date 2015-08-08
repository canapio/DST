//
//  LectureTableViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "LectureTableViewController.h"
#import "PostListTableViewController.h"

#import "FavoController.h"


#pragma mark - LecutreTableViewCell

@interface LecutreTableViewCell () {
    
}

@end
@implementation LecutreTableViewCell


- (void)setCellInfo:(NSMutableDictionary *)cellInfo {
    _cellInfo = cellInfo;
    
    if (cellInfo[@"title"])
        self.titleLabel.text = [NSString stringWithFormat:@"%@", cellInfo[@"title"]];
    else
        self.titleLabel.text = @"-";
    
    if (cellInfo[@"postcount"])
        self.descLabel.text = [NSString stringWithFormat:@"%@개의 글 목록이 있습니다.", cellInfo[@"postcount"]];
    else
        self.descLabel.text = [NSString stringWithFormat:@"n개의 글 목록이 있습니다."];
    
    
    if (cellInfo[@"status"]) {
        self.titleLabel.alpha = 1.f;
        self.descLabel.alpha = 1.f;
        if ([cellInfo[@"status"] isEqualToString:@"e"]) {

        } else if ([cellInfo[@"status"] isEqualToString:@"w"]) {

        } else {
            self.titleLabel.alpha = .4f;
            self.descLabel.alpha = .4f;
        }
    }
    
    
    if ([FavoController shared].favoDic[cellInfo[@"_id"]]) {
        self.favobtn.selected = YES;
    } else {
        self.favobtn.selected = NO;
    }
    
    
    double hours = (fabs([cellInfo[@"updatedate"] timeIntervalSinceNow]))/3600.;
//    if (/*arc4random()%5<3 || */(cellInfo[@"new"] && [cellInfo[@"new"] isEqualToString:@"y"])) {
    if (hours<24. && hours>0.001f) {
        self.nLabel.layer.cornerRadius = self.nLabel.frame.size.width/2.f;
        self.nLabel.alpha = .84f;
    } else {
        self.nLabel.alpha = 0;
    }
}


- (IBAction)clickFavo:(id)sender {
    
    NSLog(@"click favo index");
    
    self.favobtn.selected = !self.favobtn.selected;
    
    NSString *status = @"y";
    NSDictionary *cellInfo = self.cellInfo;
    if (!self.favobtn.selected) {
        status = @"n";
    }
    
    BOOL pushEnable = NO;
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
        pushEnable = [[UIApplication sharedApplication] isRegisteredForRemoteNotifications];
    } else {
        UIRemoteNotificationType types = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
        pushEnable = types & UIRemoteNotificationTypeAlert;
    }
    if (!pushEnable) {
        [[[UIAlertView alloc] initWithTitle:@"즐겨찾기" message:@"설정>알림>PNU CSE에서 푸시 알림을 허용해야 즐겨찾기를 사용 할 수 있습니다" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        self.favobtn.selected = !self.favobtn.selected;
    }
    
    BOOL isRegistered = pushEnable;
    NSString *identifier = [[UIDevice currentDevice].identifierForVendor UUIDString];
    
    NSDictionary *param = @{@"deviceid":identifier,
                            /*@"pushid":[FavoController shared].pushid,*/
                            @"lecture_id":cellInfo[@"_id"],
                            @"status":status,
                            @"platform":APNS_IOS};
    void (^block)(NSDictionary *result, NSError *error) = ^(NSDictionary *result, NSError *error) {
        NSLog(@"result:%@", result);
        if (error || [result[ERROR_CODE] intValue]!=0) {
            if ([status isEqualToString:@"y"]) self.favobtn.selected = NO;
            else self.favobtn.selected = YES;
        } else {
            if ([status isEqualToString:@"y"]) [[FavoController shared] addFavo:cellInfo];
            else [[FavoController shared] removeFavo:cellInfo];
            if (!isRegistered) {
                if ([status isEqualToString:@"y"]) self.favobtn.selected = YES;
                else self.favobtn.selected = NO;
            }
        }
        if ([FavoController shared].delegate) [[FavoController shared].delegate reloadTableView];
        
        
    };
    [FavoController shared].tempparam = param;
    [FavoController shared].tempblock = block;
    [[FavoController shared] getPushId];
    
}


@end




#pragma mark - LectureTableViewController

@interface LectureTableViewController () <UITableViewDataSource, UITableViewDelegate, UIActionSheetDelegate> {
    UIRefreshControl *refreshControl;
    BOOL firstRefresh;
}

@end

@implementation LectureTableViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    if (ANALYTICSON) {
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker set:kGAIScreenName value:@"강의 목록 화면"];
        [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    }
    
    if (!self.facultyInfo[@"name"]) {
        self.title = @"강의 목록";
    } else {
        if ([self.facultyInfo[@"name"] isEqualToString:@"정보컴퓨터공학부 학사행정"]) {
            self.title = [NSString stringWithFormat:@"%@", self.facultyInfo[@"name"]];
        } else {
            self.title = [NSString stringWithFormat:@"%@ 교수님 강의 목록", self.facultyInfo[@"name"]];
        }
    }
    
    self.splitViewController = (id)self.navigationController.splitViewController;
    NSLog(@"%p", self.splitViewController);
    if (self.splitViewController) {
        self.splitViewController.lectureTableViewController = self;
    }
    
    
//    self.navigationController
    UIBarButtonItem * moreButton = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"navibtn_more"] style:UIBarButtonItemStyleDone target:self action:@selector(exportButtonClicked:)];
    moreButton.tintColor = [UIColor whiteColor];
    self.navigationItem.rightBarButtonItem = moreButton;
    
    
    self.mainTableView.delegate = self;
    self.mainTableView.dataSource = self;
    
    firstRefresh = NO;
    
    
    
    refreshControl = [[UIRefreshControl alloc]init];
    [refreshControl addTarget:self action:@selector(refresh:) forControlEvents:UIControlEventValueChanged];
    [self.mainTableView addSubview:refreshControl];
}
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    if (!firstRefresh) {[self refresh:nil];firstRefresh=YES;}
    
    for (int i=0; i<self.enableArray.count; i++) {
        [self.mainTableView deselectRowAtIndexPath:[NSIndexPath indexPathForRow:i inSection:0] animated:YES];
    }
}
- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
}

- (void) refresh:(id)sender {
    NSLog(@"self.faculty_id:%@", self.faculty_id);
    
    if (!self.facultyInfo[@"name"]) {
        self.title = @"강의 목록";
    } else {
        if ([self.facultyInfo[@"name"] rangeOfString:@"컴퓨터공학"].location != NSNotFound) {
            self.title = [NSString stringWithFormat:@"%@", self.facultyInfo[@"name"]];
        } else {
            self.title = [NSString stringWithFormat:@"%@ 교수님 강의 목록", self.facultyInfo[@"name"]];
        }
    }
    
    if (!sender) {
        [refreshControl beginRefreshing];
        CGPoint newOffset = CGPointMake(0, -[self.mainTableView contentInset].top);
        [self.mainTableView setContentOffset:newOffset animated:NO];
    }
    if (!self.faculty_id) {
        [refreshControl endRefreshing];
        return;
    }
    
    NSDictionary *param = @{@"faculty_id":self.faculty_id};
    [[DSTNetworkClient manager] getLectureList:param block:^(NSDictionary *result, NSError *error) {
        [refreshControl endRefreshing];
        if (error) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"네트워크 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else if ([result[ERROR_CODE] intValue]!=0) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"서버 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else {
            NSArray *arr = result[@"data"][@"list"];
            NSMutableArray *marr = [NSMutableArray arrayWithCapacity:arr.count];
            for (int i=0; i<arr.count; i++) [marr addObject:[NSMutableDictionary dictionaryWithDictionary:arr[i]]];
            [self setMainArray:marr];
            [self.mainTableView reloadData];
        }
    }];
}
- (void) setMainArray:(NSArray *)mainArray {
    self.enableArray = [NSMutableArray array];
    self.disableArray = [NSMutableArray array];
    
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    //2015-06-24T19:18:22.482Z
    [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSSZ"];
    
    for (NSMutableDictionary *raw in mainArray) {
        [raw[@"status"] isEqualToString:@"d"]?([self.disableArray addObject:raw]):([self.enableArray addObject:raw]);
        if (raw[@"createdate"] && [raw[@"createdate"] class]!=[NSDate class] && [raw[@"createdate"] respondsToSelector:@selector(length)] && [dateFormatter dateFromString:raw[@"createdate"]]) {
            raw[@"createdate"] = [dateFormatter dateFromString:raw[@"createdate"]];
        }
        if (raw[@"updatedate"] && [raw[@"updatedate"] class]!=[NSDate class] && [raw[@"updatedate"] respondsToSelector:@selector(length)] && [dateFormatter dateFromString:raw[@"updatedate"]]) {
            raw[@"updatedate"] = [dateFormatter dateFromString:raw[@"updatedate"]];
        }
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
- (void) setTableInit {
    self.enableArray = [NSMutableArray array];
    self.disableArray = [NSMutableArray array];
    [self.mainTableView reloadData];
}

#pragma - TableView Delegate
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
    static NSString *CellIdentifier = @"LecutreTableViewCell";
    LecutreTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[LecutreTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    

    [cell setCellInfo:(indexPath.section==0)?self.enableArray[indexPath.row]:self.disableArray[indexPath.row]];


    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.section==0) {
        
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
        PostListTableViewController *viewcontroller = [storyboard instantiateViewControllerWithIdentifier:@"PostListTableViewController"];
        viewcontroller.lecture_id = self.enableArray[indexPath.row][@"_id"];
        viewcontroller.lectureInfo = self.enableArray[indexPath.row];
        [self.navigationController pushViewController:viewcontroller animated:YES];
    } else {
        [tableView deselectRowAtIndexPath:indexPath animated:YES];
    }
}



- (void) exportButtonClicked:(id)sender {
    if (!self.facultyInfo[@"url"]) {
        [[[UIAlertView alloc] initWithTitle:@"링크가 없습니다" message:@"해당 교수님 링크 정보가 없습니다." delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
    } else {
        UIActionSheet *popup = [[UIActionSheet alloc] initWithTitle:self.facultyInfo[@"url"] delegate:self cancelButtonTitle:@"Cancel" destructiveButtonTitle:nil otherButtonTitles:
                                @"링크 열기",
                                @"링크 내보내기",
                                nil];
        popup.tag = 1;
        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
            [popup showFromBarButtonItem:sender animated:YES];
        } else {
            [popup showInView:[UIApplication sharedApplication].keyWindow];
        }
    }
    
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"강의목록화면"     // Event category (required)
                                                              action:@"More 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
}
- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (actionSheet.tag==1) {
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@", self.facultyInfo[@"url"]]];
        if (buttonIndex==[actionSheet cancelButtonIndex]) {
            
        } else if (buttonIndex==0) {
            TOWebViewController *webViewController = [[TOWebViewController alloc] initWithURL:url];
            [self.navigationController pushViewController:webViewController animated:YES];
            
            if (ANALYTICSON) {
                // 구글 어널리틱스
                id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
                [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"강의목록화면"     // Event category (required)
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
                [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"강의목록화면"     // Event category (required)
                                                                      action:@"More 클릭 - 링크내보내기"  // Event action (required)
                                                                       label:@"touchdown"          // Event label
                                                                       value:nil] build]];    // Event value
            }
        }
    }
}


@end
