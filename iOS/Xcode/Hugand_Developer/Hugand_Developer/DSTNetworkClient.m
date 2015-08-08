//
//  DSTNetworkClient.m
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 5..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import "DSTNetworkClient.h"
#define SERVER_URL @"http://14.49.37.33:3003/DST"





@implementation DSTNetworkClient

+ (instancetype)manager
{
    static DSTNetworkClient *_sharedClient = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedClient = [super manager];
    });
    
    return _sharedClient;
}


#pragma mark - 공용으로 사용하는 메서드

- (void) getURL:(NSString *)url param:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    [self GET:url parameters:param success:^(AFHTTPRequestOperation *operation, id responseObject) {
        if (responseObject!=nil) {
            block(responseObject, nil);
        } else {
            block(nil, [NSError errorWithDomain:@"error" code:800 userInfo:nil]);
        }
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        block(nil, error);
    }];
}
- (void) postURL:(NSString *)url param:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    [self POST:url parameters:param success:^(AFHTTPRequestOperation *operation, id responseObject) {
        if (responseObject!=nil) {
            block(responseObject, nil);
        } else {
            block(nil, [NSError errorWithDomain:@"error" code:800 userInfo:nil]);
        }
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        block(nil, error);
    }];
}



- (void) showErrorMessage:(NSError *)error serverResult:(NSDictionary *)result {
    NSString *title;
    NSString *message;
    if (!result || [result[ERROR_CODE] intValue]==0) {
        title = @"네트워크 에러";
        message = @"인터넷이 불안정합니다";

    } else {
        title = @"서버 에러";
        message = [NSString stringWithFormat:@"서버 에러입니다. 관리자에게 문의하세요. \n(error code : %@)", result[ERROR_CODE]];
        
    }
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message:message delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil];
    [alert show];
}




#pragma mark - api list

/*
 param : {
     status:”e”
 }
 */
- (void)getFacultyList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    static NSString * const kAPIFacultyList = (SERVER_URL@"/facultylist");
    [self getURL:kAPIFacultyList param:param block:block];
}


/*
 param : {
     faculty_id:”ghj8jf8j293j9jqd”
     status:”e”
 }
 */
- (void)getLectureList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    static NSString * const kAPILectureList = (SERVER_URL@"/lecturelist");
    [self getURL:kAPILectureList param:param block:block];
}

/*
 param : {
     lecture_id:”ghj8jf8j293j9jqd”
     status:”e”
 }
 */
- (void)getPostList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    static NSString * const kAPIPostList = (SERVER_URL@"/postlist");
    [self getURL:kAPIPostList param:param block:block];
}



/*
 {
     pushid:”93jfjesafj8f8we932jfeasdi8fjasdf”, 
     lecture_id:”d8fh38fja”,
     status:”y”
 }
 */
- (void)postPushId:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    NSLog(@"post push id : param : %@", param);
    static NSString * const kAPIPushId = (SERVER_URL@"/setpushid");
    [self postURL:kAPIPushId param:param block:block];
}


/*
 param : {
    pushid:"fk92q3kfa9akw9fka9"
 }
 */
- (void)getFavoLectureList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    static NSString * const kAPIFavoLectureList = (SERVER_URL@"/favolecturelist");
    [self getURL:kAPIFavoLectureList param:param block:block];
}


/*
 param : { }
 */
- (void)getNoticeList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    static NSString * const kAPINoticeList = (SERVER_URL@"/noticelist");
    [self getURL:kAPINoticeList param:param block:block];
}


/*
 {
    pushid:”93jfjesafj8f8we932jfeasdi8fjasdf”,
    platform:"iOS"
 }
 */
- (void)getPushHistoryList:(NSDictionary *)param block:(void (^)(NSDictionary *result, NSError *error))block {
    static NSString * const kAPINoticeList = (SERVER_URL@"/pushhistorylist");
    [self getURL:kAPINoticeList param:param block:block];
}



- (void)postDeveloperPushId:(NSDictionary *)param block:(void (^)(NSDictionary *, NSError *))block {
    NSLog(@"post push id : param : %@", param);
    static NSString * const kAPIPushId = (SERVER_URL@"/setdeveloperpush");
    [self postURL:kAPIPushId param:param block:block];
}
@end
