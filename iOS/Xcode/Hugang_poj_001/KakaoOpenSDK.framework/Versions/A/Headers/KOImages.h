/**
 * Copyright 2014 Kakao Corp.
 *
 * Redistribution and modification in source or binary forms are not permitted without specific prior written permission.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*!
 @header
 카카오 관련 이미지들
 */
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/*!
 카카오 관련 이미지들
 */
@interface KOImages : NSObject

/*!
 버튼용 카카오 미니로고
 */
+ (UIImage*)kakaoLogoForButton;

/*!
 카카오 로고
 */
+ (UIImage*)kakaoLogo;

/*!
 카카오톡 아이콘
 */
+ (UIImage*)kakaoTalkIconForButton;

/*!
 카카오계정 아이콘
 */
+ (UIImage*)kakaoAccountIconForButton;

/*!
 웹뷰용
 */
+ (UIImage*)webViewBackButton;
+ (UIImage*)webViewButton;
+ (UIImage*)webViewHead;

@end
