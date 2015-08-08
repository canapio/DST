//
//  DetailListTableViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "PostListTableViewController.h"

#define LEFT_GAP 70.f

#pragma mark - PostListTableViewCell

@interface PostListTableViewCell ()
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;

@end
@implementation PostListTableViewCell


- (void)setCellInfo:(NSDictionary *)cellInfo {
    _cellInfo = cellInfo;
    
    if (cellInfo[@"title"])
        self.titleLabel.text = [NSString stringWithFormat:@"%@", cellInfo[@"title"]];
    else
        self.titleLabel.text = @"-";
    
    
    
    if (cellInfo[@"status"]) {
        self.titleLabel.alpha = 1.f;
        if ([cellInfo[@"status"] isEqualToString:@"e"]) {
            
        } else if ([cellInfo[@"status"] isEqualToString:@"w"]) {
            
        } else {
            self.titleLabel.alpha = .4f;
        }
    }
    
    double hours = (fabs([cellInfo[@"updatedate"] timeIntervalSinceNow]))/3600.;
//    if (/*arc4random()%5<3 || */(cellInfo[@"new"] && [cellInfo[@"new"] isEqualToString:@"y"])) {
//    NSLog(@"%@      %f", cellInfo[@"updatedate"], hours);
    if (!cellInfo[@"updatedate"] || (hours>24. || hours<0.001)) {
        self.dotLabel.text = @"•";
        self.dotLabel.font = [UIFont systemFontOfSize:17];
        self.dotLabel.backgroundColor = [UIColor clearColor];
        self.dotLabel.textColor = [UIColor blackColor];
        self.dotLabel.alpha = 1.f;
    } else {
        self.dotLabel.layer.cornerRadius = self.dotLabel.frame.size.width/2.f;
        self.dotLabel.text = @"N"; // new의 'N'
        self.dotLabel.font = [UIFont systemFontOfSize:9.f];
        self.dotLabel.backgroundColor = [UIColor redColor];
        self.dotLabel.textColor = [UIColor whiteColor];
        self.dotLabel.alpha = .9f;
    }

    
    

    
    
//    self.titleLabel.frame = CGRectMake(LEFT_GAP, self.titleLabel.frame.origin.y,
//                                       self.frame.size.width-LEFT_GAP*2, self.titleLabel.frame.size.height);
}

@end




#pragma mark - PostListTableViewController

@interface PostListTableViewController () <UITableViewDataSource, UITableViewDelegate, UIActionSheetDelegate> {
    UIRefreshControl *refreshControl;
    BOOL firstRefresh;
}

@end


@implementation PostListTableViewController


- (void)viewDidLoad {
    [super viewDidLoad];
    
    if (ANALYTICSON) {
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker set:kGAIScreenName value:@"세부 글 목록 화면"];
        [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    }
    
    self.title = [NSString stringWithFormat:@"%@", self.lectureInfo[@"title"]];
//    self.navigationController
    
    UIBarButtonItem * moreButton = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"navibtn_more"] style:UIBarButtonItemStyleDone target:self action:@selector(exportButtonClicked:)];
    moreButton.tintColor = [UIColor whiteColor];
    self.navigationItem.rightBarButtonItem = moreButton;
    if (self.fromPush) {
        UIBarButtonItem * closeButton;
        closeButton = [[UIBarButtonItem alloc] initWithTitle:@"닫기" style:UIBarButtonItemStylePlain target:self action:@selector(clickClose:)];
//        closeButton = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(clickClose:)];
        closeButton.tintColor = [UIColor whiteColor];
        self.navigationItem.leftBarButtonItem = closeButton;
    }
    
    
//    self.navigationController.navigationBar.barTintColor = [UIColor redColor];
    
    
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
    if (!sender) {
        [refreshControl beginRefreshing];
        CGPoint newOffset = CGPointMake(0, -[self.mainTableView contentInset].top);
        [self.mainTableView setContentOffset:newOffset animated:NO];
    }
    
    
    NSDictionary *param = @{@"lecture_id":self.lecture_id};
    NSLog(@"param:%@", param);
    [[DSTNetworkClient manager] getPostList:param block:^(NSDictionary *result, NSError *error) {
        NSLog(@"result:%@", result);
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


#pragma - TableView Delegate
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableViewe {
    return 2;
}
- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return (section==0)?@"Enable":@"Disable";
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return (section==0)?self.enableArray.count:self.disableArray.count;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"PostListTableViewCell";
    PostListTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[PostListTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    
    [cell setCellInfo:(indexPath.section==0)?self.enableArray[indexPath.row]:self.disableArray[indexPath.row]];
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    NSLog(@"%@", self.enableArray[indexPath.row]);
    if (indexPath.section==0) {
        if (self.enableArray[indexPath.row][@"url"] && ((NSString *)self.enableArray[indexPath.row][@"url"]).length) {
            NSURL *url = [NSURL URLWithString:self.enableArray[indexPath.row][@"url"]];
            TOWebViewController *webViewController = [[TOWebViewController alloc] initWithURL:url];
            [self.navigationController pushViewController:webViewController animated:YES];
        } else {
            [tableView deselectRowAtIndexPath:indexPath animated:YES];
        }
    } else {
        [tableView deselectRowAtIndexPath:indexPath animated:YES];
    }
    


}



- (void) exportButtonClicked:(id)sender {
    if (!self.lectureInfo[@"url"]) {
        [[[UIAlertView alloc] initWithTitle:@"링크가 없습니다" message:@"해당 강의의 링크 정보가 없습니다." delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
    } else {
        UIActionSheet *popup = [[UIActionSheet alloc] initWithTitle:self.lectureInfo[@"url"] delegate:self cancelButtonTitle:@"Cancel" destructiveButtonTitle:nil otherButtonTitles:
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
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"세부글목록화면"     // Event category (required)
                                                              action:@"More 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
}
- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (actionSheet.tag==1) {
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@", self.lectureInfo[@"url"]]];
        if (buttonIndex==[actionSheet cancelButtonIndex]) {
            
        } else if (buttonIndex==0) {
            TOWebViewController *webViewController = [[TOWebViewController alloc] initWithURL:url];
            [self.navigationController pushViewController:webViewController animated:YES];
            
            if (ANALYTICSON) {
                // 구글 어널리틱스
                id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
                [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"세부글목록화면"     // Event category (required)
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
                [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"세부글목록화면"     // Event category (required)
                                                                      action:@"More 클릭 - 링크내보내기"  // Event action (required)
                                                                       label:@"touchdown"          // Event label
                                                                       value:nil] build]];    // Event value
            }
        }
    }
}

- (void) clickClose:(id)sender {
    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
}
@end
