//
//  FavoController.h
//  Hugang_poj_001
//
//  Created by GwakDoyoung on 2015. 5. 20..
//  Copyright (c) 2015년 GwakDoyoung. All rights reserved.
//

#import <Foundation/Foundation.h>


@protocol FavoDelegate <NSObject>

- (void) reloadTableView ;

@end

@interface FavoController : NSObject

@property (nonatomic, retain) NSString *pushid;

@property (nonatomic, retain) NSDictionary *tempparam;
@property (nonatomic, copy) void (^tempblock)(NSDictionary *result, NSError *error);

//@property (nonatomic, retain) NSDictionary *tempparam;
@property (nonatomic, copy) void (^tempfavolistblock)(void);

- (void) getPushId;


+ (instancetype)shared ;
@property (nonatomic, retain) id <FavoDelegate> delegate;



@property (nonatomic, retain) NSMutableArray *favoArray;
@property (nonatomic, retain) NSMutableDictionary *favoDic;


- (void) callFavoList:(NSString *)pushid block:(void (^)(NSDictionary *result, NSError *error))block ;

- (void) addFavo:(NSDictionary *)fObj ;
- (void) removeFavo:(NSDictionary *)fObj ;

//- (void) setFavoFlagWithLectureArray:(NSArray *)lectureArray ;

@end
