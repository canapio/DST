//
//  ExtraViewController.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 28..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "ExtraViewController.h"

#import <MessageUI/MessageUI.h>
#import <StoreKit/StoreKit.h>
#import <KakaoOpenSDK/KakaoOpenSDK.h>
#import <Social/Social.h>
#import <Accounts/Accounts.h>

@interface ExtraViewController () <MFMailComposeViewControllerDelegate, SKStoreProductViewControllerDelegate, MFMessageComposeViewControllerDelegate>

@end

@implementation ExtraViewController
+ (instancetype)shared
{
    static ExtraViewController *_sharedClient = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedClient = [[super alloc] init];
    });
    
    return _sharedClient;
}



- (void) shareWithViewController:(UIViewController *)viewcontroller index:(NSInteger)buttonIndex text:(NSString *)text image:(UIImage *)image imageURLString:(NSString *)imageurl/*카톡 이미지 공유에서 쓰임*/ url:(NSURL *)url {
    
    if (buttonIndex==0) {
        // 카카오톡
        if ([KOAppCall canOpenKakaoTalkAppLink]) {
            // 카카오톡 공유
            [self kakaoWithText:text image:image imageURLString:imageurl];
        } else {
            // 카카오톡 설치
            [self openInstallKakaoAlert];
        }
    } else if (buttonIndex==1) {
        // 문자 메세지
        [self shareMessageWithViewController:viewcontroller text:text image:image];
    } else if (buttonIndex==2) {
        // 페이스북
        [self shareWithViewController:viewcontroller serviceType:SLServiceTypeFacebook Text:text image:image url:url];
    } else if (buttonIndex==3) {
        // 트위터
        [self shareWithViewController:viewcontroller serviceType:SLServiceTypeTwitter Text:text image:image url:url];
    }
}


#pragma mark - 메시지
- (void) shareMessageWithViewController:(UIViewController *)viewcontroller text:(NSString *)text image:(UIImage *)image {
    if(![MFMessageComposeViewController canSendText]) {
        UIAlertView *warningAlert = [[UIAlertView alloc] initWithTitle:@"메시지 보내기 기능을 지원하지 않습니다." message:@" " delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [warningAlert show];
        return;
    } else {
        MFMessageComposeViewController *controller = [[MFMessageComposeViewController alloc] init];
        if([MFMessageComposeViewController canSendText]) {
            controller.body = [NSString stringWithFormat:@"%@\n", text];
            
            controller.messageComposeDelegate = self;
            NSData *data = UIImageJPEGRepresentation(image, 0);
            [controller addAttachmentData:data typeIdentifier:@"image/jpg" filename:@"thumbnail.jpg"];
            [viewcontroller presentViewController:controller animated:YES completion:nil];
        }
    }
    
}
#pragma mark - 메시지 전송 delegate
- (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult)result {
    [controller dismissViewControllerAnimated:YES completion:nil];
}


#pragma mark - 카카오톡
- (void) kakaoWithText:(NSString *)text image:(UIImage *)image imageURLString:(NSString *)imageurl {
    // 카카오톡
    KakaoTalkLinkAction *androidAppAction
    = [KakaoTalkLinkAction createAppAction:KakaoTalkLinkActionOSPlatformAndroid
                                devicetype:KakaoTalkLinkActionDeviceTypePhone
                               marketparam:nil
                                 execparam:nil/*@{@"kakaoFromData":[NSString stringWithFormat:@"{seq:\"%@\", type:\"%@\"}", self.dataInfo[@"contentsSeq"], self.dataInfo[@"contentsType"]]}*/];
    
    KakaoTalkLinkAction *iphoneAppAction
    = [KakaoTalkLinkAction createAppAction:KakaoTalkLinkActionOSPlatformIOS
                                devicetype:KakaoTalkLinkActionDeviceTypePhone
                               marketparam:nil
                                 execparam:nil/*@{@"kakaoFromData":[NSString stringWithFormat:@"{seq:\"%@\", type:\"%@\"}", self.dataInfo[@"contentsSeq"], self.dataInfo[@"contentsType"]]}*/];
    
    // url 앱용 링크에 연결할 수 없는 플랫폼일 경우, 사용될 web url 지정
    // e.g. PC (Mac OS, Windows)
    KakaoTalkLinkAction *webLinkActionUsingPC
    = [KakaoTalkLinkAction createWebAction:WEBPAGE_URL];
    
    
    NSString *buttonTitle = @"부산대 컴공 앱으로 이동";
    
    
    NSMutableArray *linkArray = [NSMutableArray array];
    
    KakaoTalkLinkObject *button
    = [KakaoTalkLinkObject createAppButton:buttonTitle
                                   actions:@[androidAppAction, iphoneAppAction, webLinkActionUsingPC]];
    [linkArray addObject:button];
    
    /*[NSString stringWithFormat:@"%@ (%@)",[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"], LOC(@"msg_invite_kakao", @"경영전문대학원 MBA 모바일 주소록 앱")]*/
//    if (text) {
//        KakaoTalkLinkObject *label;
//        label = [KakaoTalkLinkObject createLabel:text];
//        [linkArray addObject:text];
//    }
    
    if (imageurl && image) {
        KakaoTalkLinkObject *kimage
        = [KakaoTalkLinkObject createImage:imageurl/*self.dataInfo[@"thumbnail1"]*/
                                     width:image.size.width
                                    height:image.size.height];
        [linkArray addObject:kimage];
    }
    
    @try {
        [KOAppCall openKakaoTalkAppLink:linkArray];
    }
    @catch (NSException *exception) {
        NSLog(@"%@", exception);
    }
    @finally {
        
    }
    
}
- (void) openInstallKakaoAlert {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"카카오톡이 설치되어 있지 않습니다."
                                                    message:@"카카오톡을 설치하겠습니까?"// @"Do you want to install the KakaoTalk?"
                                                   delegate:self
                                          cancelButtonTitle:@"취소"
                                          otherButtonTitles:@"확인", nil];
    alert.tag = 141;
    [alert show];
}
#pragma mark - Alert View Delegate
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    if (alertView.tag==141) {
        if (buttonIndex==[alertView cancelButtonIndex]) {
            // cancel
        } else {
            // 카카오톡 링크로 이동
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"https://itunes.apple.com/kr/app/id362057947"]];
        }
    }
    
}


#pragma mark - 페이스북 트위터
- (void) shareWithViewController:(UIViewController *)viewcontroller serviceType:(NSString *)serviceType Text:(NSString *)text image:(UIImage *)image url:(NSURL *)url {
    if ([SLComposeViewController isAvailableForServiceType:serviceType]) {
        
        SLComposeViewController *mySLComposerSheet = [SLComposeViewController composeViewControllerForServiceType:serviceType];
        
        if (url) [mySLComposerSheet addURL:url];
        
        if (text) [mySLComposerSheet setInitialText:text];
        
        if (image) [mySLComposerSheet addImage:image];
        
        
        
        [mySLComposerSheet setCompletionHandler:^(SLComposeViewControllerResult result) {
            
            switch (result) {
                case SLComposeViewControllerResultCancelled:
                    NSLog(@"Post Canceled");
                    break;
                case SLComposeViewControllerResultDone:
                    NSLog(@"Post Sucessful");
                    break;
                    
                default:
                    break;
            }
        }];
        
        [viewcontroller presentViewController:mySLComposerSheet animated:YES completion:nil];
    } else {
        if (serviceType==SLServiceTypeFacebook) {
            [[[UIAlertView alloc] initWithTitle:@"실패" message:@"페이스북 계정이 등록되어있지 않거나 페이스북을 지원하지 않습니다." delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else if (serviceType==SLServiceTypeTwitter) {
            [[[UIAlertView alloc] initWithTitle:@"실패" message:@"트위터 계정이 등록되어있지 않거나 트위터를 지원하지 않습니다." delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];
        } else {
            [[[UIAlertView alloc] initWithTitle:@"실패" message:@"공유에 실패했습니다." delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show];   
        }
        
    }
}



#pragma mark - 메일 보내기
- (void) sendFeedbackMailWithSubject:(NSString *)subject bodyMessage:(NSString *)bodyMessage receipients:(NSArray *)receipients viewcontroller:(UIViewController *)viewcontroller {
    // [self.popover dismissPopoverAnimated:NO];
    
    
    if ([MFMailComposeViewController canSendMail]) {
        // 로딩창 띄우기
        //        [[LoadingController shared] showLoadingWithTitle:nil];
        
        
        
        
        MFMailComposeViewController *mailViewController = [[MFMailComposeViewController alloc] init];
        mailViewController.mailComposeDelegate = self;
        [mailViewController setToRecipients:receipients];
        [mailViewController setSubject:subject];
        [mailViewController setMessageBody:bodyMessage isHTML:NO];
        
        
        [viewcontroller presentViewController:mailViewController animated:YES completion:nil];
        
        
    } else {
        NSLog(@"Device is unable to send email in its current state.");
    }
    
}
#pragma mark - 메일 닫기 Delegate
- (void) mailComposeController:(MFMailComposeViewController *)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError *)error {
    [controller dismissViewControllerAnimated:YES completion:nil];
}


#pragma mark - 앱스토어
- (void)presentAppStoreForID:(NSNumber *)appStoreID viewcontroller:(UIViewController *)viewcontroller withURL:(NSURL *)appStoreURL block:(void(^)(void))block {
    NSLog(@"presentAppStoreForID:");
    if(NSClassFromString(@"SKStoreProductViewController")) { // iOS6 이상인지 체크
        NSLog(@"NSClassFromString(@SKStoreProductViewController)");
        
        SKStoreProductViewController *storeController = [[SKStoreProductViewController alloc] init];
        storeController.delegate = self; // productViewControllerDidFinish
        
        NSDictionary *productParameters = @{ SKStoreProductParameterITunesItemIdentifier : appStoreID };
        
        
        [storeController loadProductWithParameters:productParameters completionBlock:^(BOOL result, NSError *error) {
            if (block) block();
            if (result) {
                storeController.navigationController.navigationBar.tintColor = [UIColor magentaColor];
                [viewcontroller presentViewController:storeController animated:YES completion:nil];
                
            } else {
                [[[UIAlertView alloc] initWithTitle:@"연결 실패" message:@"앱을 불러올 수 없습니다." delegate:nil cancelButtonTitle:@"확인" otherButtonTitles: nil] show];
            }
        }];
    } else { // iOS6 이하일 때
        [[UIApplication sharedApplication] openURL:appStoreURL];
        if (block) block();
    }
}
// 닫을 때
- (void)productViewControllerDidFinish:(SKStoreProductViewController *)viewController {
    [viewController dismissViewControllerAnimated:YES completion:nil];
}


@end
