package com.pnucse.csenotice.Hugang;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

/**
 * Created by Dong on 2015-06-21.
 */

//인터넷 연결 여부 검사 클래스
public class Seocnd {
    private Context context;
    public Seocnd(Context c){
        this.context = c;
    }
    public boolean InternetConnecting(){
        ConnectivityManager connect = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connect != null)
        {
            NetworkInfo[] information = connect.getAllNetworkInfo();
            if (information != null)
                for (int x = 0; x < information.length; x++)
                    if (information[x].getState() == NetworkInfo.State.CONNECTED)
                    {
                        return true;
                    }
        }
        return false;
    }
}
