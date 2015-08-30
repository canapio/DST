package com.pnucse.csenotice.Hugang;

import android.app.Application;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Dong on 2015-05-14.
 */
public class CustomApplication extends Application{

    //prof_id 저장
    String mStr = "";

    //push_id 저장
    String pushid = "";

    //Push_id는 처음 어플을 켰을 때만 등록. -> MainActivity
    public boolean pushPost;

    public Fragment02 favo_tab;
    //<lect_ID,Item>
    Map<String,LectureItem> fav_map = new HashMap<String,LectureItem>();
    @Override
    public void onCreate(){
        super.onCreate();
        mStr = "메롱";
        pushPost = false;
    }

    @Override
    public void onTerminate(){
        super.onTerminate();
    }

    public String getStr()
    {
        return mStr;
    }

    public void setStr(String Str){
        mStr = Str;

    }

    public String getPushid() { return pushid; }

    public void setPushid(String Str){
        pushid = Str;
        favo_tab.setpushid(Str);
    }

    public boolean getpushPost () { return pushPost; }

    public void setPushPost ( boolean a) { pushPost = a;}

    public LectureItem getMap_lect_item(String id){
        return fav_map.get(id);
    }

    public boolean findMap_lect_item(String id){
        return fav_map.containsKey(id);
    }

    public void setMap_lect_item (String id, LectureItem lect) {
        fav_map.put(id,lect);
    }

    public LectureItem delMap_lect_item( String id ) {
        return fav_map.remove(id);
    }
}
