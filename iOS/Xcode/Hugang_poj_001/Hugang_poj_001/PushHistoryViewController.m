//
//  PushHistoryViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 4..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "PushHistoryViewController.h"
#import "FavoController.h"




@interface PushHistoryTableViewCell () {
    
}

@end
@implementation PushHistoryTableViewCell



- (void)setCellTitle:(NSString *)cellTitle {
    _cellTitle = cellTitle;
    NSLog(@"cellTitle:%@", cellTitle);
    self.titleLabel.text = [NSString stringWithFormat:@"%@", cellTitle];
}

@end





@interface PushHistoryViewController () <UITableViewDataSource, UITableViewDelegate> {
    UIRefreshControl *refreshControl;
    BOOL firstRefresh;
}
@end

@implementation PushHistoryViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.mainTableView.delegate = self;
    self.mainTableView.dataSource = self;
    
    self.title = @"푸시 히스토리 목록";
    
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

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) refresh:(id)sender {
    if (!sender) {
        [refreshControl beginRefreshing];
        CGPoint newOffset = CGPointMake(0, -[self.mainTableView contentInset].top);
        [self.mainTableView setContentOffset:newOffset animated:NO];
    }
    
    NSString *identifier = [[UIDevice currentDevice].identifierForVendor UUIDString];
    NSDictionary *param = @{@"deviceid":identifier, @"platform":@"iOS"};
    NSLog(@"param:%@", param);
    [[DSTNetworkClient manager] getPushHistoryList2:param block:^(NSDictionary *result, NSError *error) {
        NSLog(@"getPushHistoryList: end %@", result);
        [refreshControl endRefreshing];
        if (error) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"네트워크 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else if ([result[ERROR_CODE] intValue]!=0) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"서버 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else {
//            NSLog(@"result:%@", result[@"data"][@"list"]);
//            NSArray *arr = result[@"data"][@"list"];
//            NSMutableArray *marr = [NSMutableArray arrayWithCapacity:arr.count];
//            for (int i=0; i<arr.count; i++) [marr addObject:[NSMutableDictionary dictionaryWithDictionary:arr[i]]];
            self.enableArray = [NSMutableArray arrayWithArray:result[@"data"][@"list"]];
//            [self setMainArray:marr];
            [self.mainTableView reloadData];
        }
    }];
}

#pragma - TableView Delegate
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.enableArray.count;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"PushHistoryTableViewCell";
    PushHistoryTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[PushHistoryTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    
    
    [cell setCellTitle:self.enableArray[indexPath.row]];
    
    
    return cell;
}


@end
