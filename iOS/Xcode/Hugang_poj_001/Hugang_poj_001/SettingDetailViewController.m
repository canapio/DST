//
//  SettingDetailViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 15..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "SettingDetailViewController.h"

@interface SettingDetailViewController ()

@end

@implementation SettingDetailViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.mysplitViewController = (id)self.splitViewController;
    NSLog(@"detail view controller %p", self.mysplitViewController);
    if (self.splitViewController) {
        self.mysplitViewController.settingDetailViewController = self;
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
