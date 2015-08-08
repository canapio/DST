//
//  PushHistoryViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 4..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface PushHistoryTableViewCell : UITableViewCell
@property (nonatomic, retain) NSString *cellTitle;

@property (weak, nonatomic) IBOutlet UILabel *titleLabel;

@end


@interface PushHistoryViewController : UIViewController


@property (strong, nonatomic) IBOutlet UITableView *mainTableView;

@property (nonatomic, retain) NSMutableArray *enableArray;

@end
