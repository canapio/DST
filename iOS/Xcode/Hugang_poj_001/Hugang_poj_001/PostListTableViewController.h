//
//  DetailListTableViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>



@interface PostListTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UILabel *dotLabel;
@property (nonatomic, retain) NSDictionary *cellInfo;
@end

@interface PostListTableViewController : UITableViewController

@property (nonatomic, retain) NSString *lecture_id;
@property (nonatomic, retain) NSDictionary *lectureInfo;

@property (strong, nonatomic) IBOutlet UITableView *mainTableView;


@property (nonatomic, retain) NSMutableArray *enableArray;
@property (nonatomic, retain) NSMutableArray *disableArray;


- (void) exportButtonClicked:(id)sender ;


@property (nonatomic) BOOL fromPush;
- (void) clickPush:(id)sender ;
@end
