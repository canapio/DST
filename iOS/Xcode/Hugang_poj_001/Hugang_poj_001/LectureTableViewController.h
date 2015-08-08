//
//  LectureTableViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SplitViewController.h"

@interface LecutreTableViewCell : UITableViewCell
@property (nonatomic, retain) NSMutableDictionary *cellInfo;

- (IBAction)clickFavo:(id)sender;
@property (weak, nonatomic) IBOutlet UIButton *favobtn;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;

@property (weak, nonatomic) IBOutlet UILabel *nLabel;


@end

@interface LectureTableViewController : UITableViewController

@property (nonatomic, retain) NSString *faculty_id;
@property (nonatomic, retain) NSDictionary *facultyInfo;

@property (strong, nonatomic) IBOutlet UITableView *mainTableView;


@property (nonatomic, retain) NSMutableArray *enableArray;
@property (nonatomic, retain) NSMutableArray *disableArray;


- (void) refresh:(id)sender ;
- (void) setTableInit ;
@property (nonatomic, retain) SplitViewController *splitViewController;
@end
