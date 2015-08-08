//
//  ViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 4. 17..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "ViewController.h"

@interface ViewController () <UITableViewDelegate, UITableViewDataSource>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    self.mainTableView.delegate = self;
    self.mainTableView.dataSource = self;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma - TableView Delegate
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 5;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"UITableViewCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    
    
//    UILabel *title1 = (UILabel *)[cell viewWithTag:1];
//    UILabel *title2 = (UILabel *)[cell viewWithTag:2];
    UIView *statusview = (UIView *)[cell viewWithTag:3];
    
    
    statusview.layer.cornerRadius = statusview.frame.size.width/2;
    
    
    return cell;
}

@end
