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
 @header KOStoryMyStoryInfo.h
 카카오스토리의 내스토리 정보를 담고 있는 구조체.
 */

#import <Foundation/Foundation.h>

/*!
 @class KOStoryMyStoryInfo
 @discussion 카카오스토리의 내스토리 정보를 담고 있는 구조체.
 */

@interface KOStoryMyStoryInfo : NSObject

/*!
 @abstract KOStoryMediaType 스토리 포스팅 공개 범위에 대한 정의.
 @constant KOStoryMediaTypeUnknown 알수 없는 미디어 형식
 @constant KOStoryMediaTypeNotSupported 지원되지 않는 미디어 형식
 @constant KOStoryMediaTypeNote 텍스트 같은 노트 형식
 @constant KOStoryMediaTypePhoto 사진 이미지 같은 포토 형식
 */
typedef NS_ENUM(NSInteger, KOStoryMediaType) {
    KOStoryMediaTypeUnknown = 0,
    KOStoryMediaTypeNotSupported,
    KOStoryMediaTypeNote,
    KOStoryMediaTypePhoto
};

/*!
 @property ID
 @abstract 내스토리 정보의 id(포스트 id)
 */
@property (nonatomic, readonly) NSString *ID;

/*!
 @property content
 @abstract 내스토리 정보의 내용
 */
@property (nonatomic, readonly) NSString *content;

/*!
 @property mediaType
 @abstract 내스토리 정보의 미디어타입. 예) NOTE, PHOTO, LINK, UNKNOWN
 */
@property (nonatomic, readonly) KOStoryMediaType mediaType;

/*!
 @property createdAt
 @abstract 내스토리 정보의 생성시간. RFC3339를 따름.
 */
@property (nonatomic, readonly) NSString *createdAt;

/*!
 @property media
 @abstract 내스토리 정보의 미디어타입이 PHOTO일 경우 이미지 내용의 array. KOStoryMyStoryImageInfo 객체의 array.
 */
@property (nonatomic, readonly) NSArray *media;


-(id)initWithID:(NSString *)myStoryID
        content:(NSString *)content
      mediaType:(KOStoryMediaType)mediaType
      createdAt:(NSString *)createdAt
          media:(NSArray *)media;

- (NSString *) convertMediaTypeToString:(KOStoryMediaType)mediaType;

@end
