//
//  FavoViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 14..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "FavoController.h"

@interface FavoTableViewCell : UITableViewCell
@property (nonatomic, retain) NSMutableDictionary *cellInfo;

- (IBAction)clickFavo:(id)sender;
@property (weak, nonatomic) IBOutlet UIButton *favobtn;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;
@property (weak, nonatomic) IBOutlet UILabel *descLabel;

@property (weak, nonatomic) IBOutlet UILabel *nLabel;


@end


@interface FavoViewController : UIViewController <FavoDelegate>


@property (strong, nonatomic) IBOutlet UITableView *mainTableView;


@property (nonatomic, retain) NSMutableArray *enableArray;
@property (nonatomic, retain) NSMutableArray *disableArray;




@end
