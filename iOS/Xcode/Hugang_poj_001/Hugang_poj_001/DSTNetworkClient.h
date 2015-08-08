//
//  DSTNetworkClient.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 5..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "AFNetworking.h"


#define ERROR_CODE @"errcode"
#define ERROR_MSG @"errmsg"


@interface DSTNetworkClient : AFHTTPRequestOperationManager

+ (instancetype)manager;


// 3. 교수님 목록 조회 - Read (관리자, 사용자)
- (void)getFacultyList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;


// 6. 강의 목록 조회 - Read (관리자, 사용자)
- (void)getLectureList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;


// 9. 세부 목록 조회 - Read (관리자, 사용자)
- (void)getPostList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;




// 11. 안드로이드 유저 푸시 등록, 해제(즐겨찾기 등록, 해제) - Insert, Delete (사용자)
- (void)postPushId:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;

// 12. 즐겨찾기 목록 조회 - Read (사용자)
- (void)getFavoLectureList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;


// 14. 공지 목록 조회 - Read (관리자, 사용자)
- (void)getNoticeList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;

// 14. 푸시 히스토리 목록 조회 - Read (사용자)
- (void)getPushHistoryList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;





// 17. 안드로이드 유저 푸시 등록, 해제2(즐겨찾기 등록, 해제) - Insert, Delete (사용자)
- (void)postPushId2:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;

// 18. 즐겨찾기 목록 조회2 - Read (사용자)
- (void)getFavoLectureList2:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;

// 19. 푸시 히스토리 목록 조회2 - Read (사용자)
- (void)getPushHistoryList2:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block ;
@end
