//
//  IntroHelpViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 27..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "IntroHelpViewController.h"

#define MAXPAGE 5
#define COLOR_BG [UIColor clearColor] //[UIColor colorWithWhite:1.f alpha:.1f]//
#define COLOR_INTROBG [UIColor clearColor]//[UIColor colorWithRed:((float)(arc4random()%100))/100.f green:((float)(arc4random()%100))/100.f blue:((float)(arc4random()%100))/100.f alpha:.12f]


#define GAP_BUTTON_PLEASE 10.f
#define TOPGAP_BUTTON_PLEASE 10.f

@interface UIImage (Extras)
- (UIImage *)imageByScalingProportionallyToSize:(CGSize)targetSize;
@end;
@implementation UIImage (Extras)

- (UIImage *)imageByScalingProportionallyToSize:(CGSize)targetSize {
    
    UIImage *sourceImage = self;
    UIImage *newImage = nil;
    
    CGSize imageSize = sourceImage.size;
    CGFloat width = imageSize.width;
    CGFloat height = imageSize.height;
    
    CGFloat targetWidth = targetSize.width;
    CGFloat targetHeight = targetSize.height;
    
    CGFloat scaleFactor = 0.0;
    CGFloat scaledWidth = targetWidth;
    CGFloat scaledHeight = targetHeight;
    
    CGPoint thumbnailPoint = CGPointMake(0.0,0.0);
    
    if (!CGSizeEqualToSize(imageSize, targetSize)) {
        
        CGFloat widthFactor = targetWidth / width;
        CGFloat heightFactor = targetHeight / height;
        
        if (widthFactor < heightFactor)
            scaleFactor = widthFactor;
        else
            scaleFactor = heightFactor;
        
        scaledWidth  = width * scaleFactor;
        scaledHeight = height * scaleFactor;
        
        // center the image
        
        if (widthFactor < heightFactor) {
            thumbnailPoint.y = (targetHeight - scaledHeight) * 0.5;
        } else if (widthFactor > heightFactor) {
            thumbnailPoint.x = (targetWidth - scaledWidth) * 0.5;
        }
    }
    
    
    // this is actually the interesting part:
    
    UIGraphicsBeginImageContextWithOptions(targetSize, NO, 0);
    
    CGRect thumbnailRect = CGRectZero;
    thumbnailRect.origin = thumbnailPoint;
    thumbnailRect.size.width  = scaledWidth;
    thumbnailRect.size.height = scaledHeight;
    
    [sourceImage drawInRect:thumbnailRect];
    
    newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    if(newImage == nil) NSLog(@"could not scale image");
    
    
    return newImage ;
}

@end

@interface IntroHelpViewController () <UIScrollViewDelegate, UIActionSheetDelegate> {
    BOOL isipad;
    CGSize winSize;
    
    UIImageView *bgImageView ;
    UIScrollView *mainScrollView ;
    UIPageControl *mainScrollPageControl;
    
    UILabel *subtitleLabel;
    
    
    UIView *introView001;
    UIView *introView002;
    UIView *introView003;
    UIView *introView004;
    UIView *introView005;
    UILabel *introTitleLabel001;
    UILabel *introTitleLabel002;
    UILabel *introTitleLabel003;
    UILabel *introTitleLabel004;
    UILabel *introLabel001;
    UILabel *introLabel002;
    UILabel *introLabel003;
    UILabel *introLabel004;
    UIImageView *introImageView001;
    UIImageView *introImageView002;
    UIView *warnView;
    UIView *shareView;
 
    UIButton *rateButton;
    UIButton *shareButton;
    
    UIButton *okButton;
}

@end

@implementation IntroHelpViewController

- (void)viewDidLoad {
    isipad = ISIPAD;
    
    [super viewDidLoad];
    if (ANALYTICSON) {
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker set:kGAIScreenName value:@"인트로 화면"];
        [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
    }
    
    
    
    
    
    
    
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor blackColor];
    
    // 1. 배경 처리
    //Get a UIImage from the UIView
    winSize = self.view.frame.size;
    if (isipad) {
        if (winSize.width>winSize.height) winSize = CGSizeMake(winSize.height, winSize.width);
    } else {
        if (winSize.width>winSize.height) winSize = CGSizeMake(winSize.height, winSize.width);
    }
    UIImage *bgImage = [UIImage imageNamed:@"introbg001.jpg"];
    CGFloat bgW = winSize.height*bgImage.size.width/bgImage.size.height;
    CGFloat bgH = winSize.height;
    CGRect bgRect = CGRectMake(0.f, 0.f, 1.2f*bgW, 1.2f*bgH);
    
    //Place the UIImage in a UIImageView
    bgImageView = [[UIImageView alloc] initWithFrame:bgRect];
    [self.view addSubview:bgImageView];
    bgImageView.alpha = 0;
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        UIImageView *myView = [[UIImageView alloc] initWithFrame:bgRect];
        myView.image = bgImage;
        UIGraphicsBeginImageContext(myView.bounds.size);
        [myView.layer renderInContext:UIGraphicsGetCurrentContext()];
        UIImage *viewImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        
        //Blur the UIImage with a CIFilter
        CIImage *imageToBlur = [CIImage imageWithCGImage:viewImage.CGImage];
        CIFilter *gaussianBlurFilter = [CIFilter filterWithName: @"CIGaussianBlur"];
        [gaussianBlurFilter setValue:imageToBlur forKey: @"inputImage"];
        [gaussianBlurFilter setValue:[NSNumber numberWithFloat: 5.f] forKey: @"inputRadius"];
        CIImage *resultImage = [gaussianBlurFilter valueForKey: @"outputImage"];
        UIImage *endImage = [[UIImage alloc] initWithCIImage:resultImage];
        
        dispatch_async(dispatch_get_main_queue(), ^(void) {
            bgImageView.image = endImage;
            [UIView animateWithDuration:3.f animations:^{
                bgImageView.alpha = 1;
            }];
        });
    });
    if (isipad) winSize = self.view.frame.size;

    if (isipad) {
        self.view.autoresizesSubviews = YES;
        [self.view setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    }
    
//    NSLog(@"winSize::%@", NSStringFromCGSize(winSize));
    CGFloat bottomGap = 50.f;
    // 2. UIScrollView와 하단 페이징 표시
    mainScrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, winSize.width, winSize.height)];
    [mainScrollView setPagingEnabled:YES];
    mainScrollView.contentSize = CGSizeMake(winSize.width*MAXPAGE, winSize.height);
    mainScrollView.showsHorizontalScrollIndicator = NO;
    mainScrollView.delegate = self;
    mainScrollView.backgroundColor = [UIColor clearColor];//[UIColor colorWithRed:1.f green:0.f blue:0.f alpha:.1f];
    if (isipad) {
        mainScrollView.autoresizesSubviews = YES;
        [mainScrollView setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    }
    
    [self.view addSubview:mainScrollView];
    
    mainScrollPageControl = [[UIPageControl alloc] initWithFrame:CGRectMake(0, winSize.height-bottomGap, winSize.width, bottomGap)];
    mainScrollPageControl.currentPage = 0;
    mainScrollPageControl.numberOfPages = MAXPAGE;
    mainScrollPageControl.backgroundColor = COLOR_INTROBG;
//    mainScrollPageControl.autoresizesSubviews = YES;
//    [mainScrollPageControl setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    [mainScrollPageControl addTarget:self action:@selector(pageChangeValue:) forControlEvents:UIControlEventValueChanged];
    [self.view addSubview:mainScrollPageControl];
    
    
    
    
    // 3. UIScrollView위에 각 뷰 올리기
    NSString *text = @"교수님을 누르면\n다음화면으로 넘어갑니다.";
    if (isipad) text = @"교수님을 누르면\n강의목록이 나타납니다.";
    introView001 = [self makeIntroPageWithImageName:isipad?@"introscreenshotipad001":@"introscreenshot001"
                                              title:@"직관적인"
                                               text:text];
    introView001.center = CGPointMake(mainScrollView.frame.size.width*(.5f+0.f), mainScrollView.frame.size.height/2.f);
    introView001.backgroundColor = COLOR_INTROBG;
    [mainScrollView addSubview:introView001];
    introTitleLabel001 = (id)[introView001 viewWithTag:322];
    introLabel001 = (id)[introView001 viewWithTag:323];
    introImageView001 = (id)[introView001 viewWithTag:324];
    
    
    introView002 = [self makeIntroPageWithImageName:isipad?@"introscreenshotipad001":@"introscreenshot002"
                                              title:@"접근성 있는"
                                               text:@"별을 누르면 새 글이 나올때마다\n푸시알림이 옵니다."];
    introView002.center = CGPointMake(mainScrollView.frame.size.width*(.5f+1.f), mainScrollView.frame.size.height/2.f);
    introView002.backgroundColor = COLOR_INTROBG;
    [mainScrollView addSubview:introView002];
    introTitleLabel002 = (id)[introView002 viewWithTag:322];
    introLabel002 = (id)[introView002 viewWithTag:323];
    introImageView002 = (id)[introView002 viewWithTag:324];
    
    introView003 = [self makeIntroPageWithImageName:isipad?@"introscreenshotipad002":@"introscreenshot003"
                                              title:@"신뢰성 높은"
                                               text:@"게시글을 누르면 웹뷰를 띄어서\n포스팅된 글을 보여줍니다."];
    introView003.center = CGPointMake(mainScrollView.frame.size.width*(.5f+2.f), mainScrollView.frame.size.height/2.f);
    introView003.backgroundColor = COLOR_INTROBG;
    [mainScrollView addSubview:introView003];
    introTitleLabel003 = (id)[introView003 viewWithTag:322];
    introLabel003 = (id)[introView003 viewWithTag:323];
    
    introView004 = [self makeIntroPageWithImageName:isipad?@"introscreenshotipad003":@"introscreenshot004"
                                              title:@"확장이 가능한"
                                               text:@"실제 포스팅된 글은 크롬이나\n사파리에 내보낼 수 있습니다."];
    introView004.center = CGPointMake(mainScrollView.frame.size.width*(.5f+3.f), mainScrollView.frame.size.height/2.f);
    introView004.backgroundColor = COLOR_INTROBG;
    [mainScrollView addSubview:introView004];
    introTitleLabel004 = (id)[introView004 viewWithTag:322];
    introLabel004 = (id)[introView004 viewWithTag:323];
    
    
    // 4. 마지막 페이지까지 올리고 카카오톡 연동
//    introView005 = [[UIView alloc] initWithFrame:CGRectMake(mainScrollView.frame.size.width*0, 0, mainScrollView.frame.size.width, mainScrollView.frame.size.height-bottomGap)];
    introView005 = [self makeIntroPageWithImageName:nil
                                              title:@""
                                               text:@""];
    introView005.backgroundColor = [UIColor clearColor];
    introView005.center = CGPointMake(mainScrollView.frame.size.width*(.5f+4.f), mainScrollView.frame.size.height/2.f);
    introView005.backgroundColor = COLOR_INTROBG;
    introView005.autoresizesSubviews = YES;
    [introView005 setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    [mainScrollView addSubview:introView005];
    
    
    
    
    
    
    
    
    
    
    

    CGFloat minWidth = (self.view.frame.size.width<self.view.frame.size.height)?self.view.frame.size.width:self.view.frame.size.height;
//    CGFloat maxWidth = (self.view.frame.size.width>self.view.frame.size.height)?self.view.frame.size.width:self.view.frame.size.height;
//    CGFloat horizonGap = 20.f + (minWidth/320.f-1.f)*60.f;
//    CGFloat marginGap = 10.f;
//    CGFloat buttonTopGap = TOPGAP_BUTTON_PLEASE;
    CGFloat buttonGap = GAP_BUTTON_PLEASE;
    CGFloat maxHeight = 70.f;
//    CGFloat pleaseGap = 22.f + (winSize.width/320.f-1.f)*40.f;
    CGFloat fontSize = 17.f + (minWidth/320.f-1.f)*14.f;
    if (isipad) fontSize = 24.f;
    rateButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [rateButton setTitle:@"리뷰하기" forState:UIControlStateNormal];
    rateButton.titleLabel.font = [UIFont fontWithName:@"HelveticaNeue-Light" size:fontSize];
    rateButton.frame = CGRectMake(0, 0, winSize.width*.4f, 50.f);
    rateButton.center = CGPointMake(introView005.frame.size.width/2.f-(rateButton.frame.size.width+buttonGap)/2.f,
                                    introView005.frame.size.height*.44f);
    rateButton.backgroundColor = [UIColor colorWithWhite:1.f alpha:.08f];
    [introView005 addSubview:rateButton];
    
    
    shareButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [shareButton setTitle:@"공유하기" forState:UIControlStateNormal];
    shareButton.titleLabel.font = [UIFont fontWithName:@"HelveticaNeue-Light" size:fontSize];
//    shareButton.frame = CGRectMake(0, 0, minWidth/2.f-horizonGap-buttonGap/2.f,
//                                  maxWidth-bottomGap-pLabelBG1.frame.origin.y-pLabelBG1.frame.size.height-buttonTopGap);
//    [shareButton sizeToFit];
    shareButton.frame = CGRectMake(0, 0, winSize.width*.4f, 50.f);
    shareButton.center = CGPointMake(introView005.frame.size.width/2.f+(shareButton.frame.size.width+buttonGap)/2.f,
                                     introView005.frame.size.height*.44f);
    shareButton.backgroundColor = [UIColor colorWithWhite:1.f alpha:.08f];
    [introView005 addSubview:shareButton];
    
    if (rateButton.frame.size.height>maxHeight) {
        rateButton.frame = CGRectMake(rateButton.frame.origin.x, rateButton.frame.origin.y, rateButton.frame.size.width, maxHeight);
    }
    if (shareButton.frame.size.height>maxHeight) {
        shareButton.frame = CGRectMake(shareButton.frame.origin.x, shareButton.frame.origin.y, shareButton.frame.size.width, maxHeight);
    }
    UIImage *rateImage = [UIImage imageNamed:@"rateicon"];
    UIImage *shareImage = [UIImage imageNamed:@"shareicon"];
    
    if (shareImage.size.height>shareButton.frame.size.height) {
        CGFloat buttonHeight = shareButton.frame.size.height;
        buttonHeight -= 10.f;
        rateImage = [rateImage imageByScalingProportionallyToSize:CGSizeMake(rateImage.size.width*(buttonHeight/rateImage.size.height), buttonHeight)];
        shareImage = [shareImage imageByScalingProportionallyToSize:CGSizeMake(shareImage.size.width*(buttonHeight/shareImage.size.height), buttonHeight)];
    }
//    [rateButton setImage:rateImage forState:UIControlStateNormal];
//    [shareButton setImage:shareImage forState:UIControlStateNormal];
    
    
    
    rateButton.imageEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 10.f);
    shareButton.imageEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 10.f);
    [rateButton addTarget:self action:@selector(clickRate:) forControlEvents:UIControlEventTouchUpInside];
    [shareButton addTarget:self action:@selector(clickShare:) forControlEvents:UIControlEventTouchUpInside];
    
    
    okButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [okButton setTitle:@"넘어가기" forState:UIControlStateNormal];
    okButton.frame = CGRectMake(0, 0, shareButton.frame.size.width+shareButton.frame.origin.x-rateButton.frame.origin.x, 44.f);
    okButton.center = CGPointMake(winSize.width/2.f,
                                  shareButton.center.y + shareButton.frame.size.height + okButton.frame.size.height/2.f+30.f);
    [self.view addSubview:okButton];
    [okButton addTarget:self action:@selector(clickOK:) forControlEvents:UIControlEventTouchUpInside];
    okButton.alpha = 0;
    
    
    
    
    
    // 5. UIScrollView Delegate 구현 (배경과 싱크 맞추기)
    CGFloat scrollRate = mainScrollView.contentOffset.x/mainScrollView.contentSize.width;
    CGFloat scrollDist = (bgRect.size.width-winSize.height);
    if (isipad) scrollDist/=2.f;
    bgImageView.center = CGPointMake(winSize.width/2.f+scrollDist*(.5f-scrollRate), winSize.height/2.f);
    
    
    CGFloat subtitleLabelHeight = 25.f;
    if (isipad) subtitleLabelHeight = 20.f;
    subtitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, winSize.height-subtitleLabelHeight, winSize.width-10.f*2.f, subtitleLabelHeight)];
    subtitleLabel.backgroundColor = [UIColor clearColor];
    subtitleLabel.textColor = [UIColor whiteColor];
    subtitleLabel.alpha = .17f;
    subtitleLabel.text = @"※ 배경 사진은 최원영(09) 학우께서 제공해주신 제도관 사진입니다. 학우분들의 지원에 감사드립니다.";
    subtitleLabel.font = [UIFont systemFontOfSize:13.f];
    subtitleLabel.textAlignment = NSTextAlignmentCenter;
    subtitleLabel.adjustsFontSizeToFitWidth = YES;
    subtitleLabel.minimumScaleFactor = .3f;
    mainScrollPageControl.autoresizesSubviews = YES;
    [mainScrollPageControl setAutoresizingMask:UIViewAutoresizingFlexibleTopMargin];
    [self.view addSubview:subtitleLabel];
    
    
//    [self.view addObserver:self forKeyPath:@"frame" options:NSKeyValueObservingOptionOld|NSKeyValueObservingOptionNew context:NULL];
    
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self performSelectorOnMainThread:@selector(setUI) withObject:nil waitUntilDone:NO];
}
- (void) setUI {
    CGFloat bottomGap = 50.f;
    mainScrollPageControl.frame = CGRectMake(0, winSize.height-bottomGap, winSize.width, bottomGap);
}

-(NSUInteger)supportedInterfaceOrientations{
    return (ISIPAD)?UIInterfaceOrientationMaskAll:UIInterfaceOrientationMaskPortrait;
}

- (BOOL)shouldAutorotate {
    CGFloat bottomGap = 50.f;
    
    if (!ISIPAD) {
        mainScrollPageControl.frame = CGRectMake(0, winSize.height-bottomGap, winSize.width, bottomGap);
        return NO;
    }
    winSize = self.view.frame.size;
    
    CGFloat pageRate = mainScrollView.contentOffset.x/mainScrollView.contentSize.width;
    mainScrollView.contentSize = CGSizeMake(self.view.frame.size.width*MAXPAGE, self.view.frame.size.height);
    mainScrollView.contentOffset = CGPointMake(pageRate*mainScrollView.contentSize.width, 0);
    
    
    mainScrollPageControl.frame = CGRectMake(0, self.view.frame.size.height-bottomGap, self.view.frame.size.width, bottomGap);
    
    CGFloat subtitleLabelHeight = 25.f;
    if (isipad) subtitleLabelHeight = 20.f;
    subtitleLabel.frame = CGRectMake(10, self.view.frame.size.height-subtitleLabelHeight, self.view.frame.size.width-10.f*2.f, subtitleLabelHeight);
    
    introView001.center = CGPointMake(mainScrollView.frame.size.width*(.5f), introView001.center.y);
    introView002.center = CGPointMake(mainScrollView.frame.size.width*(.5f+1.f), introView002.center.y);
    introView003.center = CGPointMake(mainScrollView.frame.size.width*(.5f+2.f), introView003.center.y);
    introView004.center = CGPointMake(mainScrollView.frame.size.width*(.5f+3.f), introView004.center.y);
    introView005.center = CGPointMake(mainScrollView.frame.size.width*(.5f+4.f), introView005.center.y);
    
    if (isipad) {
        [self setIntroViewLayout:introView001];
        [self setIntroViewLayout:introView002];
        [self setIntroViewLayout:introView003];
        [self setIntroViewLayout:introView004];
        [self setIntroViewLayout:introView005];
        
        UIView *pleaseLabelBG = [introView005 viewWithTag:324];
        
        shareButton.center = CGPointMake(introView005.frame.size.width/2.f-shareButton.frame.size.width/2.f-GAP_BUTTON_PLEASE/2.f, pleaseLabelBG.frame.origin.y+pleaseLabelBG.frame.size.height+shareButton.frame.size.height/2.f+TOPGAP_BUTTON_PLEASE);
        rateButton.center = CGPointMake(introView005.frame.size.width/2.f+rateButton.frame.size.width/2.f+GAP_BUTTON_PLEASE/2.f, pleaseLabelBG.frame.origin.y+pleaseLabelBG.frame.size.height+rateButton.frame.size.height/2.f+TOPGAP_BUTTON_PLEASE);
        
        okButton.center = CGPointMake(self.view.frame.size.width - 55, 44);
    }
    return YES;
}
//- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
//    if([keyPath isEqualToString:@"frame"]) {
//        
//        
//    }
//    
//}
#define BOTTOMGAP_TITLE 20.f
#define HEIGHT_LABEL 100.f
#define HEIGHT_TITLE 50.f
- (void) setIntroViewLayout:(UIView *)introView {
    UILabel *introTitleLabel = (id)[introView viewWithTag:322];
    UILabel *introLabel = (id)[introView viewWithTag:323];
    UIImageView *introImageView = (id)[introView viewWithTag:324];
    introImageView.center = CGPointMake(introView.frame.size.width/2.f, introView.frame.size.height/2.f);
    
    if (introLabel) {
        introLabel.frame = CGRectMake(0, 0, introView.frame.size.width, HEIGHT_LABEL);
        introLabel.center = CGPointMake(introView.frame.size.width/2.f, introView.frame.size.height/2.f+introImageView.frame.size.height/2.f+HEIGHT_LABEL/2.f);
    }
    
    if (introTitleLabel) {
        introTitleLabel.frame = CGRectMake(0, 0, introView.frame.size.width, HEIGHT_TITLE);
        introTitleLabel.center = CGPointMake(introView.frame.size.width/2.f, introView.frame.size.height/2.f-introImageView.frame.size.height/2.f-BOTTOMGAP_TITLE-introTitleLabel.frame.size.height/2.f);
    }
    
}



- (UIView *) makeIntroPageWithImageName:(NSString *)imageName title:(NSString *)title text:(NSString *)text {
    CGFloat bottomGap = 60.f + (winSize.width/320.f - 1.f)*50.f;
    CGFloat topGap = 10.f + (winSize.width/320.f - 1.f)*50.f;
    CGFloat titleHeight = 50.f;
    CGFloat titleBottomHap = BOTTOMGAP_TITLE;
    CGFloat labelHeight = (80.f + (winSize.width/320.f - 1.f)*70.f);
    
    CGFloat introImageHeight = mainScrollView.frame.size.height-topGap-bottomGap-labelHeight-titleBottomHap-titleHeight;
    CGFloat titleFontSize = 35.f + (winSize.width/320.f-1.f)*25.f;
    CGFloat subtitleFontSize = 17.f + (winSize.width/320.f-1.f)*9.f;
    
    if (isipad) {
        titleBottomHap = BOTTOMGAP_TITLE;
        topGap = 0.f;
        
        labelHeight = HEIGHT_LABEL;
        bottomGap = 120.f;
        
        titleFontSize = 60.f;
        subtitleFontSize = 25.f;
        
        CGFloat smallHeight = (mainScrollView.frame.size.height<mainScrollView.frame.size.width)?mainScrollView.frame.size.height:mainScrollView.frame.size.width;
        introImageHeight = smallHeight-topGap-bottomGap-labelHeight-titleBottomHap-titleHeight;
        
        
    }
    
    
    UIImage *introIamge = nil;
    UIImageView *introIamgeView = nil;
    UILabel *introTitleLabel;
    UILabel *introLabel = nil;
    
    
    UIView *introView = [[UIView alloc] initWithFrame:CGRectMake(mainScrollView.frame.size.width*0, 0, mainScrollView.frame.size.width, mainScrollView.frame.size.height-bottomGap)];
    introView.backgroundColor = [UIColor clearColor];
    //[mainScrollView addSubview:introView];
    if (imageName) {
        introIamge = [UIImage imageNamed:imageName];
        introIamgeView = [[UIImageView alloc] initWithImage:introIamge];
        introIamgeView.frame = CGRectMake(0, topGap+titleHeight+titleBottomHap, introImageHeight*introIamge.size.width/introIamge.size.height, introImageHeight);
        introIamgeView.center = CGPointMake(introView.frame.size.width/2.f, introIamgeView.center.y);
        if (introIamge.size.height>introIamgeView.frame.size.height) {
            introIamgeView.contentMode = UIViewContentModeScaleAspectFit;
        } else {
            introIamgeView.contentMode = UIViewContentModeCenter;
        }
        // layer.shadow 그림자 만들고
        introIamgeView.layer.shadowOffset = CGSizeMake(0, 2.5);
        introIamgeView.layer.shadowRadius = 8;
        introIamgeView.layer.shadowColor = [[UIColor blackColor] CGColor];
        introIamgeView.layer.shadowOpacity = .92f;
        introIamgeView.layer.shadowPath = [UIBezierPath bezierPathWithRoundedRect:introIamgeView.bounds cornerRadius:introIamgeView.layer.cornerRadius].CGPath;
        introIamgeView.tag = 324;
        [introView addSubview:introIamgeView];
    }
    //    NSLog(@"%@", NSStringFromCGRect(introIamgeView.frame));
    
    
    
    introTitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, topGap, introView.frame.size.width, titleHeight)];
    introTitleLabel.text = title;
    introTitleLabel.font = [UIFont fontWithName:@"HelveticaNeue-Light" size:titleFontSize];
    introTitleLabel.textColor = [UIColor whiteColor];
    introTitleLabel.backgroundColor = COLOR_BG;
    introTitleLabel.textAlignment = NSTextAlignmentCenter;
    introTitleLabel.tag = 322;
    [introView addSubview:introTitleLabel];
    
    
    introLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, mainScrollView.frame.size.height-bottomGap-labelHeight, mainScrollView.frame.size.width, labelHeight)];
    introLabel.numberOfLines = 0;
    //    introLabel.font = [UIFont systemFontOfSize:22.f weight:3.f];
    introLabel.font = [UIFont fontWithName:@"HelveticaNeue" size:subtitleFontSize];
    introLabel.backgroundColor = COLOR_BG;
    introLabel.textColor = [UIColor whiteColor];
    introLabel.text = text;
    introLabel.textAlignment = NSTextAlignmentCenter;
    introLabel.tag = 323;
    [introView addSubview:introLabel];
    
    introView.autoresizesSubviews = YES;
    [introView setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    
//    introLabel.autoresizesSubviews = YES;
//    [introLabel setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    
//    introTitleLabel.autoresizesSubviews = YES;
//    [introTitleLabel setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
    
    return introView;
}



#pragma mark - All Event
- (void) clickOK:(id)sender {
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"인트로화면"     // Event category (required)
                                                              action:@"OK 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
    
    [self dismissViewControllerAnimated:YES completion:^{
        
    }];
}
- (void) clickRate:(id)sender {
    NSURL* url = [[NSURL alloc] initWithString:APPSTORE_URL];
    UIViewController *viewcontroller = nil;
//    if (!self.splitViewController) {
        viewcontroller = self;
//    } else {
//        viewcontroller = self.splitViewController;
//    }
    [[ExtraViewController shared] presentAppStoreForID:[NSNumber numberWithInt:APPSTORE_ID] viewcontroller:viewcontroller withURL:url block:^{ }];
    
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"인트로화면"     // Event category (required)
                                                              action:@"평가하기 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
}
- (void) clickShare:(id)sender {
    UIActionSheet *shareActionSheet = [[UIActionSheet alloc] initWithTitle:@"공유하기" delegate:self cancelButtonTitle:@"취소" destructiveButtonTitle:nil otherButtonTitles:@"카카오톡", @"문자", @"페이스북", @"트위터", nil];
    shareActionSheet.tag = 22;
    [shareActionSheet showInView:[UIApplication sharedApplication].keyWindow];
    
    if (ANALYTICSON) {
        // 구글 어널리틱스
        id<GAITracker> tracker = [[GAI sharedInstance] trackerWithTrackingId:GOOGLE_ANALYTICS_KEY];
        [tracker send:[[GAIDictionaryBuilder createEventWithCategory:@"인트로화면"     // Event category (required)
                                                              action:@"공유하기 클릭"  // Event action (required)
                                                               label:@"touchdown"          // Event label
                                                               value:nil] build]];    // Event value
    }
}
// 865f75ca435e66856986f4342bb456bf


#pragma mark - UIActionSheet Delegate
- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (actionSheet.tag==22) {
        if (buttonIndex==[actionSheet cancelButtonIndex]) {
            
        } else {
            NSURL *url = [NSURL URLWithString:WEBPAGE_URL];
            UIImage *image = [UIImage imageNamed:@"graphicimage_002"];
            NSString *imageURLString = @"http://14.49.37.33:8003/DSTWebManager/service_asset/img/graphicimage_002.png";
            NSString *text = [NSString stringWithFormat:@"if (컴공 공지 알림 서비스) {\n\tchar *url = \"%@\";\n\tdownload_follow_link(url);\n}", WEBPAGE_URL];
            [[ExtraViewController shared] shareWithViewController:self index:buttonIndex text:text image:image imageURLString:imageURLString url:url];
        }
    }
}

#pragma mark - UIPageControl event
- (void) pageChangeValue:(id)sender {
    UIPageControl *pControl = (UIPageControl *) sender;
    [mainScrollView setContentOffset:CGPointMake(pControl.currentPage*mainScrollView.frame.size.width, 0) animated:YES];
}




#pragma mark - UIScrollView Delegate
-(void)scrollViewDidScroll:(UIScrollView *)scrollView {
//    NSLog(@"scroll did scroll");
    CGFloat offsetX = mainScrollView.contentOffset.x;
    CGFloat scrollRate = offsetX/mainScrollView.contentSize.width;
    CGFloat scrollDist = (bgImageView.frame.size.width-winSize.height);
    if (!isipad) {
        bgImageView.center = CGPointMake(winSize.width/2.f+scrollDist*(.5f-scrollRate), self.view.frame.size.height/2.f);
    } else {
        scrollDist = (bgImageView.frame.size.width-winSize.height)/2.f;
        bgImageView.center = CGPointMake(winSize.width/2.f+scrollDist*(.5f-scrollRate), self.view.frame.size.height/2.f);
    }
    
    CGFloat offsetDist = -.5f;
    
    offsetDist = .2f;
    introTitleLabel001.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*0.f)*offsetDist, introTitleLabel001.center.y);
    introTitleLabel002.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*1.f)*offsetDist, introTitleLabel002.center.y);
    introTitleLabel003.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*2.f)*offsetDist, introTitleLabel003.center.y);
    introTitleLabel004.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*3.f)*offsetDist, introTitleLabel004.center.y);
    
    offsetDist = -.5f;
    introLabel001.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*0.f)*offsetDist, introLabel001.center.y);
    introLabel002.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*1.f)*offsetDist, introLabel002.center.y);
    introLabel003.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*2.f)*offsetDist, introLabel003.center.y);
    introLabel004.center = CGPointMake(winSize.width/2.f + (offsetX-mainScrollView.frame.size.width*3.f)*offsetDist, introLabel004.center.y);
    
    if (isipad) {
        if (offsetX<mainScrollView.frame.size.width) {
            if (introImageView001) {
                introImageView001.center = CGPointMake(introView001.frame.size.width/2.f+offsetX, introImageView001.center.y);
                CGFloat alpha = (mainScrollView.frame.size.width-offsetX)/mainScrollView.frame.size.width;
                if (alpha<0.f) alpha = 0.f;
                else if (alpha>1.f) alpha = 1.f;
                introImageView001.alpha = alpha;
            }
            if (introImageView002) {
                introImageView002.center = CGPointMake(introView002.frame.size.width/2.f+(offsetX-mainScrollView.frame.size.width), introImageView002.center.y);
                CGFloat alpha = offsetX/mainScrollView.frame.size.width;
                if (alpha<0.f) alpha = 0.f;
                else if (alpha>1.f) alpha = 1.f;
                introImageView002.alpha = alpha;
            }
        } else {
            introImageView001.center = CGPointMake(introView001.frame.size.width/2.f, introImageView001.center.y);
            introImageView001.alpha = 1;
            
            introImageView002.center = CGPointMake(introView002.frame.size.width/2.f, introImageView002.center.y);
            introImageView002.alpha = 1;
        }
        
    }
    
}
-(void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
//    NSLog(@"did end decelerating");
    CGFloat pageWidth = scrollView.frame.size.width;
    mainScrollPageControl.currentPage = floor((scrollView.contentOffset.x - pageWidth / 3) / pageWidth) + 1;
    if (mainScrollPageControl.currentPage==mainScrollPageControl.numberOfPages-1) {
        [UIView animateWithDuration:1.f animations:^{
            okButton.alpha = 1;
        }];
    }
}






@end
