//
//  SplitViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 15..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "SplitViewController.h"
#import "LectureTableViewController.h"

@interface SplitViewController () <UISplitViewControllerDelegate>

@end

@implementation SplitViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.delegate = self;
    
    [PushController shared].rootViewController = self;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (UIStatusBarStyle)preferredStatusBarStyle {
    return UIStatusBarStyleLightContent;
}
- (BOOL) splitViewController:(UISplitViewController *)svc shouldHideViewController:(UIViewController *)vc inOrientation:(UIInterfaceOrientation)orientation {
    return NO;
}



- (void) pushViewController {
    if (self.lectureTableViewController) {
        if (self.lectureTableViewController.faculty_id == self.faculty_id) {
            return;
        }
        self.lectureTableViewController.faculty_id = self.faculty_id;
        self.lectureTableViewController.facultyInfo = self.facultyInfo;
        [self.lectureTableViewController.navigationController popToRootViewControllerAnimated:YES];
        
        [self.lectureTableViewController setTableInit];
        [self.lectureTableViewController refresh:nil];
    } else if (self.settingViewController) {
        if (self.nextsettingViewController) {
            [self.settingDetailViewController setViewControllers:@[self.nextsettingViewController] animated:NO];
        }
        
        
    }
    
}
@end
