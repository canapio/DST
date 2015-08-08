//
//  FavoViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 14..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "FavoViewController.h"
#import "PostListTableViewController.h"



@interface FavoTableViewCell () {
    
}

@end
@implementation FavoTableViewCell


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
    
    NSLog(@"click favo index %@", PUSH_ID);
    
    self.favobtn.selected = !self.favobtn.selected;
    
    NSString *status = @"y";
    NSDictionary *cellInfo = self.cellInfo;
    if (!self.favobtn.selected) {
        status = @"n";
    }
    NSString *identifier = [[UIDevice currentDevice].identifierForVendor UUIDString];
    NSDictionary *param = @{@"deviceid":identifier,
                            @"pushid":PUSH_ID,
                            @"lecture_id":cellInfo[@"_id"],
                            @"status":status,
                            @"platform":APNS_IOS};
    [[DSTNetworkClient manager] postPushId2:param block:^(NSDictionary *result, NSError *error) {
        if (error || [result[ERROR_CODE] intValue]!=0) {
            if ([status isEqualToString:@"y"]) self.favobtn.selected = NO;
            else self.favobtn.selected = YES;
        } else {
            if ([status isEqualToString:@"y"]) [[FavoController shared] addFavo:cellInfo];
            else [[FavoController shared] removeFavo:cellInfo];
        }
    }];
    
}


@end



@interface FavoViewController () <UITableViewDataSource, UITableViewDelegate> {
    UIRefreshControl *refreshControl;
    BOOL firstRefresh;
}

@end

@implementation FavoViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    if (ANALYTICSON) {
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker set:kGAIScreenName value:@"내 강의 목록 화면"];
        [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    }
    
    // self.title = @"교수님 강의목록";
    
    
    self.mainTableView.delegate = self;
    self.mainTableView.dataSource = self;
    
    firstRefresh = NO;
    
    
    
    refreshControl = [[UIRefreshControl alloc] init];
    [refreshControl addTarget:self action:@selector(refresh:) forControlEvents:UIControlEventValueChanged];
    [self.mainTableView addSubview:refreshControl];
    
    
    [FavoController shared].delegate = self;
}
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
//    NSLog(@"1:%@", NSStringFromCGRect(self.view.frame));
    
    if (!firstRefresh) {[self refresh:nil];firstRefresh=YES;}
    
    for (int i=0; i<self.enableArray.count; i++) {
        [self.mainTableView deselectRowAtIndexPath:[NSIndexPath indexPathForRow:i inSection:0] animated:YES];
    }
}
- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
//    NSLog(@"2:%@", NSStringFromCGRect(self.view.frame));
}

- (void) refresh:(id)sender {
    BOOL pushEnable = NO;
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(isRegisteredForRemoteNotifications)]) {
        pushEnable = [[UIApplication sharedApplication] isRegisteredForRemoteNotifications];
    } else {
        UIRemoteNotificationType types = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
        pushEnable = types & UIRemoteNotificationTypeAlert;
    }
    if (!pushEnable) {
        [[[UIAlertView alloc] initWithTitle:@"즐겨찾기" message:@"설정>알림>PNU CSE에서 푸시 알림을 허용해야 즐겨찾기를 사용 할 수 있습니다" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
    }
    
    if (!sender) {
        [refreshControl beginRefreshing];
        CGPoint newOffset = CGPointMake(0, -[self.mainTableView contentInset].top);
        [self.mainTableView setContentOffset:newOffset animated:NO];
    }
    
    NSLog(@"push id : %@", [FavoController shared].pushid);
    NSLog(@"PUSH_ID:%@", PUSH_ID);
    [[FavoController shared] callFavoList:PUSH_ID block:^(NSDictionary *result, NSError *error) {
        [refreshControl endRefreshing];
        if (error) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"네트워크 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else if ([result[ERROR_CODE] intValue]!=0) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:[NSString stringWithFormat:@"서버 에러(%@)", result[ERROR_CODE]] delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else {
            [self setMainArray:[FavoController shared].favoArray];
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
        NSLog(@"%@", [raw[@"createdate"] class]);
        if (raw[@"createdate"] && [raw[@"createdate"] class]!=[NSDate class] && [raw[@"createdate"] respondsToSelector:@selector(length)] && [dateFormatter dateFromString:raw[@"createdate"]]) {
            raw[@"createdate"] = [dateFormatter dateFromString:raw[@"createdate"]];
        }
        if (raw[@"updatedate"] && [raw[@"updatedate"] class]!=[NSDate class] && [raw[@"updatedate"] respondsToSelector:@selector(length)] && [dateFormatter dateFromString:raw[@"updatedate"]]) {
            raw[@"updatedate"] = [dateFormatter dateFromString:raw[@"updatedate"]];
        }
    }
    
    
    // 순서를 맞출 필요 없음
//    if (self.enableArray.count>1) {
//    for (int i=0; i<self.enableArray.count-1; i++) {
//        for (int j=i+1; j<self.enableArray.count; j++) {
//            if (self.enableArray[i][@"order"] && self.enableArray[j][@"order"]) {
//                if ([self.enableArray[i][@"order"] integerValue]>[self.enableArray[j][@"order"] integerValue]) {
//                    id obj1 = self.enableArray[i];
//                    id obj2 = self.enableArray[j];
//                    [self.enableArray removeObject:obj2];
//                    [self.enableArray removeObject:obj1];
//                    [self.enableArray insertObject:obj2 atIndex:i];
//                    [self.enableArray insertObject:obj1 atIndex:j];
//                }
//            }
//        }
//    }
//    }
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
    static NSString *CellIdentifier = @"FavoTableViewCell";
    FavoTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[FavoTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
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


#pragma mark - FavoDelegate
- (void)reloadTableView {
    [self setMainArray:[FavoController shared].favoArray];
    [self.mainTableView reloadData];
}

@end
