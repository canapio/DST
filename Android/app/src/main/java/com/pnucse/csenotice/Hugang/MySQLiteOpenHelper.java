package com.pnucse.csenotice.Hugang;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

/**
 * Created by Dong on 2015-06-20.
 */
public class MySQLiteOpenHelper extends SQLiteOpenHelper {
    // 데이터베이스 생성
    public MySQLiteOpenHelper(Context context, String name, SQLiteDatabase.CursorFactory factory,
                              int version) {
        super(context, name, factory, version);
    }
    // 테이블 생성
    public void onCreate(SQLiteDatabase db) {
        Log.i("xxx", "onCreate >>>>>>>>>>>>>>>.....");

        String sql = "create table history ( " +
                " _id integer primary key autoincrement , " +
                " name text )";
        db.execSQL(sql);
    }//end onCreate
    // 테이블 삭제
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        Log.i("xxx", "onUpgrade >>>>>>>>>>>>>>>.....");

        String sql = "drop table if exists history";
        db.execSQL(sql);

        onCreate(db);
    }//end onUpgrade



}//end class