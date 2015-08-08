//
//  NoticeViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 3..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NoticeTableViewCell : UITableViewCell

@property (nonatomic, retain) NSMutableDictionary *cellInfo;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;


@end

@interface NoticeViewController : UIViewController


@property (strong, nonatomic) IBOutlet UITableView *mainTableView;

@property (nonatomic, retain) NSMutableArray *enableArray;


@end
