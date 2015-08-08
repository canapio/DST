//
//  SplitViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 15..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FacultyTableViewController, LectureTableViewController, PostListTableViewController, SettingViewController;
@interface SplitViewController : UISplitViewController


@property (nonatomic, retain) NSIndexPath *indexPath;
@property (nonatomic, retain) NSString *faculty_id;
@property (nonatomic, retain) NSDictionary *facultyInfo;


- (void) pushViewController ;

@property (nonatomic, retain) FacultyTableViewController *facultyTableViewController;
@property (nonatomic, retain) LectureTableViewController *lectureTableViewController;
// @property (nonatomic, retain) PostListTableViewController *postListTableViewController;
@property (nonatomic, retain) SettingViewController *settingViewController;
@property (nonatomic, retain) UINavigationController *settingDetailViewController;
@property (nonatomic, retain) UIViewController *nextsettingViewController;
@end
