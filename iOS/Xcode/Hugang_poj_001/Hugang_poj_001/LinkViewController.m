//
//  LinkViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 8. 10..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "LinkViewController.h"
//#import "FavoController.h"

@interface LinkTableViewCell () {
    
}

@end
@implementation LinkTableViewCell


- (void)setCellInfo:(NSMutableDictionary *)cellInfo {
    _cellInfo = cellInfo;
    
    if (cellInfo[@"title"])
        self.titleLabel.text = [NSString stringWithFormat:@"%@", cellInfo[@"title"]];
    else
        self.titleLabel.text = @"-";
    
    if (cellInfo[@"image"]) {
        self.iconImageView.image = [UIImage imageNamed:cellInfo[@"image"]];
    } else {
        self.iconImageView.image = [UIImage imageNamed:@"icon_earth"];
    }
}
@end


@interface LinkViewController () <UITableViewDataSource, UITableViewDelegate>


@end

@implementation LinkViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    if (ANALYTICSON) {
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker set:kGAIScreenName value:@"링크 모음 화면"];
        [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    }
    
    // self.title = @"교수님 강의목록";
    
    
    self.mainTableView.delegate = self;
    self.mainTableView.dataSource = self;
    
//    firstRefresh = NO;
    
    
    
//    refreshControl = [[UIRefreshControl alloc] init];
//    [refreshControl addTarget:self action:@selector(refresh:) forControlEvents:UIControlEventValueChanged];
//    [self.mainTableView addSubview:refreshControl];
    
    
//    [FavoController shared].delegate = self;
    
    
//    [self setMainArray:[FavoController shared].favoArray];
//    NSArray *sectionArray = @[@{@"section_title":@"부산대 홈페이지 링크",
//                                @"section_array":@[@{@"title":@"",@"url":@""}]}
//                              ];
    NSMutableDictionary *sectionInfo;
    NSMutableArray *array_in_section;
    
    self.mainSectionArray = [NSMutableArray arrayWithCapacity:3];
    
    
    // 한 섹션
    sectionInfo = [NSMutableDictionary dictionary];
    sectionInfo[@"section_title"] = @"부산대 정컴 링크";
    array_in_section = [NSMutableArray array];
    [array_in_section addObject:@{@"title":@"정컴 홈페이지",
                                  @"url":@"http://cse.pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"정컴 학사 페이스북 페이지",
                                  @"url":@"https://www.facebook.com/pnucse",
                                  @"image":@"icon_facebook"}];
    [array_in_section addObject:@{@"title":@"정컴 커뮤니티 페이스북 그룹",
                                  @"url":@"https://www.facebook.com/groups/pnucse/",
                                  @"image":@"icon_facebook"}];
    sectionInfo[@"array_in_section"] = array_in_section;
    [self.mainSectionArray addObject:sectionInfo];
    
    
    
    
    // 한 섹션
    sectionInfo = [NSMutableDictionary dictionary];
    sectionInfo[@"section_title"] = @"부산대 링크";
    array_in_section = [NSMutableArray array];
    [array_in_section addObject:@{@"title":@"부산대학교",
                                  @"url":@"http://pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"부산대학교 도서관",
                                  @"url":@"http://pulip.pusan.ac.kr"}];
    [array_in_section addObject:@{@"title":@"부산대학교 학생지원시스템",
                                  @"url":@"http://onestop.pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"부산대학교 사이버강의실",
                                  @"url":@"http://linkus.pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"부산대학교 자유게시판",
                                  @"url":@"http://pusan.ac.kr/uPNU_homepage/kr/sub/sub.asp?menu_no=10010602"}];
    [array_in_section addObject:@{@"title":@"부산대학교 웹메일",
                                  @"url":@"http://webmail.pusan.ac.kr"}];
    [array_in_section addObject:@{@"title":@"부산대학교 PNU-연구실 안전정보망",
                                  @"url":@"https://labs-safety.pusan.ac.kr"}];
    [array_in_section addObject:@{@"title":@"부산대학교 공동실험실습관",
                                  @"url":@"http://labcenter.pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"부산대학교 마이포털",
                                  @"url":@"http://my.pusan.ac.kr"}];
    [array_in_section addObject:@{@"title":@"부산대학교 정보전산원",
                                  @"url":@"http://itc.pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"부산대학교 인터넷증명발급시스템",
                                  @"url":@"http://icert.pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"부산대학교 미래인재개발원",
                                  @"url":@"http://hrd.pusan.ac.kr/"}];
    [array_in_section addObject:@{@"title":@"부산대학교 방송국",
                                  @"url":@"http://pubs.pusan.ac.kr"}];
    sectionInfo[@"array_in_section"] = array_in_section;
    [self.mainSectionArray addObject:sectionInfo];
    
    
    
    
    
    
    
    
    [self.mainTableView reloadData];
}
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    //    NSLog(@"1:%@", NSStringFromCGRect(self.view.frame));
    
//    if (!firstRefresh) {[self refresh:nil];firstRefresh=YES;}
    
    for (int i=0; i<self.mainSectionArray.count; i++) {
        for (int j=0; j<[self.mainSectionArray[i] count]; j++) {
            [self.mainTableView deselectRowAtIndexPath:[NSIndexPath indexPathForRow:j inSection:i] animated:YES];
        }
    }
}
- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    //    NSLog(@"2:%@", NSStringFromCGRect(self.view.frame));
}

//- (void) setMainArray:(NSArray *)mainArray {
//    _mainArray = mainArray;
//}

#pragma - TableView Delegate
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return self.mainSectionArray.count;
}
- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return self.mainSectionArray[section][@"section_title"];
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.mainSectionArray[section][@"array_in_section"] count];
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"LinkTableViewCell";
    LinkTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[LinkTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    
    
    [cell setCellInfo:self.mainSectionArray[indexPath.section][@"array_in_section"][indexPath.row]];
    
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
//    [self.navigationController pushViewController:viewcontroller animated:YES];
//    [self.mainTableView deselectRowAtIndexPath:indexPath animated:YES];
    
    NSURL *url = [NSURL URLWithString:self.mainSectionArray[indexPath.section][@"array_in_section"][indexPath.row][@"url"]];
    TOWebViewController *webViewController = [[TOWebViewController alloc] initWithURL:url];
    [self.navigationController pushViewController:webViewController animated:YES];
}


//#pragma mark - FavoDelegate
//- (void)reloadTableView {
//    [self setMainArray:[FavoController shared].favoArray];
//    [self.mainTableView reloadData];
//}

@end
