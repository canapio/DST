package com.pnucse.csenotice.Hugang;

import android.graphics.drawable.Drawable;

/**
 * Created by D
 * ong on 2015-04-10.
 */
public class IconTextItem {

    private Drawable mIcon;
    private String[] mData;
    private int order;
    private Drawable mIcon2;
    private boolean onwork;

    public IconTextItem(Drawable icon, String[] obj){
        mIcon = icon;
        mData = obj;
    }

    private boolean mSelectable = true;



    public IconTextItem(Drawable icon, String obj01, String obj02, Drawable icon2, String obj03, int aorder, boolean aonwork, String page_url) {
        mIcon = icon;
        mIcon2 = icon2;
        mData = new String[4];

        //교수님 이름
        mData[0] = obj01;

        //탭 카운터
        mData[1] = obj02;

        //교수 id
        mData[2] = obj03;

        //order
        order = aorder;

        //onwork 클릭 가능 or 불가능
        onwork=aonwork;

        mData[3]=page_url;

    }

    public boolean isSelectable() {
        return mSelectable;
    }

    /**
     * Set selectable flag
     */
    public void setSelectable(boolean selectable) {
        mSelectable = selectable;
    }

    public String[] getData() {
        return mData;
    }

    public int getOrder(){
        return order;
    }
    public String getData(int index){
        if (mData == null || index >= mData.length){
            return null;
        }

        return mData[index];
    }

    public void setData(String[] obj){
        mData=obj;
    }

    public void setIcon(Drawable icon){
        mIcon=icon;
    }

    public Drawable getIcon() {
        return mIcon;
    }

    public Drawable getIcon2() { return mIcon2;}

    public boolean getonwork(){ return onwork; }

    public int compareTo(IconTextItem other) {
        if (mData != null) {
            String[] otherData = other.getData();
            if (mData.length == otherData.length) {
                for (int i = 0; i < mData.length; i++) {
                    if (!mData[i].equals(otherData[i])) {
                        return -1;
                    }
                }
            } else {
                return -1;
            }
        } else {
            throw new IllegalArgumentException();
        }

        return 0;
    }


}

