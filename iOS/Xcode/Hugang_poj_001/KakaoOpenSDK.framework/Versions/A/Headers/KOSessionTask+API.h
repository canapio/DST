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


#import "KakaoPushMessageObject.h"

/*!
 @header KOSessionTask+API.h
 인증된 session 정보를 바탕으로 각종 API를 호출할 수 있습니다.
 */

/*!
 인증된 session 정보를 바탕으로 각종 API를 호출할 수 있습니다.
 */
@interface KOSessionTask (API)

/*!
 @abstract KOStoryPostPermission 스토리 포스팅 공개 범위
 @constant KOStoryPostPermissionPublic 전체공개
 @constant KOStoryPostPermissionFriend 친구공개
 */
typedef NS_ENUM(NSInteger, KOStoryPostPermission) {
    KOStoryPostPermissionPublic = 0,
    KOStoryPostPermissionFriend
};

/*!
 @abstract 현재 로그인된 사용자의 카카오톡 프로필 정보를 얻을 수 있습니다.
 @param completionHandler 카카오톡 프로필 정보를 얻어 처리하는 핸들러
 @discussion
 */
+ (instancetype)talkProfileTaskWithCompletionHandler:(KOSessionTaskCompletionHandler)completionHandler;

/*!
 @abstract 현재 로그인된 사용자의 카카오스토리 프로필 정보를 얻을 수 있습니다.
 @param completionHandler 스토리 프로필 정보를 얻어 처리하는 핸들러
 @discussion
 */
+ (instancetype)storyProfileTaskWithCompletionHandler:(KOSessionTaskCompletionHandler)completionHandler;

/*!
 @abstract 현재 로그인된 사용자에 대한 정보를 얻을 수 있습니다.
 @param completionHandler 사용자 정보를 얻어 처리하는 핸들러
 @discussion
 */
+ (instancetype)meTaskWithCompletionHandler:(KOSessionTaskCompletionHandler)completionHandler;

/*!
 @abstract 현재 로그인된 사용자의 속성(Property)를 설정할 수 있습니다.
 @param properties 갱신할 사용자 정보
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)profileUpdateTaskWithProperties:(NSDictionary*)properties
                              completionHandler:(void(^)(BOOL success, NSError* error))completionHandler;

/*!
 @abstract 카카오 플랫폼 서비스와 앱을 연결합니다(가입).
 @param properties 가입시 함께 설정할 사용자 정보
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)signupTaskWithProperties:(NSDictionary*)properties
                       completionHandler:(void(^)(BOOL success, NSError* error))completionHandler;

/*!
 @abstract 카카오 플랫폼 서비스와 앱 연결을 해제합니다(탈퇴).
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)unlinkTaskWithCompletionHandler:(void(^)(BOOL success, NSError* error))completionHandler;

/*!
 @abstract 로컬 이미지 파일을 카카오스토리에 업로드합니다.
 @deprecated Replaced by storyMultiImageUploadTaskWithImages in v1.0.7
 @param image (UIImage *) 형식의 한장의 이미지
 */
+ (instancetype)storyImageUploadTaskWithImage:(UIImage *)image completionHandler:(KOSessionTaskCompletionHandler)completionHandler;

/*!
 @abstract 로컬 이미지 파일을 데이타 형식으로 카카오스토리에 업로드합니다.
 @deprecated Replaced by storyMultiImageUploadTaskWithImageData in v1.0.7
 @param imageData (NSData *) 형식의 한장의 이미지
 */
+ (instancetype)storyImageUploadTaskWithImageData:(NSData *)imageData completionHandler:(KOSessionTaskCompletionHandler)completionHandler;

/*!
 @abstract 카카오 스토리에 포스팅합니다.
 @deprecated Replaced by storyPostNoteTaskWithContent or storyPostPhotoTaskWithImageUrls in v1.0.7
 @param content 내용
 @param imageUrl 이미지 url(storyImageUploadTaskWithImage 호출 후 반환되는 url을 설정)
 @param androidExecParam 안드로이드 앱연결 링크에 추가할 파라미터 설정
 @param iosExecParam iOS 앱연결 링크에 추가할 파라미터 설정
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)storyPostTaskWithContent:(NSString*)content
                              permission:(KOStoryPostPermission)permission
                                imageUrl:(NSString*)imageUrl
                        androidExecParam:(NSDictionary*)androidExecParam
                            iosExecParam:(NSDictionary*)iosExecParam
                       completionHandler:(void(^)(BOOL success, NSError* error))completionHandler;

/*! 
 @abstract Push 토큰 등록. /v1/user/me 에 해당하는 유저의 ID로 자동 등록. 이 메소드는 AdminKey가 아닌 AccessToken 기반으로 작동합니다.
 @param deviceToken APNS에 등록된 Device Token. 이 값이 Device ID로도 활용됨
 @param completionHandler 요청 완료시 실행될 핸들러. expiredAt은 등록한 푸시 토큰의 만료까지 남은 기간을 뜻합니다. 보통 30이 리턴되며 30일 남았음을 뜻합니다.
 */
+ (instancetype) pushRegisterDeviceWithToken:(NSData*) deviceToken
                           completionHandler:(void(^)(BOOL success, NSInteger expiredAt, NSError* error)) completionHandler;

/*!
 @abstract Push 토큰 삭제. 로그아웃할 때, 해당 기기에서 Push 알림 끄기 등등의 상황에서 사용. 이 메소드는 AdminKey가 아닌 AccessToken 기반으로 작동합니다.
 @param deviceToken APNS에 등록된 Device Token. 이 값이 Device ID로도 활용됨
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype) pushDeregisterDeviceWithToken:(NSData*) deviceToken
                             completionHandler:(void(^)(BOOL success, NSError* error)) completionHandler;

/*!
 @abstract 해당 유저의 모든 Push 토큰 삭제. 서비스 탈퇴 시 같이 사용 가능. 이 메소드는 AdminKey가 아닌 AccessToken 기반으로 작동합니다.
 */
+ (instancetype) pushDeregisterAllDeviceWithCompletionHandler:(void(^)(BOOL success, NSError* error)) completionHandler;

/*!
 @abstract Push 전송 (테스트용). 이 메소드는 테스트 목적으로 만들어졌으며, 해당 기기로 Push를 전송합니다. 실제 다른 사용자들에게 Push를 전송하기 위해서는 AdminKey 방식의 Push 전송 REST API를 사용해야 합니다.
 @param pushMsg Push 전송에 필요한 각종 메타 데이터
 @param receiverUserIds Push를 수신받을 유저 ID의 Array
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype) pushSendMsg:(KakaoPushMessageObject*) pushMsg
           completionHandler:(void(^)(BOOL success, NSError* error)) completionHandler;

/*!
 @abstract 카카오스토리의 특정 내스토리 정보를 얻을 수 있습니다.
 @param myStoryId 내스토리 정보(myStory)의 id(포스트 id). required.
 @param completionHandler 내스토리 정보를 얻어 처리하는 핸들러
 */
+ (instancetype)storyGetMyStoryTaskWithMyStoryId:(NSString *)myStoryId
                               completionHandler:(void(^)(KOStoryMyStoryInfo *myStory, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리의 복수개의 내스토리 정보들을 얻을 수 있습니다.
 @param lastMyStoryId 복수개의 내스토리 정보들을 얻기 위한 가장 최근의 내스토리 정보(myStory)의 id(포스트 id). 주어진 activity id의 시간을 기준으로 해당 id를 제외한 약 18개정도의 하위 myStory들이 반환된다. optional.
 @param completionHandler 내스토리 정보들을 얻어 처리하는 핸들러
 */
+ (instancetype)storyGetMyStoriesTaskWithLastMyStoryId:(NSString *)lastMyStoryId
                                     completionHandler:(void(^)(NSArray *myStories, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리에 스크랩을 하기 위한 링크 정보를 얻을 수 있습니다.
 @param url 스크랩을 하여 링크 정보를 얻기 위한 url. required.
 @param completionHandler 스토리 링크 정보를 얻어 처리하는 핸들러
 */
+ (instancetype)storyGetLinkInfoTaskWithUrl:(NSString *)url
                         completionHandler:(void(^)(KOStoryLinkInfo *link, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리에 글(노트)을 포스팅합니다.
 @param content 내용. required.
 @param permission permission으로 친구공개(KOStoryPostPermissionFriend) 또는 전체공개(KOStoryPostPermissionPublic). default KOStoryPostPermissionPublic. optional.
 @param sharable permission이 친구공개(KOStoryPostPermissionFriend)에 한해서 공유를 허용할지 안할지의 여부. default NO. optional.
 @param androidExecParam 안드로이드 앱연결 링크에 추가할 파라미터 설정. optional.
 @param iosExecParam iOS 앱연결 링크에 추가할 파라미터 설정. optional.
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)storyPostNoteTaskWithContent:(NSString *)content
                                  permission:(KOStoryPostPermission)permission
                                    sharable:(BOOL)sharable
                            androidExecParam:(NSDictionary *)androidExecParam
                                iosExecParam:(NSDictionary *)iosExecParam
                           completionHandler:(void(^)(KOStoryPostInfo *post, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리에 글(노트)을 포스팅합니다.
 @param content 내용. required.
 @param permission permission으로 친구공개(KOStoryPostPermissionFriend) 또는 전체공개(KOStoryPostPermissionPublic). default KOStoryPostPermissionPublic. optional.
 @param sharable permission이 친구공개(KOStoryPostPermissionFriend)에 한해서 공유를 허용할지 안할지의 여부. default NO. optional.
 @param androidMarketParam 안드로이드 앱연결 시 마켓으로 이동할 링크에 추가할 파라미터 설정. optional.
 @param iosMarketParam iOS 앱연결 시 마켓으로 이동할 링크에 추가할 파라미터 설정. optional.
 @param androidExecParam 안드로이드 앱연결 링크에 추가할 파라미터 설정. optional.
 @param iosExecParam iOS 앱연결 링크에 추가할 파라미터 설정. optional.
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)storyPostNoteTaskWithContent:(NSString *)content
                                  permission:(KOStoryPostPermission)permission
                                    sharable:(BOOL)sharable
                          androidMarketParam:(NSDictionary *)androidMarketParam
                              iosMarketParam:(NSDictionary *)iosMarketParam
                            androidExecParam:(NSDictionary *)androidExecParam
                                iosExecParam:(NSDictionary *)iosExecParam
                           completionHandler:(void(^)(KOStoryPostInfo *post, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리에 사진(들)을 포스팅합니다.
 @param imageUrls 이미지 url들을 포함한 array(storyMultiImageUploadTaskWithImages 호출 후 반환되는 url들을 설정). required.
 @param content 사진과 함께 할 내용. optional.
 @param permission permission으로 친구공개(KOStoryPostPermissionFriend) 또는 전체공개(KOStoryPostPermissionPublic). default KOStoryPostPermissionPublic. optional.
 @param sharable permission이 친구공개(KOStoryPostPermissionFriend)에 한해서 공유를 허용할지 안할지의 여부. default NO. optional.
 @param androidExecParam 안드로이드 앱연결 링크에 추가할 파라미터 설정. optional.
 @param iosExecParam iOS 앱연결 링크에 추가할 파라미터 설정. optional.
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)storyPostPhotoTaskWithImageUrls:(NSArray *)imageUrls
                                        content:(NSString *)content
                                     permission:(KOStoryPostPermission)permission
                                       sharable:(BOOL)sharable
                               androidExecParam:(NSDictionary *)androidExecParam
                                   iosExecParam:(NSDictionary *)iosExecParam
                              completionHandler:(void(^)(KOStoryPostInfo *post, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리에 사진(들)을 포스팅합니다.
 @param imageUrls 이미지 url들을 포함한 array(storyMultiImageUploadTaskWithImages 호출 후 반환되는 url들을 설정). required.
 @param content 사진과 함께 할 내용. optional.
 @param permission permission으로 친구공개(KOStoryPostPermissionFriend) 또는 전체공개(KOStoryPostPermissionPublic). default KOStoryPostPermissionPublic. optional.
 @param sharable permission이 친구공개(KOStoryPostPermissionFriend)에 한해서 공유를 허용할지 안할지의 여부. default NO. optional.
 @param androidMarketParam 안드로이드 앱연결 시 마켓으로 이동할 링크에 추가할 파라미터 설정. optional.
 @param iosMarketParam iOS 앱연결 시 마켓으로 이동할 링크에 추가할 파라미터 설정. optional.
 @param androidExecParam 안드로이드 앱연결 링크에 추가할 파라미터 설정. optional.
 @param iosExecParam iOS 앱연결 링크에 추가할 파라미터 설정. optional.
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)storyPostPhotoTaskWithImageUrls:(NSArray *)imageUrls
                                        content:(NSString *)content
                                     permission:(KOStoryPostPermission)permission
                                       sharable:(BOOL)sharable
                             androidMarketParam:(NSDictionary *)androidMarketParam
                                 iosMarketParam:(NSDictionary *)iosMarketParam
                               androidExecParam:(NSDictionary *)androidExecParam
                                   iosExecParam:(NSDictionary *)iosExecParam
                              completionHandler:(void(^)(KOStoryPostInfo *post, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리에 링크(스크랩 정보)를 포스팅합니다.
 @param linkInfo 스크랩(storyGetLinkInfoTaskWithUrl)을 통해 얻은 링크 객체. requried.
 @param content 스크랩을 통해 얻은 링크를 포스팅할 때 함께 할 내용. optional.
 @param permission permission으로 친구공개(KOStoryPostPermissionFriend) 또는 전체공개(KOStoryPostPermissionPublic). default KOStoryPostPermissionPublic. optional.
 @param sharable permission이 친구공개(KOStoryPostPermissionFriend)에 한해서 공유를 허용할지 안할지의 여부. default NO. optional.
 @param androidExecParam 안드로이드 앱연결 링크에 추가할 파라미터 설정
 @param iosExecParam iOS 앱연결 링크에 추가할 파라미터 설정
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)storyPostLinkTaskWithLinkInfo:(KOStoryLinkInfo *)linkInfo
                                      content:(NSString *)content
                                   permission:(KOStoryPostPermission)permission
                                     sharable:(BOOL)sharable
                             androidExecParam:(NSDictionary *)androidExecParam
                                 iosExecParam:(NSDictionary *)iosExecParam
                            completionHandler:(void(^)(KOStoryPostInfo *post, NSError *error))completionHandler;

/*!
 @abstract 카카오스토리에 링크(스크랩 정보)를 포스팅합니다.
 @param linkInfo 스크랩(storyGetLinkInfoTaskWithUrl)을 통해 얻은 링크 객체. requried.
 @param content 스크랩을 통해 얻은 링크를 포스팅할 때 함께 할 내용. optional.
 @param permission permission으로 친구공개(KOStoryPostPermissionFriend) 또는 전체공개(KOStoryPostPermissionPublic). default KOStoryPostPermissionPublic. optional.
 @param sharable permission이 친구공개(KOStoryPostPermissionFriend)에 한해서 공유를 허용할지 안할지의 여부. default NO. optional.
 @param androidMarketParam 안드로이드 앱연결 시 마켓으로 이동할 링크에 추가할 파라미터 설정. optional.
 @param iosMarketParam iOS 앱연결 시 마켓으로 이동할 링크에 추가할 파라미터 설정. optional.
 @param androidExecParam 안드로이드 앱연결 링크에 추가할 파라미터 설정
 @param iosExecParam iOS 앱연결 링크에 추가할 파라미터 설정
 @param completionHandler 요청 완료시 실행될 핸들러
 */
+ (instancetype)storyPostLinkTaskWithLinkInfo:(KOStoryLinkInfo *)linkInfo
                                      content:(NSString *)content
                                   permission:(KOStoryPostPermission)permission
                                     sharable:(BOOL)sharable
                           androidMarketParam:(NSDictionary *)androidMarketParam
                               iosMarketParam:(NSDictionary *)iosMarketParam
                             androidExecParam:(NSDictionary *)androidExecParam
                                 iosExecParam:(NSDictionary *)iosExecParam
                            completionHandler:(void(^)(KOStoryPostInfo *post, NSError *error))completionHandler;

/*!
 @abstract 로컬 이미지 파일 여러장을 카카오스토리에 업로드합니다.
 @param images jpeg을 위한 (UIImage *) 또는 gif를 위한 (NSData *) 형식의 여러장의 이미지 array. 최대 5개까지 허용.
 */
+ (instancetype)storyMultiImagesUploadTaskWithImages:(NSArray *)images
                                   completionHandler:(void(^)(NSArray *imageUrls, NSError *error))completionHandler;

@end
