//
//  FacultyTableViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SplitViewController.h"
@interface FacultyTableViewCell : UITableViewCell


@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;
@property (weak, nonatomic) IBOutlet UIView *statusView;

@property (nonatomic, retain) NSDictionary *cellInfo;
@end


@interface FacultyTableViewController : UIViewController
@property (strong, nonatomic) IBOutlet UITableView *mainTableView;
 

- (IBAction)exportButtonClicked:(id)sender;


@property (nonatomic, retain) NSMutableArray *enableArray;
@property (nonatomic, retain) NSMutableArray *disableArray;




@property (nonatomic, retain) SplitViewController *splitViewController;
@end
