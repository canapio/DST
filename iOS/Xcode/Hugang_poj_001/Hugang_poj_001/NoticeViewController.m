//
//  NoticeViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 3..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "NoticeViewController.h"
#import "FavoController.h"





@interface NoticeTableViewCell ()

@end
@implementation NoticeTableViewCell

- (void)setCellInfo:(NSMutableDictionary *)cellInfo {
    _cellInfo = cellInfo;
    NSLog(@"cellInfo:%@" ,cellInfo);
    self.titleLabel.text = [NSString stringWithFormat:@"%@ %@", cellInfo[@"title"], cellInfo[@"description"]];
    
}

@end



@interface NoticeViewController ()<UITableViewDataSource, UITableViewDelegate> {
    UIRefreshControl *refreshControl;
    BOOL firstRefresh;
}

@end

@implementation NoticeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.mainTableView.delegate = self;
    self.mainTableView.dataSource = self;
    
    self.title = @"PNU CSE 공지 목록";
    
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
    
    
    NSDictionary *param = @{};
    [[DSTNetworkClient manager] getNoticeList:param block:^(NSDictionary *result, NSError *error) {
        [refreshControl endRefreshing];
        if (error) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"네트워크 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else if ([result[ERROR_CODE] intValue]!=0) {
            [[[UIAlertView alloc] initWithTitle:@"에러" message:@"서버 에러" delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else {
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
    static NSString *CellIdentifier = @"NoticeTableViewCell";
    NoticeTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[NoticeTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    
    
    [cell setCellInfo:self.enableArray[indexPath.row]];
    
    
    return cell;
}


@end
