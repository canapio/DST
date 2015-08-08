//
//  ExtraViewController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 6. 28..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ExtraViewController : NSObject
+ (instancetype)shared ;

- (void) shareWithViewController:(UIViewController *)viewcontroller index:(NSInteger)buttonIndex text:(NSString *)text image:(UIImage *)image imageURLString:(NSString *)imageurl/*카톡 이미지 공유에서 쓰임*/ url:(NSURL *)url;


- (void) sendFeedbackMailWithSubject:(NSString *)subject bodyMessage:(NSString *)bodyMessage receipients:(NSArray *)receipients viewcontroller:(UIViewController *)viewcontroller ;

- (void)presentAppStoreForID:(NSNumber *)appStoreID viewcontroller:(UIViewController *)viewcontroller withURL:(NSURL *)appStoreURL block:(void(^)(void))block ;
@end
