//
//  SettingViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 3..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SplitViewController.h"
@interface SettingViewController : UITableViewController



@property (weak, nonatomic) IBOutlet UISwitch *pushSwitch;
@property (strong, nonatomic) IBOutlet UITableView *mainTableView;


@property (nonatomic, retain) SplitViewController *splitViewController;
@end
