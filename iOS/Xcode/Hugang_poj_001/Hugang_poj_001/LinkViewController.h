//
//  LinkViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 8. 10..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>

// #import "FavoController.h"

@interface LinkTableViewCell : UITableViewCell
@property (nonatomic, retain) NSMutableDictionary *cellInfo;

//- (IBAction)clickFavo:(id)sender;
@property (weak, nonatomic) IBOutlet UIImageView *iconImageView;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;


@end


@interface LinkViewController : UIViewController //<FavoDelegate>


@property (weak, nonatomic) IBOutlet UITableView *mainTableView;

//@property (nonatomic, retain) NSArray *mainArray;
@property (nonatomic, retain) NSMutableArray *mainSectionArray;
@end
