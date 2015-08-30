package com.pnucse.csenotice.Hugang;

/**
 * Created by Dong on 2015-06-20.
 */

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

public class MySQLiteHandler  {
    MySQLiteOpenHelper helper;
    SQLiteDatabase db;

    // 초기화 작업
    public MySQLiteHandler(Context context) {
        helper = new MySQLiteOpenHelper(context, "sample.sqlite", null, 1);
    }

    //open
    public static MySQLiteHandler open(Context context) {
        return new MySQLiteHandler(context);
    }

    //close
    public void close() {
        db.close();
    }

    //저장
    public void insert(String name) {
        db = helper.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("name", name);
        db.insert("history", null, values);
    }//end insert

    //수정
    /*
    public void update(String name, int age) {
        db = helper.getWritableDatabase();
        ContentValues values = new ContentValues();
        db.update("history", values, "name=?", new String[]{name});
    }//end update*/

    //삭제
    public void delete(String name) {
        db = helper.getWritableDatabase();
        db.delete("history", "name=?", new String[]{name});
    }//end delete

    //검색
    public Cursor select() {
        db = helper.getReadableDatabase();
        Cursor c = db.query("history", null, null, null, null, null, null);
        return c;
    }//end select

    public void removeAll()
    {
        // db.delete(String tableName, String whereClause, String[] whereArgs);
        // If whereClause is null, it will delete all rows.
        db = helper.getWritableDatabase(); // helper is object extends SQLiteOpenHelper
        db.delete("history", null, null);
    }
}//end class