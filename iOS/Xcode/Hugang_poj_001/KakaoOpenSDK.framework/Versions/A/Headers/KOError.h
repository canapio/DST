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
 @header KOError.h
 KakaoOpenSDK 를 통해 카카오계정을 인증하거나 API를 호출할 때 발생하는 오류들을 정의합니다.
 */
#import <Foundation/Foundation.h>

extern NSString *const KOErrorDomain;

/*!
 @abstract 오류 코드 정의
 @constant  KOErrorUnknown 알 수 없는 오류
 @constant  KOErrorCancelled 오퍼레이션 취소를 나타냄
 @constant  KOErrorOperationInProgress 오퍼레이션이 진행 중간에 있음을 나타냄
 @constant  KOErrorTokenNotFound 로그인 상태를 기대하는 상황에서 인증 토큰이 없는 오류
 @constant  KOErrorDeactivatedSession 세션이 만료된(access_token, refresh_token이 모두 만료된 경우) 상태
 @constant  KOErrorAlreadyLoginedUser 로그인 된 상태(access_token, refresh_token이 존재 하는 경우)에서 다시 로그인 하려고 할때 발생하는 오류
 @constant  KOErrorBadResponse 요청에 대한 응답에 기대하는 값이 없거나 문제가 있음
 @constant  KOErrorNetworkError 네트워크 오류
 @constant  KOErrorHTTP http 프로토콜 오류
 @constant  KOErrorNotSupported 지원하지 않는 기능
 @constant  KOErrorBadParameter 파라미터 이상
 @constant  KOServerErrorUnknown 일반적인 서버 오류 응답. message를 확인해야 함
 @constant  KOServerErrorBadParameter 파라미터 이상
 @constant  KOServerErrorUnSupportedApi 지원되지 않은 API 호출
 @constant  KOServerErrorApiLimitExceed API 호출 횟수가 제한을 초과
 @constant  KOServerErrorNotSignedUpUser 미가입(가가입) 사용자
 @constant  KOServerErrorAlreadySignedUpUser 이미 가입된 사용자. 가입된 사용자에 대해 다시 가입 요청(앱 연결 요청)을 한 경우
 @constant  KOServerErrorNotKakaoAccountUser 카카오계정 유저가 아닐때
 @constant  KOServerErrorInvalidUserPropertyKey 등록되지 않은 user property key
 @constant  KOServerErrorNoSuchApp 존재하지 않는 앱
 @constant  KOServerErrorInvalidAccessToken access_token이 비정상적이거나 만료된 경우
 @constant  KOServerErrorInsufficientScope scope을 벗어난 api를 호출했을때
 @constant  KOServerErrorNotTalkUser 카카오톡 유저가 아닐때
 @constant  KOServerErrorNotStoryUser 카카오스토리 유저가 아닐때
 @constant  KOServerErrorStoryImageUploadSizeExceed 카카오스토리 이미지 업로드 사이즈 제한 초과
 @constant  KOServerErrorStoryUploadTimeout 카카오스토리 이미지 업로드시 타임아웃
 @constant  KOServerErrorStoryInvalidScrapUrl 카카오스토리 스크랩시 잘못된 스크랩 URL로 호출할 경우
 @constant  KOServerErrorStoryInvalidPostId 카카오스토리의 내정보 요청시 잘못된 내스토리 아이디(포스트 아이디)로 호출할 경우
 @constant  KOServerErrorStoryMaxUploadNumberExceed 카카오스토리 이미지 업로드시 허용된 업로드 파일 수가 넘을 경우
 @constant  KOServerErrorPushNotExistPushToken 존재하지 않는 푸시 토큰으로 푸시 전송을 하였을 경우
 @constant  KOServerErrorUnderMaintenance 서버 점검중
 */
typedef enum {
    KOErrorUnknown = 1,
    KOErrorCancelled = 2,
    KOErrorOperationInProgress = 3,
    KOErrorTokenNotFound = 4,
    KOErrorDeactivatedSession = 5,
    KOErrorAlreadyLoginedUser = 6,
    KOErrorBadResponse = 7,
    KOErrorNetworkError = 8,
    KOErrorHTTP = 9,
    KOErrorNotSupported = 10,
    KOErrorBadParameter = 11,
    
    KOServerErrorUnknown = -1,
    KOServerErrorBadParameter = -2,
    KOServerErrorUnSupportedApi = -3,
    KOServerErrorApiLimitExceed = -10,

    KOServerErrorNotSignedUpUser = -101,
    KOServerErrorAlreadySignedUpUser = -102,
    KOServerErrorNotKakaoAcccountUser = -103,
    
    KOServerErrorInvalidUserPropertyKey = -201,
    
    KOServerErrorNoSuchApp = -301,

    KOServerErrorInvalidAccessToken = -401,
    KOServerErrorInsufficientScope = -402,
    
    KOServerErrorNotTalkUser = -501,
    KOServerErrorNotStoryUser = -601,
    KOServerErrorStoryImageUploadSizeExceed = -602,
    KOServerErrorStoryUploadTimeout = -603,
    KOServerErrorStoryInvalidScrapUrl = -604,
    KOServerErrorStoryInvalidPostId = -605,
    KOServerErrorStoryMaxUploadNumberExceed = -606,
    
    KOServerErrorPushNotExistPushToken = -901,
    
    KOServerErrorUnderMaintenance = -9798

} KOErrorCode;
